import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import {autoUpdater} from 'electron-updater';
import { createWindow } from './helpers';
const fs = require('fs');


//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
// autoUpdater.logger = log;
// autoUpdater.logger.transports.file.level = 'info';
// log.info('App starting...');

const isProd = process.env.NODE_ENV === 'production';
var mainWindow = null;

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log("heyyyy",arg) // prints "heyyyy ping"
  fs.stat('./foo.txt', function(err, stat) {
    if (err == null) {
      console.log('File exists');
      mainWindow.webContents.send('asynchronous-message', {'SAVED': 'File Saved'});
    }
  });
})