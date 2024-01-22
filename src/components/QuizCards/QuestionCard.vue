<script setup>
import { useCardsStore } from '/src/stores/CardsStore';
import { useQuizStore } from '/src/stores/QuizStore';
import { ref, watch, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useLocale } from 'vuetify';

const { isRtl, current } = useLocale();

const cardsStore = useCardsStore();
const { cardIndex } = storeToRefs(cardsStore);
const quizStore = useQuizStore();
const { question, round, scoreFixed, shouldCameraMove, iniPosMove } = storeToRefs(quizStore);

const expand = ref(false);
const show = ref(false);
const expandHud = ref(false);
const shouldReset = ref(false);
const genType = ref('');
const correctAnswer1 = ref(false);
const correctAnswer2 = ref(false);
const correctAnswer3 = ref(false);
const correctAnswer4 = ref(false);
const wrongAnswer1 = ref(false);
const wrongAnswer2 = ref(false);
const wrongAnswer3 = ref(false);
const wrongAnswer4 = ref(false);
const neutralAnswers = ref(false);
const correctPoints = ref(false);
const wrongPoints = ref(false);
const canClick = ref(true);
const timedScore = ref();

const maxPoints = parseFloat(10000);
const timeLeft = ref(maxPoints);
const timeBarValue = ref(maxPoints);
const timeBarColor = ref('#28673c');

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
    shouldReset.value = false;
    iniPosMove.value = false;
    shouldCameraMove.value = false;
    show.value = true;
    expandCard();
  } else if (cardIndex.value == 0) {
    shouldReset.value = true;
    contractCard();
    show.value = false;
    expand.value = false;
    expandHud.value = false;
  } else {
    show.value = false;
  }
});

watch(scoreFixed, () => {
  setTimeout(() => {
    timedScore.value = scoreFixed.value;
  }, 850);
});

onMounted(() => {
  timedScore.value = scoreFixed.value;
});

const expandCard = () => {
  quizStore.newQuestion(genType.value);
  quizStore.incrementRound();
  shouldCameraMove.value = true;
  setTimeout(() => {
    expand.value = true;
    if (cardIndex.value == 2) {
      expandHud.value = true;
    }
  }, 100);
};

const contractCard = () => {
  expand.value = false;
  correctAnswer1.value = false;
  correctAnswer2.value = false;
  correctAnswer3.value = false;
  correctAnswer4.value = false;
  wrongAnswer1.value = false;
  wrongAnswer2.value = false;
  wrongAnswer3.value = false;
  wrongAnswer4.value = false;
  neutralAnswers.value = false;
  if (cardIndex.value == 10) {
    expandHud.value = false;
    iniPosMove.value = true;
    shouldCameraMove.value = true;
  }
};

const onClick = (val, event) => {
  if (canClick.value) {
    canClick.value = false;
    showCorrectAnswer();
    neutralAnswers.value = true;
    cancelAnimationFrame(animFrame);
    if (val == question.value.correct) {
      quizStore.addScore(timeLeft.value);
      correctPoints.value = true;
    } else {
      showWrongAnswer(val);
    }
    setTimeout(() => {
      contractCard();
    }, 1500);
  }
};

const showCorrectAnswer = () => {
  switch (question.value.correct) {
    case 1:
      correctAnswer1.value = true;
      break;
    case 2:
      correctAnswer2.value = true;
      break;
    case 3:
      correctAnswer3.value = true;
      break;
    case 4:
      correctAnswer4.value = true;
      break;
    default:
      break;
  }
}

const showWrongAnswer = (val) => {
  timeLeft.value = '0000';
  wrongPoints.value = true;
  switch (val) {
    case 1:
      wrongAnswer1.value = true;
      break;
    case 2:
      wrongAnswer2.value = true;
      break;
    case 3:
      wrongAnswer3.value = true;
      break;
    case 4:
      wrongAnswer4.value = true;
      break;
    default:
      break;
  }
}

const onAfterLeave = (el) => {
  if (!shouldReset.value) {
    cardsStore.incrementCardIndex();
  }  
}

const onBeforeEnter = (el) => {
  timeBarValue.value = maxPoints;
  timeBarColor.value = '#28673c';
  wrongPoints.value = false;
  timeLeft.value = maxPoints;
  cancelAnimationFrame(animFrame);
}

