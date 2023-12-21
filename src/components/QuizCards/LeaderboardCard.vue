<script setup>
  import { usePositionStore } from '/src/stores/PositionStore';
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useQuizStore } from '/src/stores/QuizStore';
  import { useAPIStore } from '/src/stores/APIStore';
  import { ref, watch, computed } from 'vue';
  import { storeToRefs } from 'pinia';

  const positionStore = usePositionStore();
  const cardsStore = useCardsStore();
  const { cardIndex } = storeToRefs(cardsStore);
  const quizStore = useQuizStore();
  const { fullName, email, score } = storeToRefs(quizStore);
  const APIStore = useAPIStore();
  const { players } = storeToRefs(APIStore);

  const expand = ref(false);
  const show = ref(false);
  const isTopTen = ref(false);
  const formattedPlayers = ref([]);

/*   fullName.value = 'Heather Reynolds234';
  score.value = '80,317'; */

/*   const players = ref([
    {
      full_name: 'JORDAN Mitchell',
      score: '82,546',
    },
    {
      full_name: 'Heather Reynolds',
      score: '80,317',
    },
    {
      full_name: 'Heather Reynolds2',
      score: '80,317',
    },
    {
      full_name: 'Heather Reynolds2',
      score: '80,317',
    },
    {
      full_name: 'Heather Reynolds2',
      score: '80,317',
    },
    {
      full_name: 'Heather Reynolds23',
      score: '80,317',
    },
    {
      full_name: 'Heather Reynolds23',
      score: '80,317',
    },
    {
      full_name: 'Heather Reynolds23',
      score: '80,317',
    },
    {
      full_name: 'Heather Reynolds23',
      score: '80,317',
    },
    {
      full_name: 'Heather Reynolds23',
      score: '80,317',
    },
    {
      full_name: 'Heather Reynolds234',
      score: '80,317',
    },
    {
      full_name: 'Heather Reynolds2',
      score: '80,317',
    },

  ]); */

  watch(cardIndex, () => {
    if (cardIndex.value == 12) {
      show.value = true;
      formatLeaderboard();
      setTimeout(() => expand.value = true, 100);
    } else {
      expand.value = false;
    }
  });

  const formatLeaderboard = () => {
    players.value.forEach((item, index) => {
      if (index < 10) {
        if (item.full_name == fullName.value && item.score == score.value) {
          item = {...item, 'current': true};
          isTopTen.value = true;
        }
      }
      if (index < 3) {
        item = {...item, 'finalist': true};
      }
      formattedPlayers.value.push(item);
    });
    let rows = 10;
    if(isTopTen.value) {
      rows = 12;
    }
    let blank = rows - formattedPlayers.value.length;
    if (blank > 0) {
      for(let i = 0; i < blank; i++) {
        formattedPlayers.value.push('');
      }
    } else if (blank < 0) {
      for(let i = 0; i > blank; i--) {
        formattedPlayers.value.pop();
      }
    }
  };

/*   const playersFinalists = computed(() => {
    return players.value.map((el, index) => {
      return index < 3 ? {...el, finalist: true} : {...el};
    });
  });

  const playersChecked = computed(() => {
    return playersFinalists.value.map((el, index) => {
      return index == currentIndex.value ? {...el, current: true} : {...el};
    });
  }); */

  const onClick = (event) => {
    expand.value = false;
  };

  const onAfterLeave = (el) => {
    show.value = false;
    cardsStore.reset();
    positionStore.reset();
    quizStore.reset();
    APIStore.reset();
  }    
</script>

<template>
  <v-sheet v-if="show" class="d-flex align-center justify-center h-100 pa-10">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave" group>
      <v-sheet v-if="expand" class="g-sheet" position="relative" color="transparent">
        <v-card class="g-card py-5 rounded-s-xl rounded-e-0" variant="flat">
          <v-card-item class="text-center">            
            <v-img src="/images/SaudiaLogo.png" width="138" class="text-center justify-center mx-auto" ></v-img>
            
