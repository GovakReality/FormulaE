import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from "axios";

export const useAPIStore = defineStore('API', () => {

  const url = 'https://if040cyo8k.execute-api.eu-central-1.amazonaws.com/';
  let leaderboard = ref([]);

  const fetchLeaderboard = async () => {
   
/*       const data = await axios.get(url + 'leaderboard', {
        withCredentials: false,
        headers: {
          'content-type': 'application/json'
        }
    }) */
    const data = await axios.get('/leaderboard')    
    .then((res) => {
      leaderboard.value = res.data;
      //console.log(res.data[0])
      //console.log(leaderboard.value[0])
    })
    .catch((err) => console.error(err));   
/*     const response = await fetch("/leaderboard");
    const data = await response.json();
    console.log(data) */
  }

  return { leaderboard, fetchLeaderboard };
})
