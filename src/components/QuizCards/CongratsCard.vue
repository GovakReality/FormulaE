<script setup>
import { useCardsStore } from '/src/stores/CardsStore';
import { useQuizStore } from '/src/stores/QuizStore';
import { useAPIStore } from '/src/stores/APIStore';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import saudiaLogo from '/images/SaudiaLogo.png';
import { useI18n } from 'vue-i18n'
import { useLocale } from 'vuetify';

const { t } = useI18n();
const { isRtl } = useLocale();

const cardsStore = useCardsStore();
const { cardIndex } = storeToRefs(cardsStore);
const quizStore = useQuizStore();
const { fullName, email, score, scoreFixed } = storeToRefs(quizStore);
const APIStore = useAPIStore();
const { APIStatus } = storeToRefs(APIStore);

const expand = ref(false);
const show = ref(false);
const shouldReset = ref(false);
const loading = ref(false);
const showError = ref(false);
const errorMsg = ref('');

const isFormValid = ref(false);
const terms = ref(false);

const fullNameRules = [
  value => {
    if (value) return true
    return t('rules.name.required')
  },
  value => {
    if (value?.length > 1) return true
    return t('rules.name.length')
  },
];
const emailRules = [
  value => {
    if (value) return true
    return t('rules.email.required')
  },
  value => {
    if (/.+@.+\..+/.test(value)) return true
    return t('rules.email.format')
  },
];
const termsRules = [
  value => {
    if (value) return true
    return t('rules.terms.required')
  },
];

watch(cardIndex, () => {
  if (cardIndex.value == 11) {
    shouldReset.value = false;
    show.value = true;
    setTimeout(() => expand.value = true, 100);
  } else {
    expand.value = false;
  }
});

const submit = async (event) => {
  loading.value = true;
  if (isFormValid) {
    /*       APIStore.sendPlayer({
            score: score.value,
            full_name: fullName.value,
            email: email.value,
          }); */
    APIStatus.value = 1; //remove
  }
};

watch(APIStatus, () => {
  if (APIStatus.value == 1) {
    loading.value = false;
    expand.value = false;
  } else if (APIStatus.value > 1) {
    errorMsg.value = 'ERROR ' + APIStatus.value + ': Please wait a few minutes before you try again.';
    showError.value = true;
    loading.value = false;
    APIStatus.value = 0;
  }
});

const tryAgainClick = (event) => {
  expand.value = false;
  shouldReset.value = true;
};

const onAfterLeave = (el) => {
  show.value = false;
  if (shouldReset.value) {
    cardsStore.reset();
    quizStore.reset();
    APIStore.reset();
  } else {
    cardsStore.incrementCardIndex();
  }
};
</script>

<template>
  <v-sheet v-if="show" class="d-flex flex-column align-center justify-center h-95">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave" group>
      <v-sheet v-if="expand" class="g-sheet" position="relative" color="transparent">
        <v-card class="g-card py-4 rounded-xl" variant="flat">
          <v-card-item class="text-center">
            <v-img :src="saudiaLogo" width="128" class="text-center justify-center mx-auto"></v-img>
            <h3 class="g-title pt-xxl-8">
              {{ $t("congrats.title") }}
            </h3>
            <h3 class="g-title pt-1">
              {{ $t("congrats.subtitle") }}
            </h3>
            <div class="g-points font-weight-bold px-5">
              {{ scoreFixed }} {{ $t("global.pts") }}
            </div>
            <div class="g-text px-7 px-xxl-11">
              {{ $t("congrats.text") }}
            </div>
            <v-form @submit.prevent="submit" class="px-6 pt-xxl-6 g-form" v-model="isFormValid">
              <v-text-field v-model="fullName" :label="$t('global.fullname')" :rules="fullNameRules" variant="solo"
                rounded="lg" bg-color="white" class="g-tfield mb-xxl-8" required></v-text-field>

              <v-text-field v-model="email" :label="$t('global.email')" type="email" :rules="emailRules" variant="solo"
                rounded="lg" bg-color="white" class="g-tfield mb-xxl-8" required></v-text-field>

              <v-checkbox v-model="terms" :rules="termsRules" :center-affix=false color="white"
                false-icon="mdi-checkbox-blank" hide-details class="g-terms"
                :class="{ 'g-terms-l-def': !isRtl, 'g-terms-l-rtl': isRtl }" :ripple="false"
                :label="$t('congrats.terms')"></v-checkbox>

              <v-btn :loading="loading" type="submit" rounded="xl" variant="tonal" :slim="false" :disabled="!isFormValid"
                class="g-bt font-weight-black mb-2">{{ $t("global.continue") }}</v-btn>
            </v-form>
          </v-card-item>
          <v-snackbar v-model="showError" multi-line color="error" elevation="16" timeout="10000">
            {{ errorMsg }}
            <template v-slot:actions>
              <v-btn color="white" variant="text" @click="showError = !showError">
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </v-card>
      </v-sheet>
      <v-sheet v-if="expand" class="g-sheet g-try" color="transparent"
        :class="{ 'g-try-l-def': !isRtl, 'g-try-l-rtl': isRtl }">
        <v-btn rounded="xl" variant="tonal" :slim="false" @click="tryAgainClick" class="g-try-bt font-weight-black">
          {{ $t("global.tryagain") }}
        </v-btn>
      </v-sheet>
    </v-slide-y-reverse-transition>
  </v-sheet>
