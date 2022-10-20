import { sendIpcReplyAndDeleteJob } from './ipcNode';
import { subscribeLokinetLogs } from './lokinetRpcCall';

import { getMainWindow, getTrayIcon } from './main';

let isRendererReady = false;

export function markRendererReadyOnNodeSide(jobId: string): void {
  isRendererReady = true;

  sendIpcReplyAndDeleteJob(jobId, null, '');
  subscribeLokinetLogs();
}

export function minimizeToTray(jobId: string): void {
  const mainWindow = getMainWindow();
  if (mainWindow?.isVisible()) {
    mainWindow.hide();
  }

  const tray = getTrayIcon();

  (tray as any)?.updateContextMenu();

  sendIpcReplyAndDeleteJob(jobId, null, '');
}

export const getRendererReady = (): boolean => isRendererReady;
