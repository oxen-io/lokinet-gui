/* eslint-disable @typescript-eslint/no-explicit-any */
import Electron, { BrowserWindow, Tray } from 'electron';
import { initialLokinetRpcDealer } from './lokinetRpcCall';
import { IPC_CHANNEL_KEY, MINIMIZE_TO_TRAY } from './sharedIpc';
const { ipcMain } = Electron;

import * as rpcCalls from './lokinetRpcCall';
import * as lokinetProcessManager from './lokinetProcessManager';

export const eventsByJobId = Object.create(null);

export async function initializeIpcNodeSide(
  getMainWindow: () => BrowserWindow | null,
  tray: Tray
): Promise<void> {
  await initialLokinetRpcDealer();

  ipcMain.on(MINIMIZE_TO_TRAY, () => {
    const mainWindow = getMainWindow();
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    }
    if (tray) {
      (tray as any).updateContextMenu();
    }
  });

  ipcMain.on(IPC_CHANNEL_KEY, async (event, jobId, callName, ...args) => {
    try {
      let fn = (rpcCalls as any)[callName];
      if (!fn) {
        fn = (lokinetProcessManager as any)[callName];
        if (!fn) {
          throw new Error(
            `ipc channel: ${callName} is not an available function`
          );
        }
      }
      if (eventsByJobId[jobId]) {
        throw new Error(`There is already a event for this jobId ${jobId}`);
      }
      eventsByJobId[jobId] = event;
      // this call just trigger the RPC call. The reply will come from somewhere else
      await fn(jobId, ...args);
    } catch (error: any) {
      const errorForDisplay = error && error.msg ? error.msg : error;
      console.log(
        `ipc channel error with call ${callName}: ${errorForDisplay}`
      );
      delete eventsByJobId[jobId];
      event.sender.send(`${IPC_CHANNEL_KEY}-done`, jobId, error?.msg || null);
    }
  });
}
