<script setup>
import { onMounted } from 'vue';
import ThreeScene from './components/ThreeScene.vue'
import TopBar from './components/TopBar/TopBar.vue';
import QuizCards from './components/QuizCards/QuizCards.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import SwitchCar from './components/SwitchCar.vue';
import GenInfo from './components/GenInfo.vue';
/* import LiveInspector from './components/LiveInspector.vue'; */
import InactivityAlert from './components/InactivityAlert.vue';
</script>

<template>
  <v-app>

    <TopBar />
    <v-main>
      <ThreeScene />
      <QuizCards />
      <SwitchCar />
      <GenInfo />
      <LoadingScreen />
      <!-- <LiveInspector /> -->
      <InactivityAlert />
    </v-main>
  </v-app>
</template>

<style scoped></style>
