import { app, nativeImage, BrowserWindow } from 'electron'
import { menubar } from 'menubar'
import path from 'path'
import { registerIpcHandlers } from './ipc-handlers'

const isDev = !app.isPackaged

app.whenReady().then(() => {
  const iconPath = path.join(__dirname, '../../resources/tray-iconTemplate.png')
  const icon = nativeImage.createFromPath(iconPath)

  const indexUrl = isDev
    ? `http://localhost:5173`
    : `file://${path.join(__dirname, '../renderer/index.html')}`

  const mb = menubar({
    index: indexUrl,
    icon,
    browserWindow: {
      width: 620,
      height: 520,
      transparent: false,
      resizable: false,
      skipTaskbar: true,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    },
    preloadWindow: true,
    showDockIcon: false
  })

  mb.on('ready', () => {
    registerIpcHandlers()

    if (isDev) {
      mb.window?.webContents.openDevTools({ mode: 'detach' })
    }
  })
})
