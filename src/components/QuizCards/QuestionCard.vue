<script setup>
  import { usePositionStore } from '/src/stores/PositionStore';
  import { useCardsStore } from '/src/stores/CardsStore';
  import { ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';

  const positionStore = usePositionStore();
  const { positionIndex } = storeToRefs(positionStore);
  const cardsStore = useCardsStore();
  const { cardIndex, question } = storeToRefs(cardsStore);
  const expand = ref(false);
  const show = ref(true);
  const round = ref(0);

  watch(cardIndex, () => {
    if (cardIndex.value == 2) {
      show.value = true;
      showCard();
    } else {
      expand.value = false;
    }
  });

  const showCard = () => {
    round.value++;
    cardsStore.newQuestion();
    setTimeout(() => expand.value = true, 100);
  };

  const onClick = (val, event) => {
    expand.value = false;
  };
  
  const onAfterLeave = (el) => {
    positionStore.increment();
    if (positionIndex.value == 10){
      show.value = false;
    } else {
      showCard();
      cardsStore.incrementCardIndex();
    }
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
            Round {{ round }}
          </div>
          <div class="text-h6 mb-1 pa-3">
            {{ question.question }}
          </div>                     
        </v-card-item>
        <v-card-actions class="text-center justify-center">
          <v-btn rounded="lg" variant="tonal" @click="onClick(1)">
            {{ question.answer1 }}
          </v-btn>
          <v-btn rounded="lg" variant="tonal" @click="onClick(2)">
            {{ question.answer2 }}
          </v-btn>
          <v-btn rounded="lg" variant="tonal" @click="onClick(3)">
            {{ question.answer3 }}
          </v-btn> 
          <v-btn rounded="lg" variant="tonal" @click="onClick(4)">
            {{ question.answer4 }}
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