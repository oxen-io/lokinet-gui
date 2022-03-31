/* eslint-disable @typescript-eslint/no-explicit-any */
import { join } from 'path';

import { app, BrowserWindow, Menu, Tray } from 'electron';
let tray: Tray | null = null;
let trayContextMenu = null;

export function createTrayIcon(
  getMainWindow: () => BrowserWindow | null
): Tray {
  // keep the duplicated part to allow for search and find
  const iconFile =
    process.platform === 'darwin'
      ? 'lokinet-logo-white_16.png'
      : 'lokinet-logo-white_32.png';

  const icon = join(__dirname, '../', 'images', iconFile);
  tray = new Tray(icon);

  (tray as any).forceOnTop = (mainWindow: BrowserWindow) => {
    if (mainWindow) {
      // On some versions of GNOME the window may not be on top when restored.
      // This trick should fix it.
      // Thanks to: https://github.com/Enrico204/Whatsapp-Desktop/commit/6b0dc86b64e481b455f8fce9b4d797e86d000dc1
      mainWindow.setAlwaysOnTop(true);
      mainWindow.focus();
      mainWindow.setAlwaysOnTop(false);
    }
  };

  (tray as any).toggleWindowVisibility = () => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();

        (tray as any).forceOnTop(mainWindow);
      }
    }
    (tray as any).updateContextMenu();
  };

  (tray as any).showWindow = () => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      }

      (tray as any).forceOnTop(mainWindow);
    }
    (tray as any).updateContextMenu();
  };

  (tray as any).updateContextMenu = () => {
    const mainWindow = getMainWindow();

    if (!mainWindow) {
      return;
    }

    // NOTE: we want to have the show/hide entry available in the tray icon
    // context menu, since the 'click' event may not work on all platforms.
    // For details please refer to:
    // https://github.com/electron/electron/blob/master/docs/api/tray.md.
    trayContextMenu = Menu.buildFromTemplate([
      {
        id: 'toggleWindowVisibility',
        label: mainWindow.isVisible() ? 'Hide' : 'Show',
        click: (tray as any).toggleWindowVisibility
      },
      {
        id: 'quit',
        label: 'Quit',
        click: () => {
          mainWindow.destroy();
          app.quit.bind(app);
        }
      }
    ]);

    (tray as any).setContextMenu(trayContextMenu);
  };

  tray.on('click', (tray as any).showWindow);

  tray.setToolTip('Lokinet GUI');
  (tray as any).updateContextMenu();

  return tray;
}
