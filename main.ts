import { app, BrowserWindow, Tray } from 'electron';
import * as path from 'path';
import { initializeIpcNodeSide } from './ipcNode';
import { createTrayIcon } from './trayIcon';

let mainWindow: BrowserWindow | null;
let tray: Tray | null = null;
let ready = false;

function getMainWindow() {
  return mainWindow;
}
function createWindow() {
  const height = 650;
  const width = 450;

  const isDev = process.env.NODE_ENV === 'development';
  mainWindow = new BrowserWindow({
    width,
    height,
    minHeight: height,
    minWidth: width,
    resizable: true,
    icon: './build/icon.png',
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      webSecurity: true
    },
    backgroundColor: '#323641',
    autoHideMenuBar: true
  });
  ready = true;

  tray = createTrayIcon(getMainWindow);

  if (isDev) {
    mainWindow.loadURL(`http://localhost:4000`);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile('./dist/index.html');
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
  // if you hide the menu the shortcut CTLR-Q won't work
  // mainWindow.removeMenu();
  void initializeIpcNodeSide();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('before-quit', () => {
  console.log('before-quit event');

  if (tray) {
    tray.destroy();
  }
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
