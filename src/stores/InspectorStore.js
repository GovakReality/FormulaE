import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useInspectorStore = defineStore('inspector', () => {

  const lightIntensity = ref(1);

  return { lightIntensity };
})