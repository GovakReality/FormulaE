import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCardsStore = defineStore('cards', () => {

  const cardIndex = ref(0);

  function incrementCardIndex() {
    cardIndex.value++;
  };

  function reset() {
    cardIndex.value = 0;
  };

  return { cardIndex, incrementCardIndex, reset };
})