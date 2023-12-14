<script setup>
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useLoadingStore } from '/src/stores/LoadingStore';
  import { ref, watch, onMounted} from 'vue';
  import { storeToRefs } from 'pinia';

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
      expand.value = true;
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
  <v-sheet v-if="show" class="d-flex align-end justify-end h-100 pa-10">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave">
      <v-card
      v-if="expand"
      class="g-card py-5 pe-2 rounded-xl"
      variant="elevated"
      >
        <v-card-item class="text-center">
          <v-img
          src="/images/SaudiaLogo.png"
          width="150"
          class="text-center justify-center mx-auto"
          ></v-img>
          <h3 class="g-title font-weight-bold my-1 pa-6">
            Take a quiz now<br>and grab your chance<br>to win exclusive prizes!
          </h3>
        </v-card-item>
        <v-card-actions class="text-center justify-center">
          <v-btn rounded="xl" variant="tonal" :slim="false" @click="onClick" class="g-bt-start font-weight-black">
            Start Quiz
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-slide-y-reverse-transition>
  </v-sheet>
</template>

<style scoped>
.g-card{
  background: linear-gradient(45deg, rgba(7, 54, 28, 1) 0%, rgba(2, 101, 54, 1) 100%);
  max-width: 100%;
  width: 400px;
  color: #F0F0F0;
}
.g-title {
  font-size: 26px;
}
.g-bt-start {
  font-size: 17px;
  width: 190px;
  max-width: 100%;
}

:deep(.v-btn--variant-tonal .v-btn__underlay) {
  opacity: 0.4;
}

:deep(.v-btn.v-btn--density-default) {
  height: 45px;
}
</style>