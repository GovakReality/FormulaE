<script setup>
  import { usePositionStore } from '/src/stores/PositionStore';
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useQuizStore } from '/src/stores/QuizStore';
  import { ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';

  const positionStore = usePositionStore();
  const { positionIndex } = storeToRefs(positionStore);
  const cardsStore = useCardsStore();
  const { cardIndex } = storeToRefs(cardsStore);
  const quizStore = useQuizStore();
  const { question } = storeToRefs(quizStore);

  const expand = ref(false);
  const show = ref(false);
  const round = ref(0);

  watch(cardIndex, () => {
    if (cardIndex.value >= 2 && cardIndex.value < 11) {
      show.value = true;
      expandCard();
    } else {
      show.value = false;
    }
  });

  const expandCard = () => {
    round.value++;
    quizStore.newQuestion();
    setTimeout(() => expand.value = true, 100);
  };

  const contractCard = () => {
    expand.value = false;
  };

  const onClick = (val, event) => {
    //logica da resposta correta e pontuaçao
    contractCard();
  };
  
  const onAfterLeave = (el) => {
    positionStore.increment();
    cardsStore.incrementCardIndex();
  }   
  
  
</script>

<template>
  <v-sheet v-if="show" class="d-flex align-end justify-center h-100 pa-10">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave">
      <v-card
      v-if="expand"
      class="g-card py-5 px-4 rounded-xl"
      color="#F0F0F0"
      variant="elevated"
      >
        <v-card-item>
          <div class="g-round mb-1 font-weight-bold">
            ROUND {{ round }}
          </div>
          <div class="g-text mb-2 pt-2">
            {{ question.question }}
          </div>                     
        </v-card-item>
        <v-card-actions class="text-center justify-center px-3">

          <v-container fluid class="pa-0">
            <v-row dense>
              <v-col class="pa-2"> 
                <v-btn block rounded="xl" :slim="false" color="#F0F0F0" class="g-bt font-weight-bold" @click="onClick(1)">
                  {{ question.answer1 }}
                </v-btn>
              </v-col>
              <v-col class="pa-2">
                <v-btn block rounded="xl" :slim="false" color="#F0F0F0" class="g-bt font-weight-bold" @click="onClick(2)">
                  {{ question.answer2 }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col class="pa-2">
                <v-btn block rounded="xl" :slim="false" color="#F0F0F0" class="g-bt font-weight-bold" @click="onClick(3)">
                  {{ question.answer3 }}
                </v-btn> 
              </v-col>
              <v-col class="pa-2">
                <v-btn block rounded="xl" :slim="false" color="#F0F0F0" class="g-bt font-weight-bold" @click="onClick(4)">
                  {{ question.answer4 }}
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
  max-width: 100%;
  width: 594px;
  color: #28673c;
}
.g-round {
  font-size: 24px;
  color: #28673c;
  text-align: left;
  line-height: normal;
}
.g-text {
  font-family: Saudia Sans;
  line-height: normal;
  font-weight: 400;
  font-size: 24px;
  color: #28673c;
}
.g-bt {
  font-size: 20px;
  width: 254px;
  max-width: 100%;
  line-height: normal;
  background: linear-gradient(94deg, #28673C 7.42%, #07361C 166.68%);
}
:deep(.v-btn.v-btn--density-default) {
  height: 50px;
}
</style>