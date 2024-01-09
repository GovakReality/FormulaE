<script setup>
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useQuizStore } from '/src/stores/QuizStore';
  import { useAPIStore } from '/src/stores/APIStore';
  import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useLocale } from 'vuetify';
  import saudiaLogo from '/images/SaudiaLogo.png';

  const { isRtl } = useLocale();

  const cardsStore = useCardsStore();
  const { cardIndex } = storeToRefs(cardsStore);
  const quizStore = useQuizStore();
  const { fullName, email, score, scoreFixed } = storeToRefs(quizStore);
  const APIStore = useAPIStore();

  const expand = ref(false);
  const show = ref(false);
  const isTopTen = ref(false);
  const formattedPlayers = ref([]);

  //const { players } = storeToRefs(APIStore);
  const players = ref([
    {
      full_name: 'JORDAN Mitchell',
      score: '82546',
    },
    {
      full_name: 'Heather Reynolds',
      score: '80317',
    },
    {
      full_name: 'Wesley Anderson',
      score: '78367',
    },
    {
      full_name: 'Natalie Chambers',
      score: '72382',
    },
    {
      full_name: 'Victor Ramirez',
      score: '70111',
    },
    {
      full_name: 'Chloe Bennett',
      score: '56777',
    },
    {
      full_name: 'Desmond Thompson',
      score: '55418',
    },
    {
      full_name: 'Morgan Foster',
      score: '40011',
    },
    {
      full_name: 'Lily Morgan',
      score: '39318',
    },
    {
      full_name: 'Adrian Sanchez',
      score: '25224',
    },
    {
      full_name: 'Victor Reynolds',
      score: '18257',
    },
    {
      full_name: 'Chloe Bennett',
      score: '2312',
    },

  ]);

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
      item = {...item, 'scoreFixed': (item.score / 1000).toFixed(3).replace(".",",")};
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
    quizStore.reset();
    APIStore.reset();
  }  
   
</script>

