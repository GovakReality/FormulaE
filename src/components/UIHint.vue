<script setup>
  import { onMounted, onUnmounted, ref, watch, inject } from 'vue';
  import { useCardsStore } from '/src/stores/CardsStore';
  import { storeToRefs } from 'pinia';
  import swipeHint from '/images/HorizontalSwipe.svg';
  
  const cardsStore = useCardsStore();
  const { cardIndex } = storeToRefs(cardsStore);
  const expandHint = ref(false);
  const webGlCanvas = inject("webGlCanvas");
  let myInterval;
  let time = 15;
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

  function myTimer(){
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
    if(!hasStarted) startTimer();
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
    <v-img v-if="expandHint" :src=swipeHint width="90" class="g-hint"></v-img>
  </v-slide-y-reverse-transition>  
</template>

<style scoped>
.g-hint {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;  
  text-align: center;
  margin: 0 auto 250px auto;
  pointer-events: none;
  animation: myAnim 4s ease-in-out 0s infinite normal forwards;
}

@keyframes myAnim {
	0%,
	50%,
	100% {
		transform: translateX(30px) rotate(15deg);
	}

	25%,
	75% {
		transform: translateX(0px) ;
	}
}
</style>