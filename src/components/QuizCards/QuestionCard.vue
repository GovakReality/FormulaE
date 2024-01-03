<script setup>
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useQuizStore } from '/src/stores/QuizStore';
  import { ref, watch, computed } from 'vue';
  import { storeToRefs } from 'pinia';

  const cardsStore = useCardsStore();
  const { cardIndex } = storeToRefs(cardsStore);
  const quizStore = useQuizStore();
  const { question, round, scoreFixed, shouldCameraMove, quizEnded } = storeToRefs(quizStore);

  const expand = ref(false);
  const show = ref(false);
  const expandHud = ref(false);
  const genType = ref('');

  const maxPoints = parseFloat(10000); 
  const timeLeft = ref(maxPoints);
  let animFrame;
  let prevTime;
  let clockStep = 10;

  watch(cardIndex, () => {
    if (cardIndex.value >= 2 && cardIndex.value < 11) {
      switch (cardIndex.value) {
        case (2):
        case (3):
        case (4):
          genType.value = 'gen3';
          break;
        case (5):
        case (6):
        case (7):
          genType.value = 'gen2';
          break;
        case (8):
        case (9):
        case (10):
          genType.value = 'gen1';
          break;
        default:
          genType.value = 'gen3';
      };
      show.value = true; 
      expandCard();
    } else {
      show.value = false;
    }      
  });

  const expandCard = () => {
    quizStore.newQuestion(genType.value);
    quizStore.incrementRound();
    shouldCameraMove.value = true;
    setTimeout(() => {
      expand.value = true;
      if(cardIndex.value == 2) {
        expandHud.value = true;
      }
    }, 100);
  };

  const contractCard = () => {
    expand.value = false;
    if(cardIndex.value == 10) {
        expandHud.value = false;
        quizEnded.value = true;
        shouldCameraMove.value = true;
      }    
  };

  const onClick = (val, event) => {
    cancelAnimationFrame(animFrame);
    if (val == question.value.correct) {
      quizStore.addScore(timeLeft.value);
      showCorrectAnswer();
    } else {
      showCorrectAnswer();
      showWrongAnswer(event);
    }
    setTimeout(() => {
      contractCard();
    }, 300);    
  };
  
  const showCorrectAnswer = () => {
    //correct answer
  }  
  
  const showWrongAnswer = (ev) => {
    //wrong answer
  }  

  const onAfterLeave = (el) => {
    cardsStore.incrementCardIndex();
  }  
   
  const onAfterEnter = (el) => {
    startTimer();
  }  

  const startTimer = () => {
    timeLeft.value = maxPoints;
    prevTime = performance.now();
    timer();
  };

  const timer = () => {
    let aux = performance.now();
    let calc = (aux - prevTime);
    if (calc > clockStep) {
      timeLeft.value = (timeLeft.value - calc).toFixed(0);
      if(timeLeft.value <= 0) {
        timeLeft.value = 0;
        cancelAnimationFrame(animFrame);
        contractCard();
      } else {
        prevTime = aux;
        animFrame = requestAnimationFrame(timer);
      }
    } else {
      animFrame = requestAnimationFrame(timer);
    }
  };

  const timeLeftFixed = computed(() => {
    return (timeLeft.value / 1000).toFixed(3).replace(".",",");
  });

  const timeBar = computed(() => {
    let x = normalizeToRange(timeLeft.value, 0, maxPoints, 0, 100);
    return x.toFixed(0);
  });

  // timer
/*   let interval;
  const timer = () => {
    clearInterval(interval);
    interval = setInterval(() => {
      timeLeft.value -= 0.01;
      if(timeLeft.value <= 0){
        timeLeft.value = 0.000;
        clearInterval(interval);
        //contractCard();
      }      
    }, 10)
  }; 

  const timeLeftFixed = computed(() => {
    return timeLeft.value.toFixed(3).replace(".",",");
  });

  const timeBar = computed(() => {
    let x = normalizeToRange(timeLeft.value, 0, maxPoints, 0, 10);
    return (x * 10).toFixed(0);
  });

  const startTimer = () => {
    timeLeft.value = maxPoints;
    timer();
  }; */


///////////////////

  //let lastTime = (new Date()).getTime();
	//let milliseconds = maxPoints.value;

/*   const timer = () => {
    let currentTime = performance.now();
    let distance = (currentTime - now);
    console.log(distance.toFixed(3))
    animFrame = requestAnimationFrame(timer);
		if (distance > 1000) {
      lastTime = currentTime;
      timeLeft.value--;
      console.log(timeLeft.value)
    } 
     console.log(timeLeft.value)
    if(distance <= 0){
      timeLeft.value = 0.000;
      //cancelAnimationFrame(animFrame);
      //contractCard();
    } else {
      animFrame = requestAnimationFrame(timer);
    } 
  }; */

