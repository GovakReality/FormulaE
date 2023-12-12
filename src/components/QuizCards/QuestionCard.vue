<script setup>
  import { usePositionStore } from '/src/stores/PositionStore';
  import { useCardsStore } from '/src/stores/CardsStore';
  import { ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';

  const positionStore = usePositionStore();
  const cardsStore = useCardsStore();
  const { difficulty, cardIndex } = storeToRefs(cardsStore);
  const expand = ref(false);
  const show = ref(true);
  const keepQuiz = ref(true);

  watch(cardIndex, () => {
    if (cardIndex.value == 2) {
      show.value = true;
      setTimeout(() => expand.value = true, 100);
    } else {
      expand.value = false;
    }
  });

  const onClick = (val, event) => {
    expand.value = false;
  };

  const onAfterLeave = (el) => {
/*     if (!keepQuiz){
      show.value = false;
    } */
    console.log('ee')
    setTimeout(() => expand.value = true, 100);
    cardsStore.increment();
    positionStore.increment();
  }    
</script>

<template>
  <v-sheet v-if="show" class="d-flex align-end justify-center h-100 pa-10">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave">
      <v-card
      v-if="expand"
      class="g-card py-5 pe-2 rounded-xl"
      color="white"
      variant="elevated"
      >
        <v-card-item class="text-center">
          <div class="text-h4 mb-1 pa-6">
            Round 1
          </div>
          <div class="text-h6 mb-1 pa-3">
            What is the theoretical top speed for Gen3 Formula E cars?
          </div>                     
        </v-card-item>
        <v-card-actions class="text-center justify-center">
          <v-btn rounded="lg" variant="tonal" @click="onClick(1)">
            311 KM/H
          </v-btn>
          <v-btn rounded="lg" variant="tonal" @click="onClick(2)">
            287 KM/H
          </v-btn>
          <v-btn rounded="lg" variant="tonal" @click="onClick(3)">
            322 KM/H
          </v-btn> 
          <v-btn rounded="lg" variant="tonal" @click="onClick(4)">
            297 KM/H
          </v-btn>                              
        </v-card-actions>
      </v-card>
    </v-slide-y-reverse-transition>
  </v-sheet>
</template>

<style scoped>
.g-card{
  max-width: 100%;
  width: 400px;
}
</style>