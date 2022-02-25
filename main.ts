/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow, Tray } from 'electron';
import { initializeIpcNodeSide, logLineToAppSide } from './ipcNode';
import { doStopLokinetProcess } from './lokinetProcessManager';
import { closeRpcConnection } from './lokinetRpcCall';
import { createTrayIcon } from './trayIcon';
import { markShouldQuit, shouldQuit } from './windowState';

let mainWindow: BrowserWindow | null;
let tray: Tray | null = null;
let ready = false;

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function getTrayIcon(): Tray | null {
  return tray;
}

async function createWindow() {
  const openDevTools = false;
  const height = 850; // 850
  const width = openDevTools ? 1000 : 450; // 450

  const isDev = process.env.NODE_ENV === 'development';

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minHeight: height,
    minWidth: 450,
    resizable: true,
    icon: './build/icon.png',
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      webSecurity: true,
      zoomFactor: 1.0
    },
    backgroundColor: '#fff',
    autoHideMenuBar: true,
    frame: false
  });
  ready = true;

  tray = createTrayIcon(getMainWindow);

  if (isDev) {
    mainWindow.loadURL(`http://localhost:4000`);
    if (openDevTools) {
      mainWindow.webContents.openDevTools({ mode: 'right' });
    }
  } else {
    mainWindow.loadFile('./dist/index.html');
    if (openDevTools) {
      mainWindow.webContents.openDevTools({ mode: 'right' });
    }
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

    (tray as any)?.updateContextMenu();

    return;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('before-quit', () => {
  console.log('before-quit event');
  void closeRpcConnection();
  if (!process.env.DISABLE_AUTO_START_STOP) {
    void doStopLokinetProcess();
  } else {
    logLineToAppSide(
      'ENV "DISABLE_AUTO_START_STOP" is set, not auto starting lokinet daemon'
    );
  }

  if (tray) {
    tray.destroy();
  }
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
