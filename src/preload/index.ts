import { contextBridge, ipcRenderer } from 'electron'
import { ConvertResult, ConvertOptions } from '../types'

contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: (): Promise<string|null> => ipcRenderer.invoke('select-file'),
  convertVideo: (options: ConvertOptions): Promise<ConvertResult> => ipcRenderer.invoke('convert-video', options)
});