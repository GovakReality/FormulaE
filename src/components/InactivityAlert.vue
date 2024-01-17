<script setup>
  import { ref, watch, computed, onMounted } from 'vue';
  import { useCardsStore } from '/src/stores/CardsStore';
  import { storeToRefs } from 'pinia';
  import { useIdle, useTimestamp } from '@vueuse/core'

  const cardsStore = useCardsStore();
  const { cardIndex } = storeToRefs(cardsStore);

  const { idle, lastActive, reset } = useIdle(15000);

  const show = ref(false);
  const expand = ref(false);

  watch(idle, (idleValue) => {
    if (idleValue && cardIndex.value != 0) {
      console.log('dispara alerta');
      show.value = true;
      expand.value = true;    
      //reset();
    }
  })

  ////////////
  const now = useTimestamp({ interval: 1000 })
  const idledFor = computed(() =>
    Math.floor((now.value - lastActive.value) / 1000))
  setInterval(function () {console.log(idledFor.value); console.log(idle.value)}, 1000);
  ////////
</script>
<template>

</template>