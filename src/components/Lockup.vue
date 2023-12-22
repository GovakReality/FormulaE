<script setup>
  import lockup from '/images/Lockup-Shadows.png';
</script>

<template>
  <v-img
  :src="lockup"
  class="g-lockup"
  ></v-img>
</template>

<style scoped>
.g-lockup {
  position: absolute;
  z-index: 90;
  max-width: 100%;
  width: 360px;
  top: 2px;
  left: 5px;
  pointer-events: none;
}
</style>