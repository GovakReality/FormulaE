import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCameraStore = defineStore('camera', () => {

  const cameraPosX = ref(0);
  const cameraPosY = ref(1);
  const cameraPosZ = ref(2);
  const cameraTargetX = ref(3);
  const cameraTargetY = ref(4);
  const cameraTargetZ = ref(5);

  return { cameraPosX, cameraPosY, cameraPosZ, cameraTargetX, cameraTargetY, cameraTargetZ };
})