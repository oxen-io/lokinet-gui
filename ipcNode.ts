/* eslint-disable @typescript-eslint/no-explicit-any */
import Electron, { BrowserWindow } from 'electron';
import { initialLokinetRpcDealer } from './lokinetRpcCall';
import {
  IPC_CHANNEL_KEY,
  IPC_GLOBAL_ERROR,
  IPC_LOG_LINE,
  StatusErrorType
} from './sharedIpc';
const { ipcMain } = Electron;

import * as rpcCalls from './lokinetRpcCall';
import * as lokinetProcessManager from './lokinetProcessManager';
import * as utilityIPCCalls from './utilityIPCCalls';

const eventsByJobId: Record<string, Electron.IpcMainEvent> =
  Object.create(null);

const getEventByJobId = (jobId: string): Electron.IpcMainEvent => {
  const event = eventsByJobId[jobId];

  if (!event) {
    throw new Error(`Could not find the event for jobId ${jobId}`);
  }
  return event;
};

const deleteJobId = (jobId: string) => {
  if (eventsByJobId[jobId]) {
    delete eventsByJobId[jobId];
  }
};

export const sendIpcReplyAndDeleteJob = (
  jobId: string,
  error: any,
  result: string | undefined
) => {
  try {
    const event = getEventByJobId(jobId);
    event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, error, result);
    deleteJobId(jobId);
  } catch (e: any) {
    console.warn(
      `sendIpcReplyAndDeleteJob for ${jobId} failed with `,
      e.message
    );
  }
};

let getMainWindowLocal: () => BrowserWindow | null;

/**
 * Returns the function to call for that RPC call, so with zeromq client, or undefined.
 */
function isRpcCall(fnName: string) {
  return (rpcCalls as any)[fnName];
}

/**
 * Returns the function to call for that Lokinet Process Manager call, or undefined.
 */
function isLokinetProcessManagerCall(fnName: string) {
  return (lokinetProcessManager as any)[fnName];
}

/**
 * Returns the function to call for that Utility IPC call.
 */
function isUtilityCall(fnName: string) {
  return (utilityIPCCalls as any)[fnName];
}

export async function initializeIpcNodeSide(
  getMainWindow: () => BrowserWindow | null
): Promise<void> {
  await initialLokinetRpcDealer();
  getMainWindowLocal = getMainWindow;

  ipcMain.on(IPC_CHANNEL_KEY, async (event, jobId, callName, ...args) => {
    try {
      // Try to find a matching rpc call, or a matching lokinetProcessManager call or a matching utility call
      const rpcCall = isRpcCall(callName);
      const lokinetProcessManagerCall = isLokinetProcessManagerCall(callName);
      const utilityCall = isUtilityCall(callName);

      const fnToCall = rpcCall || lokinetProcessManagerCall || utilityCall;
      if (!fnToCall) {
        // if that fn is not defined at all, there is not much we can do.
        throw new Error(
          `ipc channel: ${callName} is not an available function`
        );
      }
      if (eventsByJobId[jobId]) {
        throw new Error(`There is already a event for this jobId ${jobId}`);
      }
      eventsByJobId[jobId] = event;
      // this call just trigger the RPC call. The reply will come from somewhere else
      await fnToCall(jobId, ...args);
      // event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, null);
    } catch (error: any) {
      const errorForDisplay = error && error.msg ? error.msg : error;
      console.log(
        `ipc channel error with call ${callName}: ${errorForDisplay}`
      );

      sendIpcReplyAndDeleteJob(jobId, errorForDisplay || null, '');
    }
  });
}

export function logLineToAppSide(logLine: string): void {
  const withTimestamp = `${logLine}`;
  if (utilityIPCCalls.getRendererReady()) {
    console.info(`logLine ready "${logLine}`);
    getMainWindowLocal()?.webContents.send(IPC_LOG_LINE, withTimestamp);
  } else {
    console.info('logLineToAppSide : renderer is not ready');
  }
}

export function sendGlobalErrorToAppSide(globalError: StatusErrorType): void {
  if (utilityIPCCalls.getRendererReady()) {
    console.info(`sendGlobalErrorToAppSide: global error "${globalError}`);
    getMainWindowLocal()?.webContents.send(IPC_GLOBAL_ERROR, globalError);
  } else {
    console.info('sendGlobalErrorToAppSide : renderer is not ready');
  }
}
