<script setup>
import ThreeScene from './components/ThreeScene.vue'
import TopBar from './components/TopBar/TopBar.vue';
import QuizCards from './components/QuizCards/QuizCards.vue';
import CongratsCard from './components/QuizCards/CongratsCard.vue';
import LeaderboardCard from './components/QuizCards/LeaderboardCard.vue';
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
      <CongratsCard />
      <LeaderboardCard />
      <LoadingScreen />
    </v-main>
  </v-app>

</template>

<style scoped>

</style>