const onAfterEnter = (el) => {   
  startTimer();
}

const startTimer = () => {
  prevTime = performance.now();
  correctPoints.value = false;
  canClick.value = true;
  timer();
};

const timer = () => {
  let aux = performance.now();
  let calc = (aux - prevTime);
  if (calc > clockStep) {
    timeLeft.value = (timeLeft.value - calc).toFixed(0);
    timeBarValue.value = timeLeft.value;
    //start bar colors
    if (timeLeft.value <= 7800) { 
      timeBarColor.value = '#525c3c';
    }
    if (timeLeft.value <= 5800) { 
      timeBarColor.value = '#8e4d3c';
    }
    if (timeLeft.value <= 2800) { 
      timeBarColor.value = '#b9423b';
    }  
    if (timeLeft.value <= 1200) { 
      timeBarColor.value = '#d73b3b';
    }      
    //end bar colors      
    if (timeLeft.value <= 0) {
      timeLeft.value = 0;
      timeBarValue.value = 0;
      cancelAnimationFrame(animFrame);
      wrongPoints.value = true;
      neutralAnswers.value = true;
      setTimeout(() => {
        contractCard(); // COMMENT THIS TO STOP
      }, 1500);      
    } else {
      prevTime = aux;
      animFrame = requestAnimationFrame(timer);
    }
  } else {
    animFrame = requestAnimationFrame(timer);
  }
};

const timeLeftFixed = computed(() => {
  return (timeLeft.value / 1000).toFixed(3).replace(".", ",");
});

const timeBarValueFixed = computed(() => {
  let x = normalizeToRange(timeBarValue.value, 0, maxPoints, 0, 100);
  return x.toFixed(0);
});

