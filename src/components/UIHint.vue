<script setup>
import { onMounted, onUnmounted, ref, watch, inject } from 'vue';
import { useCardsStore } from '/src/stores/CardsStore';
import { storeToRefs } from 'pinia';
import swipeHint from '/images/HandIcon.svg';
import swipeRight from '/images/HandArrowRightIcon.svg';
import swipeLeft from '/images/HandArrowLeftIcon.svg';

const cardsStore = useCardsStore();
const { cardIndex } = storeToRefs(cardsStore);
const expandHint = ref(false);
const webGlCanvas = inject("webGlCanvas");
let myInterval;
let time = 4;
let timeLeft = time;
let hasStarted = false;

watch(cardIndex, () => {
  if (cardIndex.value == 0) {
    addEvents();
    show();
  } else {
    removeEvents();
    hide();
    clearInterval(myInterval);
    hasStarted = false;
  }
});

function myTimer() {
  if (timeLeft > 0) {
    //console.log(timeLeft)
    timeLeft--;
  } else {
    clearInterval(myInterval);
    //console.log('show')
    show();
    hasStarted = false;
  }
}
const startTimer = () => {
  timeLeft = time;
  hasStarted = true;
  myInterval = setInterval(myTimer, 1000);
}

const show = () => {
  expandHint.value = true;
}

const hide = () => {
  expandHint.value = false;
}

const handleStartTouch = (e) => {
  timeLeft = time;
  hide();
}

const handleStopTouch = (e) => {
  if (!hasStarted) startTimer();
}

onMounted(() => {
  addEvents();
  show();
});

onUnmounted(() => {
  removeEvents();
  hide();
  clearInterval(myInterval);
})

const addEvents = () => {
  webGlCanvas.value.addEventListener('ontouchstart', handleStartTouch, false);
  webGlCanvas.value.addEventListener('touchmove', handleStartTouch, false);
  webGlCanvas.value.addEventListener('mousedown', handleStartTouch, false);

  webGlCanvas.value.addEventListener('touchend', handleStopTouch, false);
  webGlCanvas.value.addEventListener('touchcancel', handleStopTouch, false);
  webGlCanvas.value.addEventListener('onmouseup', handleStopTouch, false);
}

const removeEvents = () => {
  webGlCanvas.value.removeEventListener('ontouchstart', handleStartTouch, false);
  webGlCanvas.value.removeEventListener('touchmove', handleStartTouch, false);
  webGlCanvas.value.removeEventListener('mousedown', handleStartTouch, false);

  webGlCanvas.value.removeEventListener('touchend', handleStopTouch, false);
  webGlCanvas.value.removeEventListener('touchcancel', handleStopTouch, false);
  webGlCanvas.value.removeEventListener('onmouseup', handleStopTouch, false);
}  
</script>
<template>
  <v-slide-y-reverse-transition>
    <v-sheet v-if="expandHint" class="g-sheet g-hint">
      <v-sheet class="g-sheet g-arrows-wrapper">
        <v-img :src=swipeLeft class="g-arrow g-left-arrow"></v-img>
        <v-img :src=swipeRight class="g-arrow g-right-arrow"></v-img>
      </v-sheet>
      <v-sheet class="g-sheet g-hand-wrapper">
        <v-img :src=swipeHint class="g-hand"></v-img>
      </v-sheet>
    </v-sheet>
  </v-slide-y-reverse-transition>
</template>

<style scoped>
.g-sheet {
  background-color: transparent;
}

.g-hint {
  position: absolute;
  bottom: 100px;
  left: 50%;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: -50px;
  width: 100px;
  height: 100px;
  pointer-events: none;
}

.g-arrows-wrapper {
  position: relative;
  direction: ltr;
}

.g-hand-wrapper {
  position: relative;
  direction: ltr;
}

.g-arrow {
  margin: auto;
  width: 35px;
}

.g-left-arrow {
  margin-left: 0px;
  opacity: 0;
  animation: opacityAnimLeft 4s ease-in-out 0s infinite normal forwards;
}

.g-right-arrow {
  margin-top: -15px;
  margin-left: 15px;
  animation: opacityAnimRight 4s ease-in-out 0s infinite normal forwards;
}

.g-hand {
  margin-top: 10px;
  width: 60px;
  max-width: 100%;
  pointer-events: none;
  animation: myAnim 8s ease-in-out 0s infinite normal forwards;
}

@-webkit-keyframes myAnim {

  0%,
  50%,
  100% {
    transform: translateX(20px) rotate(15deg);
  }

  25%,
  75% {
    transform: translateX(0px);
  }
}

@-moz-keyframes myAnim {

  0%,
  50%,
  100% {
    transform: translateX(20px) rotate(15deg);
  }

  25%,
  75% {
    transform: translateX(0px);
  }
}

@-o-keyframes myAnim {

  0%,
  50%,
  100% {
    transform: translateX(20px) rotate(15deg);
  }

  25%,
  75% {
    transform: translateX(0px);
  }
}

@keyframes myAnim {

  0%,
  50%,
  100% {
    transform: translateX(20px) rotate(15deg);
  }

  25%,
  75% {
    transform: translateX(0px);
  }
}

@-webkit-keyframes opacityAnimLeft {
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@-moz-keyframes opacityAnimLeft {
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@-o-keyframes opacityAnimLeft {
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@keyframes opacityAnimLeft {
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@-webkit-keyframes opacityAnimRight {
  0% {
    opacity: 1;
  }

  25% {
    opacity: 0;
  }

  50% {
    opacity: 0;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@-moz-keyframes opacityAnimRight {
  0% {
    opacity: 1;
  }

  25% {
    opacity: 0;
  }

  50% {
    opacity: 0;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@-o-keyframes opacityAnimRight {
  0% {
    opacity: 1;
  }

  25% {
    opacity: 0;
  }

  50% {
    opacity: 0;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes opacityAnimRight {
  0% {
    opacity: 1;
  }

  25% {
    opacity: 0;
  }

  50% {
    opacity: 0;
  }

  75% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@media (max-width: 669px) {
  .g-hint {
    bottom: 220px;
    left: 30%;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: -75px;
  }
}

@media (max-width: 599px) {
  .g-hint {
    bottom: 220px;
    left: 50%;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: -30px;
  }
}
</style>