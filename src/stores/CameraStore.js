import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCameraStore = defineStore('camera', () => {

  const cameraTargetX = ref(0);
  const cameraTargetY = ref(1);
  const cameraTargetZ = ref(2);

  return { cameraTargetX, cameraTargetY, cameraTargetZ };
})