const roundWithPrecision = (num, precision) => {
  var multiplier = Math.pow(10, precision);
  return Math.round(num * multiplier) / multiplier;
}
const normalizeToRange = (value, oldMin, oldMax, newMin, newMax) => (((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;

</script>

<template>
  <v-sheet v-if="show"
    class="d-flex flex-column flex-sm-row align-center align-sm-end justify-center h-100 pa-2 pa-sm-10 pb-sm-16 pb-sm-16">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave" @after-enter="onAfterEnter" @before-enter="onBeforeEnter" group>
      <v-card v-if="expand" class="g-card py-4 px-4 rounded-xl" color="#F0F0F0" variant="flat">
        <template v-slot:loader="{ isActive }">
          <v-progress-linear ref="timeBarEl" :active="true" :model-value="timeBarValueFixed" :color="timeBarColor" bg-color="#28673c" height="8"></v-progress-linear>
        </template>

        <v-card-item>
          <div class="g-round mb-0 mb-sm-1 font-weight-bold" :class="{ 'g-round-l-def': !isRtl, 'g-round-l-rtl': isRtl }">
            {{ $t("global.round") }} {{ round }}
          </div>
          <div class="g-text">
            {{ question[current].question }}
          </div>
        </v-card-item>
        <v-card-actions class="text-center justify-center px-3">

          <v-container fluid class="pa-0">
            <v-row dense>
              <v-col class="pa-2">
                <v-btn block rounded="xl" :slim="false" color="#F0F0F0" class="g-bt font-weight-bold"
                  :class="{ 'g-correct-answer': correctAnswer1, 'g-wrong-answer': wrongAnswer1, 'g-neutral-answer': neutralAnswers }"
                  @click="onClick(1, $event)">
                  {{ question[current].answer1 }}
                </v-btn>
              </v-col>
              <v-col class="pa-2">
                <v-btn block rounded="xl" :slim="false" color="#F0F0F0" class="g-bt font-weight-bold"
                  :class="{ 'g-correct-answer': correctAnswer2, 'g-wrong-answer': wrongAnswer2, 'g-neutral-answer': neutralAnswers }"
                  @click="onClick(2, $event)">
                  {{ question[current].answer2 }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col class="pa-2">
                <v-btn block rounded="xl" :slim="false" color="#F0F0F0" class="g-bt font-weight-bold"
                  :class="{ 'g-correct-answer': correctAnswer3, 'g-wrong-answer': wrongAnswer3, 'g-neutral-answer': neutralAnswers }"
                  @click="onClick(3, $event)">
                  {{ question[current].answer3 }}
                </v-btn>
              </v-col>
              <v-col class="pa-2">
                <v-btn block rounded="xl" :slim="false" color="#F0F0F0" class="g-bt font-weight-bold"
                  :class="{ 'g-correct-answer': correctAnswer4, 'g-wrong-answer': wrongAnswer4, 'g-neutral-answer': neutralAnswers }"
                  @click="onClick(4, $event)">
                  {{ question[current].answer4 }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-slide-y-reverse-transition>
    <v-sheet v-if="show" class="g-hud" :class="{ 'g-hud-l-def': !isRtl, 'g-hud-l-rtl': isRtl }">
      <v-slide-y-reverse-transition group>
        <v-sheet v-if="expandHud" class="g-hud-w">
          <div :class="{ 'g-correct-points': correctPoints, 'g-wrong-points': wrongPoints, 'g-hud-total-def': !isRtl, 'g-hud-total-rtl': isRtl }" class="g-hud-total g-show-points py-1">
            +{{ timeLeftFixed }} {{ $t("global.pts") }}
          </div>
          <div class="g-hud-round px-4 py-1">{{ $t("global.round") }}
            <span v-if="!isRtl">0{{ round }}/09</span>
            <span v-if="isRtl">09/0{{ round }}</span>
          </div>
          <div class="g-hud-score pr-4 pl-1 py-1">{{ timedScore }} {{ $t("global.pts") }}</div>
        </v-sheet>
      </v-slide-y-reverse-transition>
    </v-sheet>
  </v-sheet>
</template>

<style scoped>
.g-card {
  max-width: 100%;
  width: 550px;
  color: #28673c;
  margin-bottom: 7dvh;
  /* margin-bottom: 64px */
}

.g-round {
  font-size: clamp(18px, 3dvh, 20px);
  color: #28673c;
  line-height: normal;
}

.g-round-l-def {
  text-align: left;
}

.g-round-l-rtl {
  text-align: right;
}

.g-text {
  color: #28673c;
  font-weight: 400;
  font-size: clamp(20px, 3dvh, 24px);
  line-height: clamp(30px, 3.5dvh, 32px);
  padding-top: 1px;
  padding-bottom: 0px;
}

.g-bt {
  font-size: clamp(12px, 2.3dvh, 15px);
  width: 230px;
  max-width: 100%;
  line-height: 18px;
  background: linear-gradient(94deg, #28673C 7.42%, #07361C 166.68%);
  text-wrap: balance;
  pointer-events: all;
}

.g-neutral-answer {
  opacity: 40%;
  background: linear-gradient(94deg, #919191 7.42%, #232323 166.68%);
  pointer-events: none;
}

.g-correct-answer {
  pointer-events: none;
  opacity: 100%;
  background: linear-gradient(94deg, #4bbf70 7.42%, #07361C 166.68%);
  background-size: 250% 250%;
  -webkit-animation: btBackgroundAnime 2s ease infinite;
  -moz-animation: btBackgroundAnime 2s ease infinite;
  -o-animation: btBackgroundAnime 2s ease infinite;
  animation: btBackgroundAnime 2s ease infinite;  
}
@-webkit-keyframes btBackgroundAnime {
  0%{background-position:0% 39%}
  50%{background-position:100% 62%}
  100%{background-position:0% 39%}
}
@-moz-keyframes btBackgroundAnime {
  0%{background-position:0% 39%}
  50%{background-position:100% 62%}
  100%{background-position:0% 39%}
}
@-o-keyframes btBackgroundAnime {
  0%{background-position:0% 39%}
  50%{background-position:100% 62%}
  100%{background-position:0% 39%}
}
@keyframes btBackgroundAnime {
  0%{background-position:0% 39%}
  50%{background-position:100% 62%}
  100%{background-position:0% 39%}
}
.g-wrong-answer {
  pointer-events: none;
  opacity: 100%;
  background: linear-gradient(94deg, #9f2e2e 7.42%, #d73b3b 166.68%); 
}

:deep(.v-btn.v-btn--density-default) {
  height: clamp(45px, 6dvh, 55px);
}

:deep(.v-btn__content) {
  white-space: normal;
  pointer-events: none;
}

.g-hud {
  font-family: IBM Plex Sans;
  background-color: transparent;
  position: absolute;
  z-index: 90;
  max-width: 100%;
  bottom: 45px;
}

.g-hud-l-def {
  right: 38px;
}

.g-hud-l-rtl {
  left: 38px;
}

.g-hud-w {
  background-color: transparent;
}

.g-hud-round {
  opacity: 0.9;
  background-color: #F3F5F4;
  font-weight: 700;
  font-size: 19px;
  width: 150px;
  height: 35px;
  color: #000000;
  display: inline-block;
  vertical-align: middle;
}

.g-hud-score {
  background-color: #28673C;
  font-weight: 700;
  font-size: 19px;
  color: #F0F0F0;
  text-align: right;
  width: 140px;
  height: 35px;
  display: inline-block;
  vertical-align: middle;
}

.g-hud-total {
  opacity: 0%;
  transition: opacity 0.25s ease 0s;
  background-color: #28673C00;
  font-weight: 700;
  font-size: 24px;
  color: #F0F0F0;
  text-align: right;
  vertical-align: bottom;
  max-width: 100%;
  text-shadow:
    1px 1px 0 #28673C,
    -1px 1px 0 #28673C,
    -1px -1px 0 #28673C,
    1px -1px 0 #28673C;
    padding-right: 5px;
    padding-left: 5px;    
}

.g-hud-total-def {
  text-align: right;
}

.g-hud-total-rtl {
  text-align: left;
}

:deep(.v-card__loader) {
  bottom: 0;
  top: auto;
}

:deep(.v-progress-linear__background) {
  opacity: 0.3;
}

:deep(.v-btn__content) {
  padding-top: 2px;
}

.g-show-points {
  opacity: 1;
}

.g-correct-points {
  color: #15f75d;
  text-shadow:
    1px 1px 0 #F0F0F000,
    -1px 1px 0 #F0F0F000,
    -1px -1px 0 #F0F0F000,
    1px -1px 0 #F0F0F000;
  transform: translate(0px, -60px);
  transition: text-shadow 0.25s ease 0s, transform 1.25s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
  animation: opacityAnim 3.6s ease 0.1s 1; 
}

.g-wrong-points {
  color: #ef2504;
  text-shadow:
    1px 1px 0 #F0F0F000,
    -1px 1px 0 #F0F0F000,
    -1px -1px 0 #F0F0F000,
    1px -1px 0 #F0F0F000;
  transform: translate(0px, -60px);
  transition: text-shadow 0.25s ease 0s, transform 1.25s cubic-bezier(0.165, 0.84, 0.44, 1) 0s;
  animation: opacityAnim 3.6s ease 0.1s 1; 
}

@-webkit-keyframes opacityAnim {
  0%    { opacity: 1; }
  100%  { opacity: 0; }
}
@-moz-keyframes opacityAnim {
  0%    { opacity: 1; }
  100%  { opacity: 0; }
}
@-o-keyframes opacityAnim {
  0%    { opacity: 1; }
  100%  { opacity: 0; }
}
@keyframes opacityAnim {
  0%    { opacity: 1; }
  100%  { opacity: 0; }
}

@media (max-width: 599px) {
  .g-card {
    width: 420px;
    margin-bottom: 20px;
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
    position: relative;
    bottom: auto;
    right: auto;
    left: auto;
  }

  .g-hud-round {
    width: 150px;
  }

  .g-hud-score {
    width: 150px;
  }
}

@media (max-width: 446px) {
  .g-hud-round {
    font-size: 16px;
  }

  .g-hud-score {
    font-size: 16px;
  }

  .g-hud-total {
    font-size: 20px;
    padding-right: 15px;
    padding-left: 15px;      
  }
}

@media (min-width: 2560px) {
  .g-card {
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
    line-height: 42px;
  }

  .g-hud-score {
    font-size: 26px;
    width: 200px;
    height: 52px;
    line-height: 42px;
  }

  .g-hud-total {
    font-size: 30px;
    width: 400px;
    line-height: 42px;
  }
}
</style>