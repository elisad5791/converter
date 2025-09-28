<script setup lang="ts">
import { ref, watch } from 'vue';
import { Message, ConvertResult } from '../../../types';

const selectedFile = ref<string|null>(null);
const isConverting = ref<boolean>(false);
const logMessages = ref<Message[]>([]);
const progress = ref<number>(0);
const outputFormat = ref<string>('mp4');

const outputOptions: string[] = ['mp4', 'avi', 'mov', 'webm'];

watch(
  () => outputFormat.value,
  (newValue) => {
    logMessages.value.push({ type: 'info', message: `Выбран формат: ${newValue}` });
  }
);

async function selectFile(): Promise<void> {
  try {
    if (!window.electronAPI) {
      logMessages.value.push({ type: 'error', message: 'Electron API не доступен' });
      return;
    }

    const filePath: string|null = await window.electronAPI.selectFile();

    if (filePath) {
      selectedFile.value = filePath;
      progress.value = 0;
      logMessages.value = [];
      logMessages.value.push({ type: 'info', message: `Выбран файл: ${getFileName(filePath)}` });
    }
  } catch (error) {
    logMessages.value.push({ type: 'error', message: `Ошибка выбора файла: ${error}` });
  }
}

function getFileName(path: string|null): string|undefined {
  return path ? path.split(/[\\/]/).pop() : '';
}

async function convertVideo(): Promise<void> {
  if (!selectedFile.value || !window.electronAPI) {
    return;
  }
  
  isConverting.value = true;
  progress.value = 0;
  logMessages.value.push({ type: 'info', message: 'Процесс конвертации...' });
  
  try {
    const result: ConvertResult = await window.electronAPI.convertVideo({
      inputPath: selectedFile.value,
      outputFormat: outputFormat.value
    });
    
    if (result && result.success) {
      progress.value = 100;
      logMessages.value.push({ type: 'success', message: 'Конвертация успешно завершена!' });
      logMessages.value.push({ type: 'info', message: `Конвертированный файл: ${result.outputPath}` });
    } else if (result) {
      logMessages.value.push({ type: 'error', message: `Ошибка конвертации: ${result.error}` });
    }
  } catch (error) {
    if (error instanceof Error) {
      logMessages.value.push({ type: 'error', message: `Ошибка конвертации: ${error.message}` });
    } else {
      logMessages.value.push({ type: 'error', message: `Ошибка конвертации: ${String(error)}` });
    }
  } finally {
    isConverting.value = false;
  }
}
</script>

<template>
  <v-container style="width:800px;height:600px">
    <v-card class="pa-4 text-center">
      <div class="d-flex justify-center">
        <v-icon color="primary" size="32" class="mb-2">mdi-video</v-icon>
        <h1 class="text-h4 font-weight-bold primary--text ms-4">Видеоконвертер</h1>
      </div>
      <p class="text-body-1 text--secondary mt-2">Простое преобразование видео в различные форматы</p>
    </v-card>

    <v-form class="mt-8">
      <v-row>
        <v-col cols="4">
           <v-btn @click="selectFile" :disabled="isConverting">
              {{ selectedFile ? "Файл выбран" : "Выбрать видеофайл" }}
            </v-btn>
        </v-col>
        <v-col cols="4">
          <v-select label="Формат" :items="outputOptions" v-model="outputFormat" :disabled="isConverting || !selectedFile">
          </v-select>
        </v-col>
        <v-col cols="4">
          <v-btn @click="convertVideo" :disabled="isConverting || !selectedFile">Конвертировать</v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-card class="pa-4 mt-8" v-if="logMessages.length">
      <div class="d-flex">
        <v-icon size="32" class="mb-2">mdi-format-list-bulleted</v-icon>
        <h1 class="text-h6 font-weight-bold primary--text ms-4">Лог</h1>
      </div>
      <div v-for="(message, index) in logMessages" :key="index">
        {{ message.message }}
      </div>
    </v-card>
  </v-container>
</template>
