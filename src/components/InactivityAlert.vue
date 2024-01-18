<script setup>
  import { ref, watch, computed, onMounted } from 'vue';
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useQuizStore } from '/src/stores/QuizStore';
  import { useAPIStore } from '/src/stores/APIStore';
  import { storeToRefs } from 'pinia';
  import { useIdle, useTimestamp, useInterval } from '@vueuse/core'

  const cardsStore = useCardsStore();
  const { cardIndex } = storeToRefs(cardsStore);
  const quizStore = useQuizStore();
  const { shouldCameraMove, iniPosMove } = storeToRefs(quizStore);
  const APIStore = useAPIStore();

  const { idle, lastActive } = useIdle(15000);
  const { counter, reset, pause, resume } = useInterval(100, { controls: true });

  const showInactivity = ref(false);

  watch(idle, (idleValue) => {
    if (idleValue && cardIndex.value != 0) {
      showInactivity.value = true;
      reset();
      resume();
    }
  })

  watch(counter, (val) => {
    if (val >= 100) {
      restart();
    }
  })

  const counterBar = computed(() => {
    return 100 - counter.value;
  });

  const restart = (event) => {
    pause();
    reset();   
    shouldCameraMove.value = true; 
    iniPosMove.value = true;
    cardsStore.reset();
    quizStore.reset();
    APIStore.reset();
    showInactivity.value = false;
  };

  const keepPlaying = (event) => {
    showInactivity.value = false;
    pause();
    reset();
  };
  
  onMounted(() => {
    pause();
  });
  

  ////////////
 /*  const now = useTimestamp({ interval: 1000 })
  const idledFor = computed(() =>
    Math.floor((now.value - lastActive.value) / 1000))
  setInterval(function () {console.log(idledFor.value); console.log(idle.value)}, 1000); */
  ////////
</script>
<template>
  <v-dialog v-model="showInactivity" persistent class="align-center justify-center">
    <v-card class="g-in-card rounded-xl align-center justify-center">
      <template v-slot:loader>
        <v-progress-linear :active="true" :model-value="counterBar" color="red-darken-1" bg-color="#28673c" height="5"></v-progress-linear>
      </template>      
      <v-card-title class="text-h5 g-in-title">
        {{ $t("system.stillthere") }}
      </v-card-title>
      <v-card-actions>
        <v-btn color="green-darken-1" variant="tonal" rounded="xl" :slim="false" @click="keepPlaying">
          {{ $t("global.continue") }}
        </v-btn>
        <v-btn color="red-darken-1" variant="tonal" rounded="xl" :slim="false" @click="restart">
          {{ $t("global.restart") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.g-in-card {
  width: 340px;
  max-width: 100%;
  margin: auto;
  padding: 20px 5px;
}
.g-in-title {
  color: #28673C;
  margin-bottom: 20px;
}
:deep(.v-card__loader) {
  bottom: 0;
  top: auto;
}
:deep(.v-overlay__scrim) {
  opacity: 0.5;
}
</style>