<script setup>
  import { ref, watch } from 'vue';
  import { useLoadingStore } from '../stores/LoadingStore';
  import { storeToRefs } from 'pinia';

  const loadingStore = useLoadingStore();
  const { loadStart, loadComplete, loadError, loadProgress } = storeToRefs(loadingStore);
  const loading = ref(true);

  watch(loadComplete, (val) => {
    if (loadComplete.value) {
      //setTimeout(() => loading.value = false, 22500);
      loading.value = false;
    }
  });

</script>

<template>
  <div class="text-center">
    <v-overlay
      :model-value="loading"
      persistent
      fullscreen
      full-width
      class="align-center justify-center"
      scrim="white"
    >
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate size="70" width="7" color="#28673c"></v-progress-circular>
        </v-layout>
      </v-container>    
    </v-overlay>
  </div>
</template>

<style scoped>
  :deep(.v-overlay__scrim) {
    opacity: 1 !important;
  }
</style>