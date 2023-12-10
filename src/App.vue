<script setup>
import ThreeScene from './components/ThreeScene.vue'
import InitialScreen from './components/InitialScreen.vue';
import PositionButton from './components/PositionButton.vue';
import LoadingScreen from './components/LoadingScreen.vue';
</script>

<template>
  <v-app>
    <v-app-bar flat color="transparent"></v-app-bar>
    <v-main>
      <PositionButton />
      <ThreeScene />
      <LoadingScreen />
    </v-main>
  </v-app>

</template>

<style scoped>

</style>
