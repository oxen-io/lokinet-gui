import { app, BrowserWindow } from 'electron';
import { readdir } from 'original-fs';
import * as path from 'path';
import * as url from 'url';
import { initializeIpcNodeSide } from './ipcNode';

let mainWindow: BrowserWindow | null;

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

  if (isDev) {
    mainWindow.loadURL(`http://localhost:4000`);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const pathname = path.join(__dirname, 'index.html');
    console.warn('mainwindow loadingURL main as: ', pathname);
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

app.on('ready', createWindow);
app.allowRendererProcessReuse = true;
