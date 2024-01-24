<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useCardsStore } from '/src/stores/CardsStore';
import { useQuizStore } from '/src/stores/QuizStore';
import { useCameraStore } from '/src/stores/CameraStore';
import { useAPIStore } from '/src/stores/APIStore';
import { storeToRefs } from 'pinia';
import { useIdle, useTimestamp, useInterval } from '@vueuse/core'

const cardsStore = useCardsStore();
const { cardIndex } = storeToRefs(cardsStore);
const quizStore = useQuizStore();
const { shouldCameraMove, iniPosMove } = storeToRefs(quizStore);
const cameraStore = useCameraStore();
const APIStore = useAPIStore();
const { isLoading } = storeToRefs(APIStore);

const { idle, lastActive, reset: idleReset } = useIdle(20000);
const { counter, reset, pause, resume } = useInterval(100, { controls: true });

const showInactivity = ref(false);
let idleInterval;

watch(idle, (idleValue) => {
  if (idleValue && cardIndex.value != 0) {
    showInactivity.value = true;  // COMMENT THIS TO STOP
    reset();   // COMMENT THIS TO STOP
    resume();  // COMMENT THIS TO STOP
  }
})

watch(counter, (val) => {
  if (val >= 100) {
    restart();
  }
})

watch(isLoading, (val) => {
  if (val) {
    idleInterval = setInterval(function () { idleReset(); }, 1000);
  } else {
    clearInterval(idleInterval);
  }
});

const counterBar = computed(() => {
  return 100 - counter.value;
});

const restart = (event) => {
  clearInterval(idleInterval);
  pause();
  reset();
  shouldCameraMove.value = true;
  iniPosMove.value = true;
  cardsStore.reset();
  quizStore.reset();
  cameraStore.reset();
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
        <v-progress-linear :active="true" :model-value="counterBar" color="#28673C" bg-color="#28673c"
          height="5"></v-progress-linear>
      </template>
      <v-card-item class="text-center">
        <h3 class="g-in-title">
          {{ $t("system.still") }}
        </h3>
        <h3 class="g-in-text">
          {{ $t("system.restartExperience") }}
        </h3>
      </v-card-item>
      <v-card-actions>
        <v-btn color="#F0F0F0" variant="tonal" rounded="xl" :slim="false" class="g-bt font-weight-bold"
          @click="keepPlaying">
          {{ $t("global.continue") }}
        </v-btn>
        <v-btn color="#F0F0F0" variant="tonal" rounded="xl" :slim="false" class="g-bt font-weight-bold" @click="restart">
          {{ $t("global.restart") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.g-in-card {
  width: 355px;
  max-width: 100%;
  margin: auto;
  padding: 20px 5px;
}

.g-in-title {
  color: #28673C;
  font-weight: bold;
  font-size: 22px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.g-in-text {
  color: #28673C;
  font-weight: 400;
  font-size: 20px;
  line-height: 28px;
  margin-bottom: 25px;
}

.g-bt {
  font-size: 15px;
  width: 140px;
  max-width: 100%;
  line-height: 18px;
  background: linear-gradient(94deg, #28673C 7.42%, #07361C 166.68%);
  text-wrap: balance;
  pointer-events: all;
}

:deep(.v-card__loader) {
  bottom: 0;
  top: auto;
}

:deep(.v-overlay__scrim) {
  opacity: 1;
  background: none;
  background-color: rgba(0, 0, 0, 0.2);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}
</style>