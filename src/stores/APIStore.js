import { defineStore, storeToRefs } from 'pinia';
import { computed, ref, toRaw } from 'vue';
import { useQuizStore } from '/src/stores/QuizStore';
import axios from "axios";
import axiosRetry from 'axios-retry';

export const useAPIStore = defineStore('API', () => {

  const quizStore = useQuizStore();
  const { place, scorePlace } = storeToRefs(quizStore);

  const url = import.meta.env.VITE_API_URL;

  const players = ref([]);

  const APIStatus = ref(0);// 0 = undefined / 1 = ok / 2 = send error / 3 = fetch error / 4 = fetch place error
  const isLoading = ref(false);

  axiosRetry(axios, {
    retries: 2, // number of retries
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: () => true    
  });

  const fetchLeaderboard = async () => {
    const data = await axios.get(url + 'leaderboard')
    .then((res) => {
      players.value = res.data;
      APIStatus.value = 1;
    })
    .catch((error) => {
      APIStatus.value = 3;
      //console.error(error);
    }).finally(() => {
      //Perform action in always
      isLoading.value = false;
  });  
  }

  const sendPlayer = async (val) => {   
    isLoading.value = true;
    const data = await axios.post(url + 'items', {
      score: val.score,
      full_name: val.full_name,
      email: val.email,
      consent: val.consent,
    })
    .then((res) => {
      getPlayer(val);
    })
    .catch((error) => {
      isLoading.value = false;
      APIStatus.value = 2;
      //console.error(error);
    }).finally(() => {
        //Perform action in always
    });
  }

  const getPlayer = async (val) => {
    const data = await axios.get(url + 'items/' + val.email)
    .then((res) => {
      place.value = res.data.place;
      scorePlace.value = res.data.score;
      fetchLeaderboard();
    })
    .catch((error) => {
      isLoading.value = false;
      APIStatus.value = 4;
    }).finally(() => {
      //Perform action in always
  });  
  }

  function reset() {
    APIStatus.value = 0;
  };

  return { players, place, scorePlace, APIStatus, isLoading, fetchLeaderboard, sendPlayer, reset};
})
