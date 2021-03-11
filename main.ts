import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
// import { initializeIpcNodeSide } from './ipc_node';

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  const ratio = 1.6;
  const width = 400;
  const isDev = process.env.NODE_ENV === 'development';
  console.warn('process.env.NODE_ENV', process.env.NODE_ENV)
  mainWindow = new BrowserWindow({
    width: isDev ? 1200 : width,
    height: isDev ? 800 : width * ratio,
    resizable: true, // isDev || false,
    webPreferences: {
      nodeIntegration: true,
      devTools: true, //isDev
      webSecurity: false
    },
    backgroundColor: '#323641'
  });

  if (isDev) {
    mainWindow.loadURL(`http://localhost:4000`);
    mainWindow.webContents.openDevTools();
  } else {
    const pathname = path.join(__dirname, 'index.html');
    console.warn('loadURL', pathname)
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
  // void initializeIpcNodeSide();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);
app.allowRendererProcessReuse = true;
