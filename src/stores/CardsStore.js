import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCardsStore = defineStore('cards', () => {

  const cardIndex = ref(0);
  const difficulty = ref('easy');

  function increment() {
    cardIndex.value++;
  };

  function reset() {
    cardIndex.value = 0
  };

  return { difficulty, cardIndex, increment, reset };
})