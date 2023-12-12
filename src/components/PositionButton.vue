<script setup>
  import { ref } from 'vue';
  import { usePositionStore } from '/src/stores/PositionStore';

  const positionStore = usePositionStore();

  const onClick = (event) => {
    positionStore.increment();
  };

</script>

<template>
  <v-btn class="btn-test" @click="onClick"> Animate Camera</v-btn>
</template>

<style scoped>
.btn-test {
  position: absolute;
  z-index: 20;
  margin: 20px;
}

</style>