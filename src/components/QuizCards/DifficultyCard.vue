<script setup>
import { useCardsStore } from '/src/stores/CardsStore';
import { useQuizStore } from '/src/stores/QuizStore';
import { ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import saudiaLogo from '/images/SaudiaLogo.svg';

const cardsStore = useCardsStore();
const { cardIndex } = storeToRefs(cardsStore);
const quizStore = useQuizStore();
const shouldReset = ref(false);
const expand = ref(false);
const show = ref(false);

watch(cardIndex, () => {
  if (cardIndex.value == 1) {
    show.value = true;
    shouldReset.value = false;
    setTimeout(() => expand.value = true, 100);
  } else if (cardIndex.value == 0) {
    shouldReset.value = true;
    show.value = false;
    expand.value = false;
  } else {
    expand.value = false;
  }
});

const onClick = (val, event) => {
  expand.value = false;
  switch (val) {
    case 1:
      quizStore.setDificulty('easy');
      break;
    case 2:
      quizStore.setDificulty('medium');
      break;
    case 3:
      quizStore.setDificulty('hard');
      break;
    default:
      quizStore.setDificulty('easy');
  }
};

const onAfterLeave = (el) => {
  show.value = false;
  if (!shouldReset.value) {
    cardsStore.incrementCardIndex();
  }
}

/*   const handleHeight = () => {
    let topHeight =  84 + 40;
    document.documentElement.style.setProperty('--topH', `${topHeight}px`);
  }   

  onMounted(() => {
    handleHeight();
    window.addEventListener('resize', handleHeight);
  }); */
</script>

<template>
  <v-sheet v-if="show" class="d-flex align-center align-sm-end justify-center justify-sm-end h-100 px-2 px-sm-9 pb-sm-10">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave">
      <v-card v-if="expand" class="g-card py-4 rounded-xl" variant="flat">
        <v-card-item class="text-center">
          <v-img :src="saudiaLogo" width="128" class="text-center justify-center mx-auto"></v-img>
          <h3 class="g-title">
            {{ $t("difficulty.title") }}
          </h3>
          <div class="g-text">
            {{ $t("difficulty.text1") }}
          </div>
          <div class="g-text g-text2">
            {{ $t("difficulty.text2") }}
          </div>
        </v-card-item>
        <v-card-actions class="text-center justify-center">
          <v-container fluid class="pa-0">
            <v-row no-gutters>
              <v-col>
                <v-btn rounded="xl" variant="tonal" :slim="false" class="g-bt-diff font-weight-black my-2"
                  @click="onClick(1)">
                  {{ $t("global.easy") }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-btn rounded="xl" variant="tonal" :slim="false" class="g-bt-diff font-weight-black my-2"
                  @click="onClick(2)">
                  {{ $t("global.medium") }}
                </v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-btn rounded="xl" variant="tonal" :slim="false" class="g-bt-diff font-weight-black my-2"
                  @click="onClick(3)">
                  {{ $t("global.hard") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-slide-y-reverse-transition>
  </v-sheet>
</template>

<style scoped>
.g-card {
  background: linear-gradient(69deg, #07361C 9.61%, #07361C 9.61%, #026536 80.85%);
  max-width: 100%;
  width: 350px;
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

.g-text2 {
  padding-top: clamp(12px, 2.4dvh, 34px);
  padding-bottom: 4px;
}

.g-bt-diff {
  font-size: clamp(15px, 2.3dvh, 18px);
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
  .g-img {
    width: 100px !important;
  }

  .g-text {
    padding-left: 12px;
    padding-right: 12px;
    font-size: clamp(16px, 3dvh, 16px);
    line-height: 26px;
    padding-top: 11px;
    padding-bottom: 0px;
  }

  .g-title {
    font-size: clamp(17px, 3dvh, 17px);
    line-height: 26px;
    padding-top: 11px;
    padding-bottom: 0px;
  }
}

@media (min-width: 2560px) {
  .g-card {
    width: 513px;
  }

  .g-title {
    font-size: 34px;
    line-height: 38px;
  }

  .g-text {
    font-size: 29px;
    line-height: 36px;
  }

  .g-text2 {
    padding-left: 50px;
    padding-right: 50px;
    padding-bottom: 10px;
  }

  .g-bt-diff {
    font-size: 22px;
    width: 220px;
    margin: 12px 0 !important;
  }

  :deep(.v-btn.v-btn--density-default) {
    height: 56px;
  }
}
</style>