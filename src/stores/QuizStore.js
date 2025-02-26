import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import questionsData from '/src/assets/questions.json';

export const useQuizStore = defineStore('quiz', () => {

  const question = ref();
  const round = ref(0);
  const score = ref(0);
  const fullName = ref('');
  const email = ref('');
  const terms = ref(false);
  const terms2 = ref(false);
  const actualGenType = ref('');
  const shouldCameraMove = ref(false);
  const iniPosMove = ref(true);
  const eventMode = ref(false);
  const place = ref(0);
  const scorePlace = ref(0);

  let gen1QuestionsList = [];
  let gen2QuestionsList = [];
  let gen3QuestionsList = [];
  let gen3EvoQuestionsList = [];
  let randIdxs = [];

  function incrementRound() {
    round.value++;
  };

  function reset() {
    gen1QuestionsList = [];
    gen2QuestionsList = [];
    gen3QuestionsList = [];
    gen3EvoQuestionsList = [];
    randIdxs = [];
    round.value = 0;
    score.value = 0;
    shouldCameraMove.value = true;
    iniPosMove.value = true;
    scorePlace.value = 0;
    place.value = 0;
    if (eventMode.value) {
      fullName.value = '';
      email.value = '';
      terms.value = false;
      terms2.value = false;
    }
  };

  function setDificulty(val) {
    setQuestionsList(val);
  };

  function addScore(val) {
    score.value = parseFloat(score.value) + parseFloat(val);
  };

  const scoreFixed = computed(() => {
    return (score.value / 1000).toFixed(3).replace(".", ",");
  });

  const scorePlaceFixed = computed(() => {
    return (scorePlace.value / 1000).toFixed(3).replace(".", ",");
  });

  const setQuestionsList = (dif) => {
    gen1QuestionsList = questionsData.filter(v => v.difficulty.includes(dif) && v.type == 'gen1');
    gen2QuestionsList = questionsData.filter(v => v.difficulty.includes(dif) && v.type == 'gen2');
    gen3QuestionsList = questionsData.filter(v => v.difficulty.includes(dif) && v.type == 'gen3');
    gen3EvoQuestionsList = questionsData.filter(v => v.difficulty.includes(dif) && v.type == 'gen3evo');
  }

  const newQuestion = (type) => {
    if (actualGenType.value != type) {
      actualGenType.value = type;
      randIdxs = [];
    }
    switch (type) {
      case 'gen1':
        let i1 = generateRandIndex(0, gen1QuestionsList.length - 1);
        question.value = gen1QuestionsList[i1];
        break;
      case 'gen2':
        let i2 = generateRandIndex(0, gen2QuestionsList.length - 1);
        question.value = gen2QuestionsList[i2];
        break;
      case 'gen3':
        let i3 = generateRandIndex(0, gen3QuestionsList.length - 1);
        question.value = gen3QuestionsList[i3];
        break;
      case 'gen3evo':
        let i4 = generateRandIndex(0, gen3EvoQuestionsList.length - 1);
        question.value = gen3EvoQuestionsList[i4];
        break;
    };
  }

  const generateRandIndex = (min, max) => {
    let lgt = max - min + 1;
    let rand = Math.floor(Math.random() * (lgt) + min);
    if (!randIdxs.includes(rand)) {
      randIdxs.push(rand);
      return rand;
    } else {
      if (randIdxs.length < lgt) {
        return generateRandIndex(min, max);
      } else {
        randIdxs = [];
        return generateRandIndex(min, max);
      }
    }
  }

  /*   const arrShuffle = (input) => {
      const shuffledInput = [...input];
      for (let i = 0; i < input.length; i++) {
           const randomI = Math.floor(Math.random() * i);
           [shuffledInput[i], shuffledInput[randomI]] = [shuffledInput[randomI], shuffledInput[i]];
      };
      return shuffledInput;
    }; */

  return { question, round, fullName, email, score, place, scorePlace, terms, terms2, eventMode, scoreFixed, scorePlaceFixed, shouldCameraMove, iniPosMove, incrementRound, reset, setDificulty, newQuestion, addScore };
})