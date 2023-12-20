import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {

  const loadStart = ref(false);
  const loadComplete = ref(false);
  const loadError = ref(false);
  const errorUrl = ref('');
  const loadProgress = ref(0);

  return { loadStart, loadComplete, loadError, loadProgress, errorUrl };
})