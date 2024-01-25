<script setup>
import lockup from '/images/Logo-Lookup-en.svg';
import lockupAr from '/images/Logo-Lookup-ar.svg';
import { useLocale } from 'vuetify';

const { isRtl } = useLocale();

</script>

<template>
  <v-img v-if="!isRtl" :src="lockup" class="g-lockup"></v-img>
  <v-img v-if="isRtl" :src="lockupAr" class="g-lockup"></v-img>
</template>

<style scoped>
.g-lockup {
  z-index: 90;
  max-width: 100%;
  width: 260px;
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
    width: 430px;
    margin-top: 25px;
  }

  .g-img {
    width: 580px;
  }
}
</style>