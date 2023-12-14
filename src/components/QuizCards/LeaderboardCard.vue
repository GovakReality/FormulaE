<script setup>
  import { usePositionStore } from '/src/stores/PositionStore';
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useQuizStore } from '/src/stores/QuizStore';
  import { ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';

  const positionStore = usePositionStore();
  const cardsStore = useCardsStore();
  const { cardIndex } = storeToRefs(cardsStore);
  const quizStore = useQuizStore();

  const expand = ref(false);
  const show = ref(true);///////////

  const players = [
    {
      name: 'JORDAN Mitchell',
      position: '1',
      points: '82,546'
    },
    {
      name: 'Heather Reynolds',
      position: '2',
      points: '80,317'
    },
    {
      name: 'Wesley Anderson',
      position: '3',
      points: '80,293'
    },
    {
      name: 'Natalie Chambers',
      position: '4',
      points: '78,601'
    },
    {
      name: 'Victor Ramirez',
      position: '5',
      points: '78,187'
    },
    {
      name: 'Heather Reynolds',
      position: '6',
      points: '80,317'
    },
    {
      name: 'Heather Reynolds',
      position: '7',
      points: '80,317'
    },
    {
      name: 'Heather Reynolds',
      position: '8',
      points: '80,317'
    },
    {
      name: 'Heather Reynolds',
      position: '9',
      points: '80,317'
    },
    {
      name: 'Heather Reynolds',
      position: '10',
      points: '80,317'
    }
  ]

  watch(cardIndex, () => {
    if (cardIndex.value == 12) {
      show.value = true;
      setTimeout(() => expand.value = true, 100);
    } else {
      expand.value = false;
    }
  });

  const onClick = (event) => {
    expand.value = false;
  };

  const onAfterLeave = (el) => {
    //show.value = false;
    //cardsStore.reset();
    //positionStore.reset();
    //quizStore.reset();
  }    
</script>

<template>
  <v-sheet v-if="show" class="d-flex align-center justify-center h-100 pa-10">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave">
      <v-container fluid>
        <v-row no-gutters>
          <v-col>
            <v-card v-if="expand" class="g-card py-5 rounded-s-xl" variant="flat">
              <v-card-item class="text-center">            
                <v-img src="/images/SaudiaLogo.png" width="138" class="text-center justify-center mx-auto" ></v-img>
                <h3 class="g-title font-weight-bold pt-8">
                  You are currently in:
                </h3>          
                <div class="g-place font-weight-bold py-8 px-5">
                  27<small>th</small>
                </div>   
                <h3 class="g-title font-weight-bold py-2 px-7">
                  Tip: you can try answering faster to score more points!
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
          </v-col>
          <v-col>
            <v-card v-if="expand" variant="flat" class="g-names-list rounded-0">
              <v-table>
                <tbody>
                  <tr
                    v-for="item in players"
                    :key="item.name"
                    class="my-10"
                  >
                    <td class="g-pos px-1">{{ item.position }}</td>
                    <td class="g-name">{{ item.name }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
          <v-col>
            <v-card v-if="expand" variant="flat" class="rounded-0">
jkljlk
            </v-card>
          </v-col>          
        </v-row>
      </v-container>

    </v-slide-y-reverse-transition>
  </v-sheet>
</template>

<style scoped>
.g-card{
  background: linear-gradient(68deg, #07361C 9.84%, #28673C 76.17%);
  max-width: 100%;
  width: 413px;
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
  font-size: 16px;
}
.g-place {
  font-family: IBM Plex Sans;
  line-height: normal;
  font-size: 56px;
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
.g-names-list {
  background-color: #F0F0F0;
  max-width: 100%;
  width: 552px;
  color: #000000;
}
.g-pos {
  font-size: 18px;
  text-transform: uppercase;
  line-height: normal;
  text-align: right;
  width: 50px;
}
.g-name {
  font-size: 18px;
  text-transform: uppercase;
  line-height: normal;
  text-align: left;
}
.g-points-list {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%),#F0F0F0;
  max-width: 100%;
  width: 175px;
  color: #000000;
}
</style>