/*   const startTimer = () => {
    timeLeft.value = parseFloat(maxPoints);
    timer();
  };

  const timeLeftFixed = computed(() => {
    return timeLeft.value.toFixed(3).replace(".",",");
  });

  const timeBar = computed(() => {
    let x = normalizeToRange(timeLeft.value, 0, maxPoints, 0, 100);
    return x.toFixed(0);
  }); */

 /*  let lastTime;
  let animationRef;
  let remainingTime = 10000;

  const timer = (timestamp) => {
    if (lastTime === undefined) {
      lastTime = timestamp + remainingTime;
    }
    timeLeft.value = lastTime - timestamp;
    if (timeLeft.value <= 0) {
      cancelAnimationFrame(animationRef);
      timeLeft.value = 0;
    } else {
      animationRef = requestAnimationFrame(timer);
    }
    console.log(timestamp)
  };

  const timeLeftRounded = computed(() => {
    return roundWithPrecision(timeLeft.value, 3);
  });

  const timeBar = computed(() => {
    let x = normalizeToRange(timeLeft.value, 0, maxPoints, 0, 10);
    return (x * 10).toFixed(0);
  });  

  const startTimer = () => {
    timeLeft.value = maxPoints;
    animationRef = requestAnimationFrame(timer)
  }; */
 
  const roundWithPrecision = (num, precision) => {
    var multiplier = Math.pow(10, precision);
    return Math.round( num * multiplier ) / multiplier;
  }
  const normalizeToRange = (value, oldMin, oldMax, newMin, newMax) => (((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
</script>

<template>
  <v-sheet v-if="show" class="d-flex align-end justify-center h-100 pa-8 pb-10 pb-sm-16 pa-sm-10">
    <v-slide-y-reverse-transition
    @after-leave="onAfterLeave"
    @after-enter="onAfterEnter"
    group
    >
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
          bg-color="#28673c"
          height="5"
        ></v-progress-linear>
      </template>

        <v-card-item>
          <div class="g-round mb-0 mb-sm-1 font-weight-bold">
            {{ $t("global.round") }} {{ round }}
          </div>
          <div class="g-text mb-1 mb-sm-2 pt-2">
            {{ question.question }}
          </div>                     
        </v-card-item>
        <v-card-actions class="text-center justify-center px-3">

          <v-container fluid class="pa-0">
            <v-row dense>
              <v-col class="pa-2"> 
                <v-btn block rounded="xl" :slim="false" color="#F0F0F0" class="g-bt font-weight-bold" @click="onClick(1, $event)">
                  {{ question.answer1 }}
                </v-btn>
              </v-col>
              <v-col class="pa-2">
                <v-btn block rounded="xl" :slim="false" color="#F0F0F0" class="g-bt font-weight-bold" @click="onClick(2, $event)">
                  {{ question.answer2 }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col class="pa-2">
                <v-btn block rounded="xl" :slim="false" color="#F0F0F0" class="g-bt font-weight-bold" @click="onClick(3, $event)">
                  {{ question.answer3 }}
                </v-btn> 
              </v-col>
              <v-col class="pa-2">
                <v-btn block rounded="xl" :slim="false" color="#F0F0F0" class="g-bt font-weight-bold" @click="onClick(4, $event)">
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
      <v-sheet v-if="expandHud" class="g-hud-w">
        <div class="g-hud-total px-5 py-2">{{scoreFixed}} {{ $t("global.pts") }}</div>
        <div class="g-hud-round px-5 py-2">{{ $t("global.round") }} 0{{ round }}/09</div>
        <div class="g-hud-score px-5 py-2">+{{timeLeftFixed}} {{ $t("global.pts") }}</div>
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
  font-size: 18px;
  width: 254px;
  max-width: 100%;
  line-height: normal;
  background: linear-gradient(94deg, #28673C 7.42%, #07361C 166.68%);
  text-wrap: balance;
}
.g-correct { 
  border: 3px solid #261bc0;
}
.g-wrong { 
  border: 3px solid #ff0000;
}
:deep(.v-btn.v-btn--density-default) {
  height: 70px;
}
:deep(.v-btn__content) {
  white-space: normal;
}
.g-hud {
  font-family: IBM Plex Sans;
  background-color: transparent;
  position: absolute;
  z-index: 90;
  max-width: 100%;
  bottom: 45px;
  right: 38px;
}
.g-hud-w {
  background-color: transparent;
}
.g-hud-round {
  opacity: 0.9;
  background-color: #F3F5F4;
  font-weight: 700;
  font-size: 17px;
  width: 150px;
  color: #000000;  
  display: inline-block;
  vertical-align: middle;
}
.g-hud-score {
  background-color: #28673C;
  font-weight: 700;
  font-size: 18px;
  color: #F0F0F0;  
  text-align: right;
  width: 150px;
  display: inline-block;
  vertical-align: middle;
}
.g-hud-total {
  background-color: #28673C;
  font-weight: 700;
  font-size: 18px;
  color: #F0F0F0;  
  text-align: right;
  vertical-align: bottom;
  width: 300px;
  max-width: 100%;
}

:deep(.v-card__loader) {
  bottom: 0;
  top: auto;
}
:deep(.v-progress-linear__background) {
  opacity: 0.3;
}

@media (max-width: 599px) {
  .g-card{
    width: 420px;
  }
  .g-round {
    font-size: 18px;
  }
  .g-text {
    font-size: 19px;
  } 
  .g-bt {
    font-size: 15px;
    width: 184px;
  } 
  :deep(.v-btn.v-btn--density-default) {
    height: 50px;
  } 
  .g-hud {
    bottom: 25px;
    right: auto;
    left: 50%;
    margin-left: -150px;
  } 
  .g-hud-round {
    width: 150px;
  }
  .g-hud-score {
    width: 150px;
  }        
}

@media (max-width: 446px) {
  .g-hud {
    right: 20px;
  } 
  .g-hud-round {
    font-size: 16px; 
  }  
  .g-hud-score {
    font-size: 16px; 
  }      
  .g-hud-total {
    font-size: 16px; 
  }   
}

@media (min-width: 2560px) {
  .g-card{
    width: 710px;
  }
  .g-round {
    font-size: 30px;
  }
  .g-text {
    font-size: 32px;
  } 
  .g-bt {
    font-size: 25px;
  } 
  :deep(.v-btn.v-btn--density-default) {
    height: 82px;
  } 
  .g-hud-round {
    font-size: 24px;
    height: 52px;
    width: 200px;
  }
  .g-hud-score {
    font-size: 26px;
    width: 200px;
    height: 52px;
  }
  .g-hud-total {
    font-size: 26px;
    width: 400px;
  }    
}
</style>