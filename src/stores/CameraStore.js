import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCameraStore = defineStore('camera', () => {

  const cameraTargetX = ref(0);
  const cameraTargetY = ref(1);
  const cameraTargetZ = ref(2);
  const currentCar = ref(3);

  function reset() {
    currentCar.value = 3;
  };

  return { cameraTargetX, cameraTargetY, cameraTargetZ, currentCar, reset };
})