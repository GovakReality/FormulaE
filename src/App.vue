<script setup>
import ThreeScene from './components/ThreeScene.vue'
import TopBar from './components/TopBar/TopBar.vue';
import QuizCards from './components/QuizCards/QuizCards.vue';
import LoadingScreen from './components/LoadingScreen.vue';
/* import Lockup from './components/Lockup.vue'; */
import GenInfo from './components/GenInfo.vue';
/* import LiveInspector from './components/LiveInspector.vue'; */
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
    </v-main>
  </v-app>
</template>

<style scoped></style>