<template>
  <v-sheet v-if="show" class="d-flex flex-column flex-sm-column flex-md-row align-center justify-center h-100 pa-10">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave" group>
      <v-sheet v-if="expand" class="g-sheet" position="relative" color="transparent">
        <v-sheet
        class="d-flex flex-column justify-center g-card mt-8 mt-sm-0 pt-8 pb-0 pb-md-8"
        :class="{ 'g-card-l-def': !isRtl, 'g-card-l-rtl': isRtl }"
        variant="flat"
        color="transparent"
        >
          <v-sheet class="text-center" color="transparent">
            <div class="g-wrapper">
              <v-img :src="saudiaLogo" width="138" class="text-center justify-center mx-auto" ></v-img>
                
              <!-- <h3 class="g-title font-weight-bold pt-8">
                You are currently in:
              </h3>          
              <div class="g-place font-weight-bold py-8 px-5">
                27<small>th</small>
              </div> -->
              
              <h3 class="g-title font-weight-bold pt-10">
                {{ $t("leaderboard.title") }}
              </h3>          
              <div class="g-points font-weight-bold py-6 px-5">
                {{scoreFixed}} {{ $t("global.pts") }}
              </div> 
  
              <h3 class="g-title font-weight-bold py-2 px-10">
                {{ $t("leaderboard.tip") }}
              </h3>                 
              <div class="g-text pt-4 pb-8 py-md-9 px-12">
                {{ $t("leaderboard.text") }} 
              </div>            

            </div>
          </v-sheet>
          <v-sheet class="text-center justify-center mt-auto d-none d-sm-none d-md-flex" color="transparent">
            <v-btn rounded="xl" color="#f0f0f0" variant="tonal" :slim="false" @click="onClick" class="g-bt font-weight-black mb-2">
              {{ $t("global.tryagain") }}
            </v-btn>
          </v-sheet>
        </v-sheet>                      
      </v-sheet>
      <v-sheet v-if="expand" class="g-sheet g-sheet-l" position="relative" color="transparent">
        <v-card variant="flat" class="g-names-list rounded-0" color="transparent">
          <v-table class="g-table">
            <tbody>
              <tr
                v-for="(item, index) in formattedPlayers"
                :key="item.full_name"
                class="py-4"
              >
                <td
                  class="g-pos px-1"
                  :class="{ 'g-pos-l-def': !isRtl, 'g-pos-l-rtl': isRtl }"
                  >
                    <span v-if="item.full_name">{{ index + 1 }}</span></td>
                <td
                  class="g-name"
                  :class="{ current: item.current, 'g-name-l-def': !isRtl, 'g-name-l-rtl': isRtl }"
                  >
                    {{ item.full_name }}
                    <span v-if="item.finalist" class="g-flag" :class="{ 'g-flag-l-def': !isRtl, 'g-flag-l-rtl': isRtl }"></span>
                </td>
                <td class="g-score">{{ item.scoreFixed }} <span v-if="item.score">{{ $t("global.pts") }}</span></td>
                <td v-if="item.finalist" class="g-final px-0 d-none d-sm-none d-md-inline">
                  <div class="px-3 py-2">{{ $t("leaderboard.finalist") }}</div>
                </td>
              </tr>
              <tr v-if="!isTopTen">
                <td colspan="3" class="g-top">
                  <v-icon icon="mdi-chevron-up" :class="{ 'g-lefticon-def': !isRtl, 'g-lefticon-rtl': isRtl }"></v-icon>
                  <span>{{ $t("leaderboard.top10") }}</span>
                  <v-icon icon="mdi-chevron-up" :class="{ 'g-righticon-def': !isRtl, 'g-righticon-rtl': isRtl }"></v-icon>
                </td>
              </tr> 
              <tr v-if="!isTopTen">
                <td class="g-pos current px-1"></td>
                <td class="g-name current"
                :class="{ 'g-name-l-def': !isRtl, 'g-name-l-rtl': isRtl }"
                >{{fullName}}</td>
                <td class="g-score current">{{scoreFixed}} {{ $t("global.pts") }}</td>
              </tr>                                   
            </tbody>
          </v-table>
        </v-card>
        <v-sheet class="text-center justify-center mt-auto d-flex d-sm-flex d-md-none" color="transparent">
          <v-btn rounded="xl" color="#f0f0f0" variant="tonal" :slim="false" @click="onClick" class="g-bt font-weight-black my-5">
            {{ $t("global.tryagain") }}
          </v-btn>
        </v-sheet>        
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
.g-card-l-def{
  border-top-left-radius: 24px !important;
  border-bottom-left-radius: 24px !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important; 
}
.g-card-l-rtl{
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  border-top-right-radius: 24px !important;
  border-bottom-right-radius: 24px !important; 
}
.g-wrapper {
  color: #F0F0F0;
}
.g-title {
  font-size: 26px;
  line-height: 36px;
}
.g-text {
  font-family: Saudia Sans;
  line-height: normal;
  font-weight: 400;
  font-size: 18px;
  opacity: 0.6;
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
  width: 50px;
  background-color: #F0F0F0;
  color: #000000;
}
.g-pos-l-def {
  text-align: right;
}
.g-pos-l-rtl {
  text-align: left;
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
  max-width: 310px;
  text-wrap: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: normal;
  word-wrap: break-word  
}
.g-name-l-def {
  text-align: left;
}
.g-name-l-rtl {
  text-align: right;
}
.g-flag {
  display: inline-block;
  background-image:url('/images/LeaderboardFlags.png');
  background-size:100% 100%;
  width: 17px;
  height: 100%;
  position: absolute;
  top: 0;
}
.g-flag-l-def {
  right: 0;
}
.g-flag-l-rtl {
  left: 0;
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
  -ms-filter: "FlipH";
}
.g-score {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%),#F0F0F0;
  color: #000000;
  font-family: IBM Plex Sans;
  font-size: 20px;
  text-transform: uppercase;
  line-height: normal;
  font-weight: 700;  
  text-align: right;
  width: 152px;
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
.g-lefticon-def {
  padding-right: 40px;
}
.g-lefticon-rtl {
  padding-left: 40px;
}
.g-righticon-def {
  padding-left: 40px;
}
.g-righticon-rtl {
  padding-right: 40px;
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

:deep(.v-btn__content) {
  padding-top: 2px;
}

@media (max-width: 1089px) {
  .g-card{
    width: 358px;
  }
  .g-names-list {
    width: 542px;
  }  
  .g-pos {
    font-size: 16px;
    width: 45px;
  }  
  .g-name {
    font-size: 17px;
    max-width: 250px; 
  }  
  .g-score {
    font-size: 19px;
    width: 142px;
  }  
  .g-final {
    font-size: 14px;
    width: 80px;
  }  
}

@media (max-width: 959px) {
  .g-card{
    width: 513px;
    height: auto;
    border-top-left-radius: 24px !important;
    border-bottom-left-radius: 0px !important;
    border-top-right-radius: 24px !important;
    border-bottom-right-radius: 0px !important;  
  }
  .g-names-list {  
    width: 513px;
    height: auto;
  }
  .g-pos {
    font-size: 14px;
    width: 30px;
  }  
  .g-name {
    font-size: 17px;
    max-width: 250px; 
  }  
  .g-score {
    font-size: 17px;
    width: 120px;
  }      
}

@media (max-width: 549px) {
  .g-card{
    width: auto;  
  }
  .g-points {
    font-size: 40px;
  }
  .g-title {
    font-size: 24px;
  }
  .g-text {
    font-size: 16px;
  }
  .g-sheet-l {
    width: 100%;
  }
  .g-names-list {  
    width: auto;
  }
  .g-pos {
    font-size: 14px;
    width: auto;
  }  
  .g-name {
    font-size: 16px;
    width: auto;
    max-width: 200px;
  }  
  .g-score {
    font-size: 16px;
    width: auto;
  }    
}
@media (max-width: 529px) {
  .g-title {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  .g-text {
    padding-left: 28px !important;
    padding-right: 28px !important;
  }
  .g-name {
    font-size: 15px;
    max-width: 180px;
  }  
  .g-score {
    font-size: 14px;
    padding-left: 6px !important;
    padding-right: 12px !important;
  }  
  .g-flag {
    width: 12px;
  }  
}
@media (max-width: 399px) {
  .g-title {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
  .g-pos {
    font-size: 12px;
    padding-left: 3px !important;
    padding-right: 3px !important;        
  }  
  .g-name {
    font-size: 14px;
    max-width: 170px;
    padding-left: 8px !important;
    padding-right: 8px !important;    
  }  
  .g-score {
    font-size: 13px;
    padding-left: 8px !important;
    padding-right: 8px !important;
  }  
  .g-flag {
    width: 10px;
  }  
}
@media (min-width: 2560px) {
  .g-card{
    width: 513px;
    height: 684px;
  }
  .g-title {
    font-size: 30px;
  }
  .g-text {
    font-size: 22px;
  }
  .g-place {
    font-size: 60px;
  }
  .g-points {
    font-size: 50px;
  }
  .g-place small {
    font-size: 46px;
  }
  .g-bt {
    font-size: 22px;
    width: 213px;
  }
  :deep(.v-btn.v-btn--density-default) {
    height: 56px;
  }
  .g-names-list {
    width: 780px;
    max-width: 100%;
    height: 684px;
  }
  .g-pos {
    font-size: 22px;
    width: 70px;
  }
  .g-name {
    font-size: 22px;
    max-width: 410px;
  }
  .g-score {
    font-size: 23px;
    width: 210px;
  }
  .g-top {
    font-size: 22px;
    width: 100%;
  }
  .g-top i {
    font-size: 45px;
  }
  .g-final {
    font-size: 18px;
    width: 90px;
  }
  .g-final div {
    width: 100%;
  }
  :deep(.v-table--density-default > .v-table__wrapper > table > tbody > tr > td, .v-table--density-default > .v-table__wrapper > table > thead > tr > td, .v-table--density-default > .v-table__wrapper > table > tfoot > tr > td) {
    height: 57px;
  }
}
</style>