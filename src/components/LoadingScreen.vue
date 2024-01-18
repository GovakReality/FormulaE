<script setup>
  import { ref, watch, onMounted } from 'vue';
  import { useLoadingStore } from '../stores/LoadingStore';
  import { storeToRefs } from 'pinia';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const loadingStore = useLoadingStore();
  const { loadStart, loadComplete, loadError, loadProgress, errorUrl } = storeToRefs(loadingStore);
  const loading = ref(true);
  const showLoader = ref(true);
  const showError = ref(false);
  const expand = ref(false);
  const errorMessage = ref('');
  const errorDevMessage = ref('');

  watch(loadComplete, (val) => {
    if (loadComplete.value) {
      //setTimeout(() => loading.value = false, 22500); //test
      if(!showError.value) {
        loading.value = false;
        showLoader.value = false;
        showError.value = false;
      }
    }
  });

  watch(loadError, (val) => {
    if (loadError.value) {
      errorMessage.value = t('system.wait');
      errorDevMessage.value = 'ThreeJS loader manager error. URL: ' + errorUrl.value;      
      onError();
    }
  });

  const onError = () => {
    showLoader.value = false;
    showError.value = true;
  }

  onMounted(() => {
    setTimeout(() => {
      if(!showError.value) {
        errorMessage.value = t('system.wait');
        errorDevMessage.value = 'Timed out error';
        onError();
      }
    }, 45000);
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
          <v-progress-circular 
            v-if="showLoader" 
            indeterminate 
            size="70" 
            width="7" 
            color="#28673c">
          </v-progress-circular>
          <v-sheet v-if="showError" class="g-errorSheet">
            <v-card
              class="mx-auto"
              width="400"
              prepend-icon="mdi-close-octagon-outline"
              variant="tonal"
              color="error"
              title="ERROR"
            > 
              <v-card-text>
                {{errorMessage}}
              </v-card-text>
              <v-card-actions>         
                <v-spacer></v-spacer>
                <v-btn
                  :append-icon="expand ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="expand = !expand"
                  size="x-small"
                  variant="text"
                >
                  Details
                </v-btn>
              </v-card-actions> 
              <v-expand-transition>
                <div v-show="expand">
                  <v-divider></v-divider>
                  <v-card-text>
                    {{errorDevMessage}}
                  </v-card-text>
                </div>
              </v-expand-transition>                       
            </v-card>            
          </v-sheet>
        </v-layout>
      </v-container>    
    </v-overlay>
  </div>
</template>

<style scoped>
  :deep(.v-overlay__scrim) {
    opacity: 1 !important;
  }
  .g-errorSheet {
    background-color: transparent;
    position: relative;
  }
</style>