import Electron from 'electron';
import { initialLokinetRpcDealer } from './lokinetRpcCall';
import { IPC_CHANNEL_KEY } from './sharedIpc';
const { ipcMain } = Electron;

import { exec } from 'child_process';

function execute(command: string, callback: any) {
  exec(command, (error, stdout, stderr) => {
    callback(stdout);
  });
}

import * as rpcCalls from './lokinetRpcCall';

export const eventsByJobId = Object.create(null);

export async function initializeIpcNodeSide(): Promise<void> {
  await initialLokinetRpcDealer();

  // call the function
  execute('ping -c 4 0.0.0.0', (output: string) => {
    console.log(output);
  });

  ipcMain.on(IPC_CHANNEL_KEY, async (event, jobId, callName, ...args) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fn = (rpcCalls as any)[callName];
      if (!fn) {
        throw new Error(
          `ipc channel: ${callName} is not an available function`
        );
      }
      if (eventsByJobId[jobId]) {
        throw new Error(`There is already a event for this jobId ${jobId}`);
      }
      eventsByJobId[jobId] = event;
      // this call just trigger the RPC call. The reply will come from somewhere else
      await fn(jobId, ...args);
    } catch (error) {
      const errorForDisplay = error && error.stack ? error.stack : error;
      console.log(
        `ipc channel error with call ${callName}: ${errorForDisplay}`
      );
      delete eventsByJobId[jobId];
      event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, errorForDisplay);
    }
  });
}