</template>

<style scoped>
.g-sheet {
  background-color: transparent;
}

.g-card {
  background: linear-gradient(67deg, #07361C 7.82%, #28673C 75.59%);
  max-width: 100%;
  width: 413px;
  color: #F0F0F0;
}

.g-title {
  font-weight: bold;
  font-size: clamp(18px, 3.6dvh, 22px);
  padding-top: clamp(12px, 3.4dvh, 24px);
  line-height: clamp(28px, 4.2dvh, 29px);
}

.g-text {
  font-weight: 400;
  font-size: clamp(16px, 3dvh, 20px);
  line-height: clamp(27px, 3.5dvh, 28px);
  padding-bottom: clamp(30px, 2.2dvh, 30px);
}

.g-points {
  font-family: IBM Plex Sans;
  line-height: normal;
  font-size: clamp(28px, 5dvh, 32px);
  padding-top: clamp(6px, 2dvh, 30px);
  padding-bottom: clamp(8px, 2.4dvh, 32px);
}

.g-form {
  padding-top: 0px;
  padding-bottom: 0px;
}

.g-tfield {
  max-width: 100%;
}

:deep(.v-messages) {
  font-size: clamp(12px, 1.6dvh, 16px);
  padding-top: 3px;
  padding-bottom: 1px
}

:deep(.v-field__input) {
  min-height: clamp(30px, 2dvh, 60px);
  padding-top: 14px;
}

:deep(.v-field) {
  font-size: clamp(12px, 2dvh, 16px);
}

.g-bt {
  font-size: clamp(16px, 2.3dvh, 18px);
  width: 183px;
  max-width: 100%;
  line-height: normal;
  margin-top: clamp(16px, 2.4dvh, 32px);

}

:deep(.v-btn--variant-tonal .v-btn__underlay) {
  opacity: 0.4;
  background-color: white;
}

:deep(.v-btn.v-btn--density-default) {
  height: clamp(32px, 6.4dvh, 44px);
}

.g-terms {
  font-size: clamp(12px, 1dvh, 16px);
  opacity: 1;
  margin-top: clamp(8px, 1.6dvh, 10px);
}

:deep(.g-terms .v-label) {
  font-size: clamp(12px, 1.6dvh, 16px);
}

.g-terms-l-def {
  text-align: left;
}

.g-terms-l-rtl {
  text-align: right;
}

:deep(.v-selection-control__input > .v-icon) {
  opacity: 1;
}

:deep(.v-selection-control) {
  align-items: start;
}

:deep(.v-selection-control__wrapper) {
  align-items: start;
}

:deep(.v-selection-control__input) {
  align-items: start;
}

:deep(.v-messages__message) {
  color: #F0F0F0;
  opacity: 0.6;
  line-height: 15px;
}

.g-ripple {
  align-items: start;
}

.g-try {
  background-color: transparent;
  position: absolute;
  z-index: 90;
  max-width: 100%;
  bottom: clamp(34px, 5dvh, 40px);
}

.g-try-l-def {
  right: 38px;
}

.g-try-l-rtl {
  left: 38px;
}

.g-try-bt {
  font-family: Saudia Sans;
  line-height: normal;
  font-size: 18px;
  text-transform: uppercase;
  color: #28673C;
  background-color: white;
  width: 183px;
}

:deep(.v-selection-control__input:hover::before) {
  opacity: 0.0;
}

:deep(.v-btn__content) {
  padding-top: 2px;
}

:deep(.v-input--density-default .v-field--variant-solo .v-label.v-field-label--floating) {
  top: 3px;
  font-size: 10px;
}

@media (max-width: 599px) {
  .g-points {
    padding-top: 16px !important;
    padding-bottom: 18px !important;
    font-size: 34px;
  }

  .g-try {
    position: relative;
    bottom: auto;
    right: auto;
    text-align: center;
    margin: 20px auto 50px auto;
  }

  .g-try-l-rtl {
    left: auto;
  }
}

@media (max-width: 449px) {
  .g-card {
    width: 380px;
  }
}

@media (max-width: 399px) {
  .g-card {
    width: 320px;
  }

  .g-points {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .g-text {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .g-form {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
}

@media (min-width: 2560px) {
  .g-card {
    width: 513px;
  }

  .g-title {
    font-size: 32px;
  }

  .g-text {
    font-size: 30px;
  }

  .g-points {
    font-size: clamp(34px, 5.2dvh, 54px);
    padding-top: clamp(28px, 3dvh, 40px);
    padding-bottom: clamp(28px, 3dvh, 40px);
  }

  :deep(.v-field__input) {
    min-height: clamp(50px, 5dvh, 70px);
  }

  :deep(.v-field) {
    font-size: 18px;
  }

  :deep(.v-messages) {
    font-size: 18px;
  }

  .g-bt {
    font-size: 22px;
    width: 223px;
    margin-top: clamp(16px, 3dvh, 36px);
  }

  :deep(.v-btn.v-btn--density-default) {
    height: 54px;
  }

  .g-try-bt {
    font-size: 22px;
    width: 213px;
  }
}
</style>