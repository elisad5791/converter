export interface Message {
  type: string;
  message: string;
}

export interface ConvertResult {
  success?: boolean;
  outputPath?: string;
  error?: string;
}

export interface ConvertOptions {
  inputPath: string;
  outputFormat: string;
}