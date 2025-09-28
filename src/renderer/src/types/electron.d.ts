import { ConvertOptions, ConvertResult } from '../../../types'

export interface ElectronAPI {
  selectFile: () => Promise<string|null>
  convertVideo: (options: ConvertOptions) => Promise<ConvertResult>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}