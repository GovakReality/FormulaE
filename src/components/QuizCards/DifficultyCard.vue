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
  const show = ref(false);

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
      variant="elevated"
      >
        <v-card-item class="text-center">
          <v-img
          src="/images/SaudiaLogo.png"
          width="150"
          class="text-center justify-center mx-auto"
          ></v-img>
          <h3 class="g-title font-weight-bold pa-6">
            Ready to test your knowledge?
          </h3>
          <div class="g-text pb-5 px-6">
            Get ready to answer questions about the Formula E racing cars.
          </div>    
          <div class="g-text mb-1 pb-1 px-6">
            Choose your difficulty below to start the quiz:
          </div>                 
        </v-card-item>
        <v-card-actions class="text-center justify-center">
          <v-container fluid>
            <v-row no-gutters>
              <v-col>
                <v-btn rounded="xl" variant="tonal" :slim="false" class="g-bt-diff font-weight-black my-2" @click="onClick(1)">
                  Easy
                </v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-btn rounded="xl" variant="tonal" :slim="false" class="g-bt-diff font-weight-black my-2" @click="onClick(2)">
                  Medium
                </v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-btn rounded="xl" variant="tonal" :slim="false" class="g-bt-diff font-weight-black my-2" @click="onClick(3)">
                  Hard
                </v-btn>  
              </v-col>
            </v-row>          
          </v-container>

        
                  
        </v-card-actions>
      </v-card>
    </v-slide-y-reverse-transition>
  </v-sheet>
</template>

<style scoped>
.g-card{
  background: linear-gradient(45deg, rgba(7, 54, 28, 1) 0%, rgba(2, 101, 54, 1) 100%);
  max-width: 100%;
  width: 340px;
  color: #F0F0F0;
}
.g-title {
  font-size: 26px;
  line-height: 36px;
}

.g-text {
  font-family: Saudia Sans;
  line-height: 30px;
  font-weight: 400;
  font-size: 20px;
}
.g-bt-diff {
  font-size: 15px;
  width: 180px;
  max-width: 100%;
}

:deep(.v-btn--variant-tonal .v-btn__underlay) {
  opacity: 0.4;
}

:deep(.v-btn.v-btn--density-default) {
  height: 40px;
}
</style>