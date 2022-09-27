/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow, screen, Tray } from 'electron';
import { initializeIpcNodeSide } from './ipcNode';
import { doStopLokinetProcess } from './lokinetProcessManager';
import { closeRpcConnection } from './lokinetRpcCall';
import { createTrayIcon } from './trayIcon';
import { markShouldQuit, shouldQuit } from './windowState';

import ElectronStore from 'electron-store';
import {
  getDefaultOnExitDo,
  OnExitStopSetting,
  SETTINGS_ID_SELECTED_THEME,
  SETTINGS_ID_STOP_ON_EXIT
} from './types';
import { darkTheme, lightTheme } from './src/app/theme';

let store: ElectronStore | undefined;
const configScreenIndex = 'screen_index';

let mainWindow: BrowserWindow | null;
let tray: Tray | null = null;
let ready = false;

function isMacOS() {
  return process.platform === 'darwin';
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function getTrayIcon(): Tray | null {
  return tray;
}

async function createWindow() {
  if (!store) {
    store = new ElectronStore();
  }

  let validScreenIndexToUse: number | undefined;

  const allDisplays = screen.getAllDisplays();
  if (store.has(configScreenIndex)) {
    const screenIndexFromStore = store.get(configScreenIndex) as
      | number
      | undefined;

    if (
      screenIndexFromStore !== undefined &&
      allDisplays.length <= screenIndexFromStore
    ) {
      validScreenIndexToUse = screenIndexFromStore;
    }
  }
  const openDevTools = process.env.OPEN_DEV_TOOLS || false;
  const defaultHeight = 850;
  const defaultWidth = openDevTools ? 1250 : 450;

  const indexToUse = validScreenIndexToUse || 0;
  const sz = allDisplays[indexToUse].size;
  const bounds = allDisplays[indexToUse].bounds;

  const displayWidth = Math.max(sz.width, sz.height);
  const displayHeight = Math.min(sz.width, sz.height);

  const scaleFactorDiy = Math.min(displayWidth / 1920, displayHeight / 1080);
  console.warn(scaleFactorDiy);

  const width = defaultWidth * scaleFactorDiy;
  const height = defaultHeight * scaleFactorDiy;

  const selectedTheme = store.get(SETTINGS_ID_SELECTED_THEME, 'light');

  mainWindow = new BrowserWindow({
    width,
    height,
    minHeight: height,
    minWidth: 450,
    resizable: true,

    icon: './build/icon.png',
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      webSecurity: true,
      zoomFactor: scaleFactorDiy
    },
    backgroundColor:
      selectedTheme === 'light'
        ? lightTheme.backgroundColor
        : darkTheme.backgroundColor,
    autoHideMenuBar: true,
    frame: false,
    x: Math.floor(bounds.x + bounds.width / 2 - width / 2),
    y: Math.floor(bounds.y + bounds.height / 2 - height / 2)
  });
  ready = true;
  if (!isMacOS()) {
    tray = createTrayIcon(getMainWindow);
  }

  mainWindow.loadFile('./dist/index.html');
  if (openDevTools) {
    mainWindow.webContents.openDevTools({ mode: 'right' });
  }

  // if you hide the menu the shortcut CTLR-Q won't work
  // mainWindow.removeMenu();
  await initializeIpcNodeSide(getMainWindow);

  // Emitted when the window is about to be closed.
  // Note: We do most of our shutdown logic here because all windows are closed by
  //   Electron before the app quits.
  mainWindow.on('close', async (e) => {
    if (!mainWindow || shouldQuit()) {
      return;
    }
    // Prevent the shutdown
    e.preventDefault();
    mainWindow.hide();

    // toggle the visibility of the show/hide tray icon menu entries
    if (!isMacOS()) {
      (tray as any)?.updateContextMenu();
    }

    return;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('before-quit', () => {
  console.log('before-quit event');
  closeRpcConnection();

  const todoOnExit: OnExitStopSetting =
    (store?.get(
      SETTINGS_ID_STOP_ON_EXIT,
      getDefaultOnExitDo()
    ) as OnExitStopSetting) || getDefaultOnExitDo();
  console.info('todoOnExit', todoOnExit);
  if (todoOnExit === 'stop_everything') {
    void doStopLokinetProcess('stop_everything', true);
  }

  tray?.destroy();

  markShouldQuit();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!ready) {
    return;
  }

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow) {
    mainWindow.show();
  } else {
    createWindow();
  }
});

// Defense in depth. We never intend to open webviews or windows. Prevent it completely.
app.on('web-contents-created', (createEvent, contents) => {
  contents.on('will-attach-webview', (attachEvent) => {
    attachEvent.preventDefault();
  });
  contents.on('new-window', (newEvent) => {
    newEvent.preventDefault();
  });
});

app.on('ready', createWindow);
app.allowRendererProcessReuse = true;
