import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { initializeIpcNodeSide } from './ipcNode';

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  const height = 650;
  const width = 400;

  const isDev = process.env.NODE_ENV === 'development';
  mainWindow = new BrowserWindow({
    width,
    height,
    minHeight: height,
    minWidth: width,
    resizable: true,
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
    mainWindow.loadURL(
      url.format({
        pathname,
        protocol: 'file:',
        slashes: true
      })
    );
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
