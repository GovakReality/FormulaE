<script setup>
import { useCardsStore } from '/src/stores/CardsStore';
import { useLoadingStore } from '/src/stores/LoadingStore';
import { ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import saudiaLogo from '/images/SaudiaLogo.svg';

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
  <v-sheet v-if="show" class="d-flex align-end justify-center justify-sm-end h-100 px-2 px-sm-9 pb-sm-10">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave">
      <v-card v-if="expand" class="g-card py-1 py-sm-4 rounded-xl" variant="flat">
        <v-card-item class="text-center g-card-item">

          <v-img :src=saudiaLogo width="128" class="text-center justify-center mx-auto g-img"></v-img>
          <h3 class="g-title">
            {{ $t("welcome.title") }}
          </h3>

          <h3 class="g-text d-none d-sm-block">
            {{ $t("welcome.subtitle") }}
          </h3>
        </v-card-item>
        <v-card-actions class="text-center justify-center g-card-actions">
          <v-btn rounded="xl" variant="tonal" :slim="false" @click="onClick" class="g-bt-start font-weight-black my-2">
            {{ $t("welcome.start") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-slide-y-reverse-transition>
  </v-sheet>
</template>

<style scoped>
.g-card {
  background: linear-gradient(69deg, #07361C 9.61%, #07361C 9.61%, #026536 80.85%);
  max-width: 100%;
  width: 285px;
  color: #F0F0F0;
}

.g-title {
  font-weight: bold;
  font-size: clamp(18px, 3.6dvh, 22px);
  line-height: clamp(28px, 4.2dvh, 29px);
  padding-top: clamp(12px, 3.4dvh, 32px);
  padding-bottom: clamp(12px, 3dvh, 20px);
  padding-left: 14px;
  padding-right: 14px;
}

.g-text {
  font-weight: 400;
  font-size: clamp(16px, 3dvh, 20px);
  line-height: clamp(27px, 3.5dvh, 28px);
  padding-bottom: 4px;
  padding-left: 28px;
  padding-right: 28px;
}

.g-bt-start {
  font-size: clamp(16px, 2.3dvh, 18px);
  width: 183px;
  max-width: 100%;
  line-height: normal;
}

:deep(.v-btn--variant-tonal .v-btn__underlay) {
  opacity: 0.4;
}

:deep(.v-btn.v-btn--density-default) {
  height: clamp(32px, 6.4dvh, 44px);
}

:deep(.v-btn__content) {
  padding-top: 2px;
}

@media (max-width: 599px) {
  .g-card {
    width: 333px;
  }
  .g-card-item {
    padding: 5px;
    padding-top: 10px;
  }
  .g-card-actions {
    padding-top: 0px;
  }
  .g-img {
    width: 110px !important;
  }
  .g-title {
    font-size: clamp(18px, 3dvh, 20px);
    line-height: 26px;
    padding-top: 18px;
    padding-bottom: 0px;
  }  
}

@media (min-width: 2560px) {
  .g-card {
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