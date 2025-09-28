import { app, shell, BrowserWindow, ipcMain, dialog, BaseWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'
import path from 'node:path'
import { ConvertOptions, ConvertResult } from '../types'

ffmpeg.setFfmpegPath(ffmpegStatic)

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
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

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function getMainWindow(): BaseWindow {
  const windows: BaseWindow[] = BrowserWindow.getAllWindows()
  return windows[0]
}

ipcMain.handle('select-file', async (): Promise<string|null> => {
  const window = getMainWindow()
  const result = await dialog.showOpenDialog(window, {
    properties: ['openFile'],
    filters: [
      { name: 'Videos', extensions: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'm4v', 'wmv'] }
    ]
  })

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

ipcMain.handle('convert-video', async (_event: Electron.IpcMainInvokeEvent, options: ConvertOptions): Promise<ConvertResult> => {
  const { inputPath, outputFormat } = options;

  return new Promise((resolve) => {
    console.log('Conversion - start...')
    
    try {
      const inputDir = path.dirname(inputPath)
      const inputName = path.basename(inputPath, path.extname(inputPath))
      const outputPath = path.join(inputDir, `${inputName}_converted.${outputFormat}`)

      const command = ffmpeg(inputPath)
        .output(outputPath)
        .on('end', () => {
          console.log('Conversion - success!')
          resolve({ success: true, outputPath })
        })
        .on('error', (error) => {
          console.error('Conversion error:', error)
          resolve({ success: false, error: error.message })
        })

      command.run()
      
    } catch (error) {
      console.error('Setup error:', error)
      resolve({ success: false, error: error instanceof Error ? error.message : 'неизвестная ошибка' })
    }
  })
})
