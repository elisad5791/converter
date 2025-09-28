<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router';
</script>

<template>
  <RouterView />

  <v-footer class="d-flex justify-space-around ga-2 py-4 position-fixed bottom-0 left-0 right-0 text-white">
    <RouterLink to="/" class="text-decoration-none text-white d-flex align-center ga-2">
       <v-icon icon="mdi-swap-horizontal" size="24"></v-icon>  
       Конвертер
    </RouterLink>
    <RouterLink to="/info" class="text-decoration-none text-white d-flex align-center ga-2">
      <v-icon icon="mdi-video-vintage" size="24"></v-icon> 
      Информация о форматах
    </RouterLink>
    <RouterLink to="/about" class="text-decoration-none text-white d-flex align-center ga-2">
      <v-icon icon="mdi-information" size="24"></v-icon> 
      О программе
    </RouterLink>
  </v-footer>
</template>

<style>
html, body {
  overflow: hidden;
}
</style>

