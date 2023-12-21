import { defineStore } from 'pinia';
import { ref } from 'vue';
import questionsData from '/src/assets/questions.json';

export const useQuizStore = defineStore('quiz', () => {

  const question = ref();
  const round = ref(0);
  const score = ref(0);
  const fullName = ref('');
  const email = ref('');

  let questionsList = [];
  let alreadyIdx = [];

  function incrementRound() {
    round.value++;
  };

  function reset() {
    questionsList = [];
    alreadyIdx = [];
    round.value = 0;
    score.value = 0;
  };

  function setDificulty(val) {
    setQuestionsList(val);
  };

  function addScore(val) {
    score.value = parseFloat(score.value) + parseFloat(val);
  };

  const setQuestionsList = (val) => {
    questionsList = questionsData.filter(v => v.difficulty.includes(val));
  }

  const newQuestion = () => {
    let rand = generateRandIndex(0,questionsList.length - 1);
    question.value = questionsList[rand];
  }

  const generateRandIndex = (min, max) => {
    let lgt = max - min + 1;
    let rand = Math.floor(Math.random() * (lgt) + min);
    if(!alreadyIdx.includes(rand)) {
      alreadyIdx.push(rand);
      return rand;
    } else {
      if(alreadyIdx.length < lgt) {
        return generateRandIndex(min, max);
      } else {
        alreadyIdx = [];
        return generateRandIndex(min, max);
      }
    }
  }

  return { question, round, fullName, email, score, incrementRound, reset, setDificulty, newQuestion, addScore };
})