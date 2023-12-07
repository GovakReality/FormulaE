import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePositionStore = defineStore('position', () => {

  const positionIndex = ref(0);

  function increment() {
    positionIndex.value++;
  };

  function reset() {
    positionIndex.value = 0
  };

  return { positionIndex, increment, reset };
})