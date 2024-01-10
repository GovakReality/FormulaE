<script setup>
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useLoadingStore } from '/src/stores/LoadingStore';
  import { ref, watch, onMounted} from 'vue';
  import { storeToRefs } from 'pinia';
  import saudiaLogo from '/images/SaudiaLogo.png';
  
  const cardsStore = useCardsStore();
  const { cardIndex } = storeToRefs(cardsStore);
  const loadingStore = useLoadingStore();
  const { loadStart, loadComplete, loadError, loadProgress } = storeToRefs(loadingStore);
  const expand = ref(false);
  const show = ref(false);

  
  watch(loadComplete, (val) => {
    if (loadComplete.value) {
      expand.value = true;
    }
  });

  watch(cardIndex, () => {
    if (cardIndex.value == 0) {
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
    show.value = false;
    cardsStore.incrementCardIndex();
  }  

  onMounted(() => {
    show.value = true;
  });  
 
</script>

<template>
  <v-sheet v-if="show" class="d-flex align-center align-sm-end justify-center justify-sm-end h-100 pa-8 pb-16 pa-sm-10">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave">
      <v-card
      v-if="expand"
      class="g-card py-5 rounded-xl"
      variant="flat"
      >
        <v-card-item class="text-center">
        
          <v-img
            :src=saudiaLogo
            width="138"
            class="text-center justify-center mx-auto"
          ></v-img>
          <h3 class="g-title font-weight-bold my-2 pt-4 pb-1 py-sm-6 px-1 px-sm-2">
            {{ $t("welcome.title") }}
          </h3>          
          <h3 class="g-title font-weight-bold my-1 pt-1 pb-0 pb-sm-6 px-4 px-sm-7">
            {{ $t("welcome.subtitle") }}
          </h3>
        </v-card-item>
        <v-card-actions class="text-center justify-center">
          <v-btn rounded="xl" variant="tonal" :slim="false" @click="onClick" class="g-bt-start font-weight-black">
            {{ $t("welcome.start") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-slide-y-reverse-transition>
  </v-sheet>
</template>

<style scoped>
.g-card{
  background: linear-gradient(69deg, #07361C 9.61%, #07361C 9.61%, #026536 80.85%);
  max-width: 100%;
  width: 413px;
  color: #F0F0F0;
}
.g-title {
  font-size: 28px;
  line-height: 34px;
}
.g-bt-start {
  font-size: 18px;
  width: 183px;
  max-width: 100%;
  line-height: normal;
}

:deep(.v-btn--variant-tonal .v-btn__underlay) {
  opacity: 0.4;
}

:deep(.v-btn.v-btn--density-default) {
  height: 46px;
}

:deep(.v-btn__content) {
  padding-top: 2px;
}

@media (max-width: 599px) {
  .g-card{
    width: 333px;
  }
  .g-title {
    font-size: 18px;
    line-height: 28px;
    padding: 0px;
  }
  .g-bt-start {
    font-size: 16px;
    width: 130px;
  }
  :deep(.v-btn.v-btn--density-default) {
    height: 36px;
  }  
}

@media (min-width: 2560px) {
  .g-card{
    width: 513px;
  }
  .g-title {
    font-size: 32px;
    line-height: 38px;
  }  
  .g-bt-start {
    font-size: 22px;
    width: 220px;
  } 
  :deep(.v-btn.v-btn--density-default) {
    height: 56px;
  }  
}
</style>