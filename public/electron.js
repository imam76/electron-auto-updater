const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater, AppUpdater } = require("electron-updater");
const path = require('node:path')

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send(text); // send notification to UI about Update
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
    },

  })

  win.webContents.openDevTools()
  // win.loadURL('index.html')
  win.loadURL('http://localhost:3000')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  app.on('ready', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  autoUpdater.on('update-not-available', () => {
    sendStatusToWindow('update_not_available');
  });

  autoUpdater.on('update-available', () => {
    sendStatusToWindow('update_available');
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Tersedia',
      message: 'Versi baru telah tersedia. Sedang mendownload ...',
    });
  });

  autoUpdater.on('update-downloaded', () => {
    sendStatusToWindow('update_downloaded');
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Siap',
      message: 'Update telah didownload. Aplikasi akan ditutup dan diperbarui...',
    }, () => {
      autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on('error', () => {
    sendStatusToWindow('update_error');
  })

})

// Ini akan mengembalikan versi aplikasi dari package.json
ipcMain.handle('get-app-version', async () => {
  return app.getVersion();
});

//Global exception handler
process.on("uncaughtException", function (err) {
  console.log(err);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})