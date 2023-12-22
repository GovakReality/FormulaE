import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import questionsData from '/src/assets/questions.json';

export const useQuizStore = defineStore('quiz', () => {

  const question = ref();
  const round = ref(0);
  const score = ref(0);
  const fullName = ref('');
  const email = ref('');
  const actualGenType = ref('');
  const shouldCameraMove = ref(false);
  const quizEnded = ref(false);

  let gen1QuestionsList = [];
  let gen2QuestionsList = [];
  let gen3QuestionsList = [];
  let randIdxs = [];

  function incrementRound() {
    round.value++;
  };

  function reset() {
    gen1QuestionsList = [];
    gen2QuestionsList = [];
    gen3QuestionsList = [];
    randIdxs = [];
    round.value = 0;
    score.value = 0;
    shouldCameraMove.value = false;
    quizEnded.value = false;
  };

  function setDificulty(val) {
    setQuestionsList(val);
  };

  function addScore(val) {
    score.value = parseFloat(score.value) + parseFloat(val);
  };

  const scoreFixed = computed(() => {
    return (score.value / 1000).toFixed(3).replace(".",",");
  });

  const setQuestionsList = (dif) => {
    gen1QuestionsList = questionsData.filter(v => v.difficulty.includes(dif) && v.type == 'gen1');
    gen2QuestionsList = questionsData.filter(v => v.difficulty.includes(dif) && v.type == 'gen2');
    gen3QuestionsList = questionsData.filter(v => v.difficulty.includes(dif) && v.type == 'gen3');
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
    };
  }

  const generateRandIndex = (min, max) => {
    let lgt = max - min + 1;
    let rand = Math.floor(Math.random() * (lgt) + min);
    if(!randIdxs.includes(rand)) {
      randIdxs.push(rand);
      return rand;
    } else {
      if(randIdxs.length < lgt) {
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

  return { question, round, fullName, email, score, scoreFixed, shouldCameraMove, quizEnded, incrementRound, reset, setDificulty, newQuestion, addScore };
})