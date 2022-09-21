import { sendIpcReplyAndDeleteJob } from './ipcNode';

import { getMainWindow, getTrayIcon } from './main';

let isRendererReady = false;

export function markRendererReady(jobId: string): void {
  isRendererReady = true;

  sendIpcReplyAndDeleteJob(jobId, null, '');
}

export function minimizeToTray(jobId: string): void {
  const mainWindow = getMainWindow();
  if (mainWindow?.isVisible()) {
    mainWindow.hide();
  }

  const tray = getTrayIcon();
  if (tray) {
    (tray as any).updateContextMenu();
  }
  sendIpcReplyAndDeleteJob(jobId, null, '');
}

export const getRendererReady = (): boolean => isRendererReady;
