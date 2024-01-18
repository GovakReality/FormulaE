<script setup>
import { onMounted } from 'vue';
import ThreeScene from './components/ThreeScene.vue'
import TopBar from './components/TopBar/TopBar.vue';
import QuizCards from './components/QuizCards/QuizCards.vue';
import LoadingScreen from './components/LoadingScreen.vue';
/* import Lockup from './components/Lockup.vue'; */
import GenInfo from './components/GenInfo.vue';
/* import LiveInspector from './components/LiveInspector.vue'; */
import InactivityAlert from './components/InactivityAlert.vue';

onMounted(() => {
  //disable zoom on ios
  document.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) { event.preventDefault(); }
  }, false)
  //disable double tap zoom on ios
  var lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  });
</script>

<template>
  <v-app>

    <TopBar />
    <v-main>
      <!--<Lockup />-->
      <ThreeScene />
      <QuizCards />
      <GenInfo />
      <LoadingScreen />
      <!-- <LiveInspector /> -->
      <InactivityAlert />
    </v-main>
  </v-app>
</template>

<style scoped></style>
