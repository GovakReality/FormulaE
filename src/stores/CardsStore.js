import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCardsStore = defineStore('cards', () => {

  const cardIndex = ref(0);
  const showHints = ref(true);

  function incrementCardIndex() {
    cardIndex.value++;
  };

  function reset() {
    cardIndex.value = 0;
    showHints.value = true;
  };

  return { cardIndex, incrementCardIndex, reset, showHints };
})