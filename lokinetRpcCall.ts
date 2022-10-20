/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { isString } from 'lodash';
import * as _zmq from 'zeromq/';

_zmq.context.blocky = false;

import {
  logLineToAppSide,
  sendGlobalErrorToAppSide,
  sendIpcReplyAndDeleteJob
} from './ipcNode';

const RPC_BOUND_PORT = 1190;
const RPC_BOUND_IP = '127.0.0.1';
const RPC_ZMQ_ADDRESS = `tcp://${RPC_BOUND_IP}:${RPC_BOUND_PORT}`;

let dealer: any; // ZeroMqDealer

let isRunning = false;

const request = async (
  cmd: string,
  reply_tag: string,
  args: string
): Promise<void> => {
  if (!cmd) {
    throw new Error(`Missing cmd`);
  }
  if (!reply_tag) {
    throw new Error(`You must use a reply tag for cmd ${cmd}`);
  }
  await dealer?.send([cmd, reply_tag, args]);
};

// LokinetApiClient::invoke
const invoke = async (
  endpoint: string,
  reply_tag: string,
  args: Record<string, unknown> | string
) => {
  const argsStringified = isString(args) ? args : JSON.stringify(args);
  await request(endpoint, reply_tag, argsStringified);
};

export const getSummaryStatus = async (reply_tag: string): Promise<void> => {
  await invoke('llarp.get_status', reply_tag, {});
};

export const addExit = async (
  reply_tag: string,
  exitAddress: string,
  exitToken?: string
): Promise<void> => {
  if (exitToken) {
    await invoke('llarp.exit', reply_tag, {
      exit: exitAddress,
      token: exitToken
    });
  } else {
    await invoke('llarp.exit', reply_tag, {
      exit: exitAddress
    });
  }
};

export const deleteExit = async (reply_tag: string): Promise<void> => {
  await invoke('llarp.exit', reply_tag, { unmap: true });
};

const LOG_MESSAGE_PUSH = 'log.message';
const LOG_SUBSCRIBE_TAG_PREFIX = 'enableLogs';
let lastEnableLogsRequestTimestamp: number | undefined;

export const subscribeLokinetLogs = async (): Promise<void> => {
  await invoke(
    'llarp.logs',
    `${LOG_SUBSCRIBE_TAG_PREFIX}-${Date.now()}`,
    LOG_MESSAGE_PUSH
  );
  lastEnableLogsRequestTimestamp = Date.now();
};

export const closeRpcConnection = (): void => {
  isRunning = false;
  console.info('stopping rpc dealer');
  if (dealer) {
    try {
      dealer.close();
      dealer = null;
    } catch (e) {
      console.info(e);
    }
  }
};

function sendEnableLogsAgainIfNeeded() {
  if (
    lastEnableLogsRequestTimestamp &&
    Date.now() - lastEnableLogsRequestTimestamp > 30 * 1000
  ) {
    subscribeLokinetLogs();
  }
}

const loopDealerReceiving = async (): Promise<void> => {
  try {
    dealer.connect(RPC_ZMQ_ADDRESS);
    console.log(`Connected to port ${RPC_BOUND_PORT}`);
    isRunning = true;
    while (isRunning) {
      const reply = (await dealer.receive()) as Array<Buffer>;
      const replyLength = reply.length;

      if (replyLength > 1) {
        const replyType = reply[0].toString('utf8');
        switch (replyType) {
          case 'REPLY':
            if (replyLength === 3) {
              const jobId = reply[1].toString('utf8');
              const content = reply[2].toString('utf8');

              if (jobId.startsWith(LOG_SUBSCRIBE_TAG_PREFIX)) {
                // we do not have an ipc call to forward that specific call
                break;
              }
              sendIpcReplyAndDeleteJob(jobId, null, content);
            }
            break;
          case LOG_MESSAGE_PUSH:
            if (reply.length > 1) {
              const logMessages = reply.slice(1).map((m) => m.toString('utf8'));
              if (logMessages) {
                logMessages.forEach(logLineToAppSide);
              }
            }
            break;
          default:
            break;
        }
      }

      sendEnableLogsAgainIfNeeded();
    }
  } catch (e) {
    if (isRunning) {
      console.error(
        `Got an exception while trying to bind to ${RPC_ZMQ_ADDRESS}:`,
        e
      );
    }
  }
};

export const initialLokinetRpcDealer = async (): Promise<void> => {
  if (dealer) {
    throw new Error('RPC Channel is already init.');
  }

  dealer = new _zmq.Dealer({
    sendTimeout: 1000,
    connectTimeout: 5000
  });
  // just trigger the non blocking loop
  void loopDealerReceiving();
};
