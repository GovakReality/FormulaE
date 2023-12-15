import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGraphicsStore = defineStore('graphics', () => {

  const directionalLightIntensity = ref(0);
  const directionalLightColor = ref(1);
  const ambientLightIntensity = ref(2);
  const ambientLightColor = ref(3);
  const lightProbeIntensity = ref(4);
  const backgroundIntensity = ref(5);
  const backgroundBlurriness = ref(6);
  const fogColor = ref(7);
  const fogNear = ref(8);
  const fogFar = ref(9);
  const toneMapping = ref(10);
  const toneMappingExposure = ref(11);

  return { directionalLightIntensity, directionalLightColor, ambientLightIntensity, ambientLightColor, lightProbeIntensity, backgroundIntensity, backgroundBlurriness, fogColor, fogNear, fogFar, toneMapping, toneMappingExposure };
})