<script setup>
  import { usePositionStore } from '/src/stores/PositionStore';
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useQuizStore } from '/src/stores/QuizStore';
  import { ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';

  const positionStore = usePositionStore();
  const cardsStore = useCardsStore();
  const { cardIndex } = storeToRefs(cardsStore);
  const quizStore = useQuizStore();

  const expand = ref(false);
  const show = ref(true);

  watch(cardIndex, () => {
    if (cardIndex.value == 1) {
      show.value = true;
      setTimeout(() => expand.value = true, 100);
    } else {
      expand.value = false;
    }
  });

  const onClick = (val, event) => {
    expand.value = false;
    switch (val) {
      case 1:
        quizStore.setDificulty('easy');
        break;
      case 2:
        quizStore.setDificulty('medium');
        break;
      case 3:
        quizStore.setDificulty('hard');
        break;
      default:
        quizStore.setDificulty('easy');
    }
  };

  const onAfterLeave = (el) => {
    show.value = false;
    cardsStore.incrementCardIndex();
    positionStore.increment();
  }    
</script>

<template>
  <v-sheet v-if="show" class="d-flex align-end justify-end h-100 pa-10">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave">
      <v-card
      v-if="expand"
      class="g-card py-5 pe-2 rounded-xl"
      color="teal-darken-4"
      variant="elevated"
      >
        <v-card-item class="text-center">
          <v-img
          src="/images/SaudiaLogo.png"
          width="200"
          class="text-center justify-center mx-auto"
          ></v-img>
          <div class="text-h4 mb-1 pa-6">
            Ready to test your knowledge?
          </div>
          <div class="text-h6 mb-1 pa-3">
            Get ready to answer questions about the Formula E racing cars.
          </div>    
          <div class="text-h6 mb-1 pa-3">
            Choose your difficulty below to start the quiz:
          </div>                 
        </v-card-item>
        <v-card-actions class="text-center justify-center">
          <v-btn rounded="lg" variant="tonal" @click="onClick(1)">
            Easy
          </v-btn>
          <v-btn rounded="lg" variant="tonal" @click="onClick(2)">
            Medium
          </v-btn>
          <v-btn rounded="lg" variant="tonal" @click="onClick(3)">
            Hard
          </v-btn>                    
        </v-card-actions>
      </v-card>
    </v-slide-y-reverse-transition>
  </v-sheet>
</template>

<style scoped>
.g-card{
  background: linear-gradient(45deg, rgba(7, 54, 28, 1) 0%, rgba(2, 101, 54, 1) 100%);
  max-width: 100%;
  width: 400px;
}
</style>