<!--             <h3 class="g-title font-weight-bold pt-8">
              You are currently in:
            </h3>          
            <div class="g-place font-weight-bold py-8 px-5">
              27<small>th</small>
            </div> -->

            <h3 class="g-title font-weight-bold pt-8">
              Your score is:
            </h3>          
            <div class="g-points font-weight-bold py-6 px-5">
              {{score}} PTS
            </div> 

            <h3 class="g-title font-weight-bold py-2 px-7">
              Tip: answer faster to score more points!
            </h3>                 
            <div class="g-text py-9 px-9">
              If you're among the finalists by the end of the contest, you will be notified via email about your prize. 
            </div>                    
          </v-card-item>       
          <v-card-actions class="text-center justify-center">
            <v-btn rounded="xl" variant="tonal" :slim="false" @click="onClick" class="g-bt font-weight-black">
              TRY AGAIN
            </v-btn>
          </v-card-actions>        
        </v-card>               
      </v-sheet>
      <v-sheet v-if="expand" class="g-sheet" position="relative" color="transparent">
        <v-card variant="flat" class="g-names-list rounded-0" color="transparent">
          <v-table class="g-table">
            <tbody>
              <tr
                v-for="(item, index) in formattedPlayers"
                :key="item.full_name"
              >
                <td class="g-pos px-1"> <span v-if="item.full_name">{{ index + 1 }}</span></td>
                <td class="g-name" :class="{ current: item.current }">
                  {{ item.full_name }}
                  <span v-if="item.finalist" class="g-flag"></span>
                </td>
                <td class="g-score">{{ item.score }} <span v-if="item.score">PTS</span></td>
                <td v-if="item.finalist" class="g-final px-0">
                  <div class="px-3 py-2">finalist</div>
                </td>
              </tr>
              <tr v-if="!isTopTen">
                <td colspan="3" class="g-top">
                  <v-icon icon="mdi-chevron-up" class="pr-10"></v-icon>
                  <span>TOP 10</span>
                  <v-icon icon="mdi-chevron-up" class="pl-10"></v-icon>
                </td>
              </tr> 
              <tr v-if="!isTopTen">
                <td class="g-pos current px-1"></td>
                <td class="g-name current">{{fullName}}</td>
                <td class="g-score current">{{score}} PTS</td>
              </tr>                                   
            </tbody>
          </v-table>
        </v-card>
      </v-sheet>
    </v-slide-y-reverse-transition>
  </v-sheet>
</template>

<style scoped>
.g-sheet {
  background-color: transparent;
}
.g-card{
  color: #F0F0F0;
  background: linear-gradient(68deg, #07361C 9.84%, #28673C 76.17%);
  max-width: 100%;
  width: 413px;
  height: 624px;
}
.g-title {
  font-size: 26px;
  line-height: 36px;
}
.g-text {
  font-family: Saudia Sans;
  line-height: normal;
  font-weight: 400;
  font-size: 16px;
}
.g-place {
  font-family: IBM Plex Sans;
  line-height: normal;
  font-size: 56px;
}
.g-points {
  font-family: IBM Plex Sans;
  line-height: normal;
  font-size: 46px;
}
.g-place small {
  font-size: 42px;
}
.g-bt {
  font-size: 18px;
  width: 183px;
  max-width: 100%;
  line-height: normal;
  letter-spacing: 0.54px;
}
:deep(.v-btn--variant-tonal .v-btn__underlay) {
  opacity: 0.4;
}
:deep(.v-btn.v-btn--density-default) {
  height: 46px;
}
.g-table {
  background-color: transparent;
}
.g-table table td {
  border: none !important;
}
.g-names-list {
  max-width: 100%;
  width: 642px;
  height: 624px;
}
.g-pos {
  font-size: 18px;
  text-transform: uppercase;
  line-height: normal;
  text-align: right;
  width: 50px;
  background-color: #F0F0F0;
  color: #000000;
}
.g-name {
  font-size: 18px;
  text-transform: uppercase;
  line-height: normal;
  text-align: left;
  font-weight: 700;
  background-color: #F0F0F0;
  color: #000000;
  position: relative;
}
.g-flag {
  display: inline-block;
  background-image:url('/images/LeaderboardFlags.png');
  background-size:100% 100%;
  width: 17px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
}
.g-score {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%),#F0F0F0;
  color: #000000;
  font-size: 20px;
  text-transform: uppercase;
  line-height: normal;
  text-align: left;
  font-weight: 500;  
  text-align: right;
}
.g-top {
  font-size: 20px;
  text-transform: uppercase;
  line-height: normal;
  text-align: center;
  font-weight: 700;
  color:#F0F0F0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.25) 100%), #F0F0F0;
  width: 100%;
}
.g-top i {
  font-size: 45px;
}
.g-top span {
  display: inline-block;
  vertical-align: middle;
  margin-top: 1px;
}
.current {
  color:#28673C;
}
.g-final {
  font-size: 15px;
  line-height: normal;
  text-align: center;
  font-weight: 700;  
  text-transform: uppercase;
  max-width: 100%;
  width: 90px;
  vertical-align: text-top;
}
.g-final div {
  background-color: #28673C;
  color:#F0F0F0;
  width: 100%;
}
</style>