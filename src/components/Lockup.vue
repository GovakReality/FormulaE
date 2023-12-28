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

@media (max-width: 599px) {
  .g-lockup {
    width: 300px;
    left: 50%;
    top: 40px;
    margin-left: -150px;
  }
}

@media (min-width: 2560px) {
  .g-lockup {
    width: 580px;
  }
}

</style>