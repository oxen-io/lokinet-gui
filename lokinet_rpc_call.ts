/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ipcMain } from 'electron';
import { Dealer as ZeroMqDealer } from 'zeromq';
import { eventsByJobId } from './ipc_node';
import { DEBUG_RPC_CALLS, IPC_CHANNEL_KEY } from './shared_ipc';

const RPC_BOUND_PORT = 1190;
const RPC_BOUND_IP = '127.0.0.1';
const RPC_ZMQ_ADDRESS = `tcp://${RPC_BOUND_IP}:${RPC_BOUND_PORT}`;

let dealer: ZeroMqDealer;

let isRunning = false;

const request = async (
  cmd: string,
  reply_tag: string,
  _opts: any
): Promise<void> => {
  if (!cmd) {
    throw new Error(`Missing cmd`);
  }
  if (!reply_tag) {
    throw new Error(`You must use a reply tag for cmd ${cmd}`);
  }
  if (DEBUG_RPC_CALLS) {
    console.info(`\t====> sending RPC  cmd:${cmd};  reply_tag:${reply_tag}`);
  }
  await dealer.send([cmd, reply_tag, _opts]);
};

// LokinetApiClient::invoke
const invoke = async (
  endpoint: string,
  reply_tag: string,
  args: Record<string, unknown>
) => {
  const req = JSON.stringify(args);
  await request(endpoint, reply_tag, req);
};

export const getUpTimeAndVersion = async (reply_tag: string): Promise<void> => {
  await invoke('llarp.version', reply_tag, {});
};

export const getStatus = async (reply_tag: string): Promise<void> => {
  await invoke('llarp.status', reply_tag, {});
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
    await invoke('llarp.exit', reply_tag, { exit: exitAddress });
  }
};

export const deleteExit = async (reply_tag: string): Promise<void> => {
  await invoke('llarp.exit', reply_tag, { unmap: true });
};

export const setConfig = async (
  reply_tag: string,
  section: string,
  key: string,
  value: string
): Promise<void> => {
  const obj: { [k: string]: any } = {};
  const config: { [k: string]: string } = {};
  config[key] = value;
  obj[section] = config;
  await invoke('llarp.config', reply_tag, { override: obj, reload: true });
};

export const close = (): void => {
  isRunning = false;
  if (dealer) {
    dealer.close();
  }
};

const loopDealerReceiving = async (): Promise<void> => {
  // TODO handle exception in the loop so the loop is not exited if the error is not that bad
  try {
    dealer.connect(RPC_ZMQ_ADDRESS);
    console.log(`Connected to port ${RPC_BOUND_PORT}`);
    isRunning = true;
    while (isRunning) {
      const reply = await dealer.receive();
      const replyLength = reply.length;

      if (replyLength === 3) {
        const replyType = reply[0].toString('utf8');
        if (replyType === 'REPLY') {
          const jobId = reply[1].toString('utf8');
          const content = reply[2].toString('utf8');
          const event = eventsByJobId[jobId];

          if (!event) {
            throw new Error(`Could not find the event for jobId ${jobId}`);
          }
          if (DEBUG_RPC_CALLS) {
            console.info(
              `\t<==== received RPC  jobId:${jobId};  content:${content}`
            );
          }
          event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null, content);
          delete eventsByJobId[jobId];
        } else {
          // delete eventsByJobId[jobId];
          throw new Error('To handle');
        }
      } else {
        throw new Error('To handle');

        console.warn('Got an invalid reply of length', replyLength);
        if (replyLength === 2) {
          const jobId = reply[1].toString('utf8');
          ipcMain.emit(
            `${IPC_CHANNEL_KEY}-done`,
            jobId,
            'Got an invalid reply of length'
          );
        }
      }
    }
  } catch (e) {
    console.error(
      `Got an exception while trying to bind to ${RPC_ZMQ_ADDRESS}:`,
      e
    );
  }
};

export const initialLokinetRpcDealer = async (): Promise<void> => {
  if (dealer) {
    throw new Error('RPC Channel is already init.');
  }

  dealer = new ZeroMqDealer();
  // just trigger the loop, non blocking
  void loopDealerReceiving();
};
