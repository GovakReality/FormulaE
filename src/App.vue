<script setup>
import ThreeScene from './components/ThreeScene.vue'
import TopBar from './components/TopBar/TopBar.vue';
import QuizCards from './components/QuizCards/QuizCards.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import Lockup from './components/Lockup.vue';
</script>

<template>
  <v-app>
    <TopBar />
    <v-main class="overflow-hidden">
      <Lockup />
      <ThreeScene />
      <QuizCards />
      <LoadingScreen />
    </v-main>
  </v-app>

</template>

<style scoped>

</style>
