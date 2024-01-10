<script setup>
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useQuizStore } from '/src/stores/QuizStore';
  import { ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import saudiaLogo from '/images/SaudiaLogo.png';

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
  }    
</script>

<template>
  <v-sheet v-if="show" class="d-flex align-center align-sm-end justify-center justify-sm-end h-100 pa-2 pa-sm-10 pb-sm-16">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave">
      <v-card
      v-if="expand"
      class="g-card py-5 rounded-xl"
      variant="flat"
      >
        <v-card-item class="text-center">
          <v-img
          :src="saudiaLogo"
          width="138"
          class="text-center justify-center mx-auto"
          ></v-img>
          <h3 class="g-title font-weight-bold pt-6 pt-sm-7 pb-5 pb-sm-8 px-2 px-sm-2">
            {{ $t("difficulty.title") }}
          </h3>
          <div class="g-text pb-4 pb-sm-6 px-4 px-sm-6">
            {{ $t("difficulty.text1") }}
          </div>    
          <div class="g-text pb-1 pb-sm-4 px-7 px-sm-8">
            {{ $t("difficulty.text2") }}
          </div>                 
        </v-card-item>
        <v-card-actions class="text-center justify-center">
          <v-container fluid class="pa-0">
            <v-row no-gutters>
              <v-col>
                <v-btn rounded="xl" variant="tonal" :slim="false" class="g-bt-diff font-weight-black my-2" @click="onClick(1)">
                  {{ $t("global.easy") }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-btn rounded="xl" variant="tonal" :slim="false" class="g-bt-diff font-weight-black my-2" @click="onClick(2)">
                  {{ $t("global.medium") }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-btn rounded="xl" variant="tonal" :slim="false" class="g-bt-diff font-weight-black my-2" @click="onClick(3)">
                  {{ $t("global.hard") }}
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
  background: linear-gradient(69deg, #07361C 9.61%, #07361C 9.61%, #026536 80.85%);
  max-width: 100%;
  width: 413px;
  color: #F0F0F0;
}
.g-title {
  font-size: 30px;
  line-height: 36px;
}

.g-text {
  font-family: Saudia Sans;
  line-height: normal;
  font-weight: 400;
  font-size: 24px;
}
.g-bt-diff {
  font-size: 18px;
  width: 183px;
  max-width: 100%;
  line-height: normal;
}

:deep(.v-btn--variant-tonal .v-btn__underlay) {
  opacity: 0.4;
}

:deep(.v-btn.v-btn--density-default) {
  height: 46px;
}

:deep(.v-btn__content) {
  padding-top: 2px;
}

@media (max-width: 599px) {
  .g-card{
    width: 333px;
  }
  .g-title {
    font-size: 20px;
    line-height: 26px;
    padding: 0px;
  }  
  .g-text {
    font-size: 20px;
  } 
  .g-bt-diff {
    font-size: 16px;
    width: 175px;
  }  
  :deep(.v-btn.v-btn--density-default) {
    height: 36px;
  }  
}

@media (min-width: 2560px) {
  .g-card{
    width: 513px;
  }
  .g-title {
    font-size: 34px;
    line-height: 38px;
  }  
  .g-text {
    font-size: 29px;
  } 
  .g-bt-diff {
    font-size: 22px;
    width: 220px;
  }  
  :deep(.v-btn.v-btn--density-default) {
    height: 56px;
  }  
}
</style>