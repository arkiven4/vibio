import { app, ipcMain, dialog } from "electron";
import serve from "electron-serve";
import { autoUpdater } from "electron-updater";
import { createWindow } from "./helpers";
const log = require("electron-log");
const fs = require("fs");
import path from "path";

// var powerSaveBlocker = require('electron').powerSaveBlocker;
// powerSaveBlocker.start('prevent-app-suspension')

//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");
autoUpdater.autoDownload = false;

if (process.env.FILEDMP) {
  var filedmp = process.env.FILEDMP;
} else {
  var filedmp = "./";
}

const isProd = process.env.NODE_ENV === "production";
var mainWindow = null;

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  mainWindow = createWindow("main", {
    width: 1024,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./index.html");
  } else {
    Object.defineProperty(app, "isPackaged", {
      get() {
        return true;
      },
    });

    process.env.APPIMAGE = path.join("/run/media/arkiven4/Project/Lab/Vibio/Gen1/vibio-1.0.8.AppImage");
    autoUpdater.updateConfigPath = path.join(__dirname, "../", "dev-app-update.yml");

    const port = process.argv[2];
    //await mainWindow.loadURL(`http://localhost:${port}/`);
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
  // mainWindow.webContents.setBackgroundThrottling(false);
  autoUpdater.checkForUpdates();
})();

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("app_version", (event) => {
  event.sender.send("app_version", { version: app.getVersion() });
});

ipcMain.on("accept-update", (event, arg) => {
  console.log(arg);
  if (arg) {
    autoUpdater.downloadUpdate();
  }
});

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
  console.log("update-available");
  console.log({ releaseNotes: releaseNotes, releaseName: releaseName });
  mainWindow.webContents.send("update-available", { releaseNotes: releaseNotes, releaseName: releaseName });
});

autoUpdater.on("update-not-available", (_event, releaseNotes, releaseName) => {
  console.log("update-not-available");
  mainWindow.webContents.send("update-not-available", true);
});

autoUpdater.on("download-progress", (progressObj) => {
  mainWindow.webContents.send("download-progress", { percent: progressObj.percent, downloadspd: progressObj.bytesPerSecond, progressMB: { now: progressObj.transferred, total: progressObj.total } });
  // let log_message = "Download speed: " + progressObj.bytesPerSecond;
  // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  // log.info(log_message)
  // sendStatusToWindow(log_message);
});

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Application Update",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail: "A new version has been downloaded. Restart the application to apply the updates.",
  };
  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall();
    } else {
      mainWindow.webContents.send("update-not-available", true);
    }
  });
});

autoUpdater.on("error", (ev, err) => {
  log.info("err", err);
  log.info("arguments", arguments);
});

ipcMain.on("gpio-file-init", (event, arg) => {
  fs.writeFile(filedmp + "/gpio.txt", "0", { encoding: "utf8", flag: "w" }, function (err) {
    console.log("It's saved!");
  });
});

ipcMain.on("gpio-file-read", (event, arg) => {
  fs.readFile(filedmp + "/gpio.txt", "utf8", function (err, data) {
    mainWindow.webContents.send("gpio-file-read", data);
  });
});

ipcMain.on("asynchronous-message", (event, arg) => {
  console.log("heyyyy", arg); // prints "heyyyy ping"
});

// setTimeout(() => {
//   console.log("halo");
//   fs.readFile(filedmp + "/gpio.txt", "utf8", function (err, data) {
//     log.info(data);
//     mainWindow.webContents.send("gpio-file-read", data);
//   });
// }, 1000);
