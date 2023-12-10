<script setup>
  import { ref, watch } from 'vue';
  import { useLoadingStore } from '../stores/LoadingStore';
  import { storeToRefs } from 'pinia';

  const loadingStore = useLoadingStore();
  const { loadStart, loadComplete, loadError, loadProgress } = storeToRefs(loadingStore);
  const loading = ref(true);

  watch(loadComplete, (val) => {
    if (loadComplete.value) {
      setTimeout(() => isShow.value = false, 2500);
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
      content-class="loading-dialog"
      class="align-center justify-center"
    >
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate size="70" width="7" color="primary"></v-progress-circular>
        </v-layout>
      </v-container>    
    </v-overlay>
  </div>
</template>

<style scoped>
  .loading-dialog {
    background-color: #303030; 
  }
</style>