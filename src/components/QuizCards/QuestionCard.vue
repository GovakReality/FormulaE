<script setup>
  import { usePositionStore } from '/src/stores/PositionStore';
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useQuizStore } from '/src/stores/QuizStore';
  import { ref, watch, computed } from 'vue';
  import { storeToRefs } from 'pinia';

  const positionStore = usePositionStore();
  const { positionIndex } = storeToRefs(positionStore);
  const cardsStore = useCardsStore();
  const { cardIndex } = storeToRefs(cardsStore);
  const quizStore = useQuizStore();
  const { question, round } = storeToRefs(quizStore);

  const expand = ref(false);
  const show = ref(false);

  const maxPoints = 6.000;
  const timeLeft = ref(parseFloat(maxPoints));

  watch(cardIndex, () => {
    if (cardIndex.value >= 2 && cardIndex.value < 11) {
      show.value = true;
      expandCard();
    } else {
      show.value = false;
    }
  });

  const expandCard = () => {
    quizStore.incrementRound();
    quizStore.newQuestion();
    setTimeout(() => expand.value = true, 100);
    startTimer();
  };

  let interval;
  const timer = () => {
    clearInterval(interval);
    interval = setInterval(() => {
      timeLeft.value -= 0.01;
      if(timeLeft.value <= 0){
        timeLeft.value = 0.000;
        clearInterval(interval);
        contractCard();
      }      
    }, 10)
  }; 

  const timeLeftFixed = computed(() => {
    return timeLeft.value.toFixed(3).replace(".",",");
  });

  const timeBar = computed(() => {
    let x = normalizeToRange(timeLeft.value, 0, maxPoints, 0, 10);
    return ((10 - x) * 10).toFixed(0);
  });

  const startTimer = () => {
    timeLeft.value = maxPoints;
    timer();
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
  
  const normalizeToRange = (value, oldMin, oldMax, newMin, newMax) => (((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
</script>

<template>
  <v-sheet v-if="show" class="d-flex align-end justify-center h-100 pa-10">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave" group>
      <v-card
      v-if="expand"
      class="g-card py-5 px-4 rounded-xl"
      color="#F0F0F0"
      variant="elevated"
      >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="true"
          :model-value="timeBar"
          color="#28673c"
          height="5"
        ></v-progress-linear>
      </template>

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
  <v-sheet v-if="show" class="g-hud">
    <v-slide-y-reverse-transition group>
      <v-sheet v-if="expand" class="g-hud-w">
        <span class="g-hud-round px-5 py-2">ROUND 0{{ round }}/09</span>
        <span class="g-hud-points px-5 py-2">+{{timeLeftFixed}} PTS</span>
      </v-sheet>    
    </v-slide-y-reverse-transition>        
  </v-sheet>  
</template>

<style scoped>
.g-card{
  max-width: 100%;
  width: 594px;
  color: #28673c;
  margin-bottom: 70px;
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
.g-hud {
  background-color: transparent;
  position: absolute;
  z-index: 90;
  max-width: 100%;
  bottom: 56px;
  right: 38px;
}
.g-hud-w {
  background-color: transparent;
}
.g-hud-round {
  opacity: 0.9;
  background-color: #F3F5F4;
  font-family: IBM Plex Sans;
  line-height: normal;
  font-weight: 700;
  font-size: 17px;
  color: #000000;  
}
.g-hud-points {
  background-color: #28673C;
  font-family: IBM Plex Sans;
  line-height: normal;
  font-weight: 700;
  font-size: 18px;
  color: #F0F0F0;  
}
:deep(.v-card__loader) {
  bottom: 0;
  top: auto;
}
</style>