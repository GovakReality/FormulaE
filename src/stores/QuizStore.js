import { defineStore } from 'pinia';
import { ref } from 'vue';
import questionsData from '/src/assets/questions.json';

export const useQuizStore = defineStore('quiz', () => {

  const question = ref();
  let questionsList = [];
  let alreadyIdx = [];

  function reset() {
    questionsList = [];
    alreadyIdx = [];
  };

  function setDificulty(val) {
    setQuestionsList(val);
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

  return { question, reset, setDificulty, newQuestion };
})