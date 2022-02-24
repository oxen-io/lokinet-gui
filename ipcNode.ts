/* eslint-disable @typescript-eslint/no-explicit-any */
import Electron, { BrowserWindow, Tray } from 'electron';
import { initialLokinetRpcDealer } from './lokinetRpcCall';
import {
  IPC_CHANNEL_KEY,
  IPC_INIT_LOGS_RENDERER_SIDE,
  IPC_LOG_LINE,
  MINIMIZE_TO_TRAY
} from './sharedIpc';
const { ipcMain } = Electron;

import * as rpcCalls from './lokinetRpcCall';
import * as lokinetProcessManager from './lokinetProcessManager';

export const eventsByJobId = Object.create(null);

const logLineBuffers: Array<string> = [];
let isRendererReady = false;

let getMainWindowLocal: () => BrowserWindow | null;

export async function initializeIpcNodeSide(
  getMainWindow: () => BrowserWindow | null,
  tray: Tray
): Promise<void> {
  await initialLokinetRpcDealer();
  getMainWindowLocal = getMainWindow;

  ipcMain.on(MINIMIZE_TO_TRAY, () => {
    const mainWindow = getMainWindow();
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    }
    if (tray) {
      (tray as any).updateContextMenu();
    }
  });

  ipcMain.on(IPC_INIT_LOGS_RENDERER_SIDE, (event) => {
    isRendererReady = true;
    event.sender.send(IPC_INIT_LOGS_RENDERER_SIDE, logLineBuffers);
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

export function logLineToAppSide(logLine: string): void {
  // console.warn('logLine', logLine);
  const withTimestamp = `${logLine}`;
  if (isRendererReady) {
    console.warn(`logLine ready "${logLine}`);
    getMainWindowLocal()?.webContents.send(IPC_LOG_LINE, withTimestamp);
  } else {
    console.warn(`logLine buffered "${logLine}`);

    logLineBuffers.push(withTimestamp);
  }
}
