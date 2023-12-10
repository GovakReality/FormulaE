<script setup>
import ThreeScene from './components/ThreeScene.vue'
import TopBar from './components/TopBar.vue';
import PositionButton from './components/PositionButton.vue';
import LoadingScreen from './components/LoadingScreen.vue';
</script>

<template>
  <v-app>
    <TopBar />
    <v-main class="overflow-hidden">
      <PositionButton />
      <ThreeScene />
      <LoadingScreen />
    </v-main>
  </v-app>

</template>

<style scoped>

</style>
