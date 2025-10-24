import { app, shell, BrowserWindow, ipcRenderer } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import initIPC from './ipc.js'
//import icon from '../../resources/icon.png?asset'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    //...(process.platform === 'linux' ? { icon } : {}),
    icon: join(__dirname, '../../resources/icon.ico'),
    frame: false, // Oculta la barra de título predeterminada
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
/*  mainWindow.on('minimize', () => {
    console.log('La ventana ha sido minimizada');
    // Puedes emitir un evento al proceso de renderizado si lo necesitas
    mainWindow.webContents.send('window-minimized');
  });*/

  // Evento 'maximize'
  mainWindow.on('maximize', () => {
    //console.log('La ventana ha sido maximizada');
    //mainWindow.webContents.send('window-maximized');
    mainWindow.webContents.send('window-state-changed', 'maximized');
  });

  // Evento 'unmaximize' (se emite cuando la ventana deja de estar maximizada)
  mainWindow.on('unmaximize', () => {
    //console.log('La ventana ha sido restaurada (desmaximizada)');
    //mainWindow.webContents.send('window-restored');
    mainWindow.webContents.send('window-state-changed', 'normal');
  });

  // Evento 'restore' (se emite cuando una ventana minimizada es restaurada)
  mainWindow.on('restore', () => {
    //console.log('La ventana ha sido restaurada desde la barra de tareas');
    //mainWindow.webContents.send('window-restored');
    mainWindow.webContents.send('window-state-changed', 'normal');
  });
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  initIPC();

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
