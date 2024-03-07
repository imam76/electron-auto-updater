const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require("electron-updater");
const path = require('node:path')

autoUpdater.logger.transports.file.level = "info"


function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send(text); // send notification to UI about Update
}

autoUpdater.on('error', () => {
  sendStatusToWindow('update_error');
})

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

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

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
  win.loadURL('index.html')
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.handle('get-app-version', async () => {
  return app.getVersion(); // Ini akan mengembalikan versi aplikasi dari package.json
});