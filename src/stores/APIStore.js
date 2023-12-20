import { defineStore } from 'pinia';
import { computed, ref, toRaw } from 'vue';
import axios from "axios";

export const useAPIStore = defineStore('API', () => {

  const url = 'https://if040cyo8k.execute-api.eu-central-1.amazonaws.com/';

  const players = ref([]);
  const APIStatus = ref(0);// 0 = undefined / 1 = ok / 2 = error  

  const fetchLeaderboard = async () => {
    const data = await axios.get('/leaderboard')
    .then((res) => {
      players.value = res.data;
      APIStatus.value = 1;
    })
    .catch((err) => {
      APIStatus.value = 2;
      console.error(err);
    });  
  }

  const sendPlayer = async (val) => {   
    const data = await axios.post('/items', {
      score: val.score,
      full_name: val.full_name,
      email: val.email,
    })
    .then((res) => {
      fetchLeaderboard();
    })
    .catch((error) => {
      APIStatus.value = 2;
    }).finally(() => {
        //Perform action in always
    });
  }

  function reset() {
    APIStatus.value = 0;
  };

  return { players, APIStatus, fetchLeaderboard, sendPlayer, reset};
})
