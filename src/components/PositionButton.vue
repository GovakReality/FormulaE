<script setup>
  import { ref } from 'vue';
  import { usePositionStore } from '/src/stores/PositionStore';

  const positionStore = usePositionStore();

  const onClick = (event) => {
    positionStore.increment();
  };

</script>

<template>
  <button  class="btn-test" @click="onClick"> Animate Camera</button>
</template>

<style scoped>
.btn-test {
  position: relative;
  z-index: 20;
}

</style>