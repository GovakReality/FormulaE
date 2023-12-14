import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGraphicsStore = defineStore('graphics', () => {

  const directionalLightIntensity = ref(0);

  return { directionalLightIntensity };
})