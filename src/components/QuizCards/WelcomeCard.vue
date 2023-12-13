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
      color="teal-darken-4"
      variant="elevated"
      >
        <v-card-item class="text-center">
          <v-img
          src="/images/SaudiaLogo.png"
          width="200"
          class="text-center justify-center mx-auto"
          ></v-img>
          <div class="text-h6 mb-1 pa-6">
            Take a quiz now and grab your chance to win exclusive prizes!
          </div>
        </v-card-item>
        <v-card-actions class="text-center justify-center">
          <v-btn rounded="lg" variant="tonal" @click="onClick">
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
}
</style>