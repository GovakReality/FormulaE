<script setup>
  import lockup from '/images/Lockup-Shadows.png';
  import { useLocale } from 'vuetify';

  const { isRtl } = useLocale();

</script>

<template>
  <v-img
  :src="lockup"
  class="g-lockup"
  :class="{ 'g-lang-def': !isRtl, 'g-lang-rtl': isRtl }"
  ></v-img>
</template>

<style scoped>
.g-lockup {
  position: absolute;
  z-index: 90;
  max-width: 100%;
  width: 360px;
  top: 2px;
  pointer-events: none;
}

.g-lang-def {
  left: 5px;
}
.g-lang-rtl {
  right: 5px;
}

@media (max-width: 599px) {
  .g-lockup {
    width: 300px;
    left: 50%;
    top: 40px;
    margin-left: -150px;
  }  
  .g-lang-rtl {
    right: auto;
  }
}

@media (min-width: 2560px) {
  .g-lockup {
    width: 580px;
  }
}

</style>