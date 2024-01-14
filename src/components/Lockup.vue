<script setup>
import lockup from '/images/Lockup.png';
import { useLocale } from 'vuetify';

const { isRtl } = useLocale();

</script>

<template>
  <v-img :src="lockup" class="g-lockup"></v-img>
</template>

<style scoped>
.g-lockup {
  z-index: 90;
  max-width: 100%;
  width: 360px;
  filter: drop-shadow(0px 1px 2px #00000022);
}

.g-img {
  width: 100%;
}

@media (max-width: 599px) {
  .g-lockup {
    width: 260px;
    margin-top: 10px;
  }
}

@media (max-width: 469px) {
  .g-lockup {
    width: 200px;
  }
}

@media (max-width: 379px) {
  .g-lockup {
    width: 160px;
  }
}

@media (min-width: 2560px) {
  .g-lockup {
    width: 580px;
    margin-top: 25px;
  }

  .g-img {
    width: 580px;
  }
}
</style>