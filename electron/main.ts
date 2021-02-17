import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  const ratio = 1.6;
  const width = 400;
  const isDev = process.env.NODE_ENV === 'development';
  mainWindow = new BrowserWindow({
    width: isDev? 1200: width,
    height: isDev ? 800 : width * ratio,
    resizable: isDev || false,
    webPreferences: {
      nodeIntegration: true,
      devTools: isDev,
    },
    backgroundColor: '#323641',
  });

  if (isDev) {
    mainWindow.loadURL(`http://localhost:4000`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
          pathname: path.join(__dirname, '../index.html'),
          protocol: 'file:',
          slashes: true
      })
    );
  }
  mainWindow.removeMenu();
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);
app.allowRendererProcessReuse = true;