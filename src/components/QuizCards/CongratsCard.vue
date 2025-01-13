<script setup>
import { useCardsStore } from '/src/stores/CardsStore';
import { useQuizStore } from '/src/stores/QuizStore';
import { useAPIStore } from '/src/stores/APIStore';
import { useCameraStore } from '/src/stores/CameraStore';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import saudiaLogo from '/images/SaudiaLogo.svg';
import { useI18n } from 'vue-i18n';
import { useLocale, useDisplay } from 'vuetify';

const { t } = useI18n();
const { isRtl } = useLocale();
const { xs } = useDisplay();

const cardsStore = useCardsStore();
const { cardIndex } = storeToRefs(cardsStore);
const quizStore = useQuizStore();
const { fullName, email, score, terms, terms2, scoreFixed } = storeToRefs(quizStore);
const APIStore = useAPIStore();
const { APIStatus } = storeToRefs(APIStore);
const cameraStore = useCameraStore();

const expand = ref(false);
const show = ref(false);
const shouldReset = ref(false);
const loading = ref(false);
const showError = ref(false);
const errorMsg = ref('');

const isFormValid = ref(false);

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
  if (cardIndex.value == 14) {
    shouldReset.value = false;
    show.value = true;
    setTimeout(() => expand.value = true, 100);
  } else if (cardIndex.value == 0) {
    show.value = false;
    expand.value = false;
  } else {
    expand.value = false;
  }
});

const submit = async (event) => {
  loading.value = true;
  if (isFormValid) {
    APIStore.sendPlayer({
      score: score.value,
      full_name: fullName.value,
      email: email.value,
      consent: terms2.value,
    })
    //APIStatus.value = 1; //remove
  }
};

watch(APIStatus, () => {
  if (APIStatus.value == 1) {
    loading.value = false;
    expand.value = false;
  } else if (APIStatus.value > 1) {
    errorMsg.value = t('system.error') + ' ' + APIStatus.value + ': ' + t('system.wait');
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
    cameraStore.reset();
    APIStore.reset();
  } else {
    cardsStore.incrementCardIndex();
  }
};
</script>

<template>
  <v-sheet v-if="show" class="d-flex flex-column align-center justify-center h-100">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave" group>
      <v-sheet v-if="expand" class="g-sheet" position="relative" color="transparent">
        <v-card class="g-card py-4 rounded-xl" variant="flat">
          <v-card-item class="text-center">
            <v-img v-if="!xs" :src="saudiaLogo" width="128" class="text-center justify-center mx-auto"></v-img>
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

              <v-checkbox v-model="terms" :rules="termsRules" :center-affix="false" color="white"
                false-icon="mdi-checkbox-blank" hide-details class="g-terms"
                :class="{ 'g-terms-l-def': !isRtl, 'g-terms-l-rtl': isRtl }" :ripple="false">
                <template v-slot:label>
                  <i18n-t keypath="congrats.terms" tag="span" scope="global">
                    <template v-slot:urlTermsAndConditions>
                      <a :href="$t('menu.termsUrl')" class="g-terms-links" target="_blank">{{
                        $t('menu.termsAndConditions') }}</a>
                    </template>
                    <template v-slot:urlPrivacyPolicy>
                      <a :href="$t('menu.privacyUrl')" class="g-terms-links" target="_blank">{{ $t('menu.privacyPolicy')
                        }}</a>
                    </template>
                  </i18n-t>
                </template>
              </v-checkbox>

              <v-checkbox v-model="terms2" :center-affix="false" color="white" false-icon="mdi-checkbox-blank"
                hide-details class="g-terms" :class="{ 'g-terms-l-def': !isRtl, 'g-terms-l-rtl': isRtl }"
                :ripple="false">
                <template v-slot:label>
                  <i18n-t keypath="congrats.terms2" tag="span" scope="global">
                    <template v-slot:urlPrivacyPolicy>
                      <a :href="$t('menu.privacyUrl')" class="g-terms-links" target="_blank">{{ $t('menu.privacyPolicy')
                        }}</a>
                    </template>
                  </i18n-t>
                </template>
              </v-checkbox>
              <v-btn :loading="loading" type="submit" rounded="xl" variant="tonal" :slim="false"
                :disabled="!isFormValid" class="g-bt font-weight-black mb-2">{{ $t("global.continue") }}</v-btn>
            </v-form>
          </v-card-item>
          <v-snackbar v-model="showError" multi-line color="error" elevation="16" timeout="10000">
            {{ errorMsg }}
            <template v-slot:actions>
              <v-btn color="white" variant="text" @click="showError = !showError">
                {{ $t("global.close") }}
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
  width: 515px;
  color: #F0F0F0;
}

.g-title {
  font-weight: bold;
  font-size: clamp(18px, 3.6dvh, 22px);
  padding-top: clamp(12px, 3.4dvh, 18px);
  line-height: clamp(25px, 4.2dvh, 25px);
}

.g-text {
  font-weight: 400;
  font-size: clamp(16px, 3dvh, 17px);
  line-height: clamp(27px, 3.5dvh, 28px);
  padding-bottom: clamp(20px, 2.2dvh, 20px);
}

.g-points {
  font-family: IBM Plex Sans;
  line-height: normal;
  font-size: clamp(28px, 5dvh, 32px);
  padding-top: clamp(6px, 1.5dvh, 20px);
  padding-bottom: clamp(8px, 1.8dvh, 24px);
}

.g-form {
  padding-top: 0px;
  padding-bottom: 0px;
}

.g-tfield {
  max-width: 100%;
}

:deep(.v-messages) {
  font-size: clamp(10px, 1.5dvh, 16px);
  padding-top: 3px;
  padding-bottom: 1px;
}

:deep(.v-input__details) {
  padding-top: 2px;
  align-items: start;
}

:deep(.v-field__input) {
  min-height: clamp(30px, 2dvh, 60px);
  padding-top: 14px;
}

:deep(.v-field) {
  font-size: clamp(12px, 1.5dvh, 16px);
}

.g-bt {
  font-size: clamp(15px, 2.3dvh, 18px);
  width: 183px;
  max-width: 100%;
  line-height: normal;
  margin-top: clamp(14px, 2.4dvh, 32px);
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
  align-items: start;

}

:deep(.v-checkbox .v-selection-control) {
  min-height: auto;
}

.g-terms-l-def {
  text-align: left;
}

.g-terms-l-rtl {
  text-align: right;
}

.g-terms-links {
  color: white;
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
  line-height: 14px;
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
  text-transform: uppercase;
  color: #28673C;
  background-color: white;
  width: 183px;
  font-size: clamp(15px, 2.3dvh, 18px);
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
  .g-card {
    width: 440px;
    padding-top: 0px !important;
    padding-bottom: 2px !important;
  }

  .g-title {
    font-size: clamp(17px, 3dvh, 17px);
    line-height: 20px;
    padding-top: 11px;
    padding-bottom: 0px;
  }

  .g-text {
    padding-left: 12px;
    padding-right: 12px;
    font-size: clamp(15px, 3dvh, 15px);
    line-height: 22px;
    padding-top: 5px;
    padding-bottom: 10px;
  }

  .g-points {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    font-size: 22px;
  }

  :deep(.g-terms .v-label) {
    font-size: clamp(11px, 1.6dvh, 11px);
    align-items: start;
    margin-top: clamp(0px, 1.6dvh, 0px);
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
    width: 400px;
  }
}

@media (max-width: 399px) {
  .g-card {
    width: 370px;
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
    line-height: 36px;
  }

  .g-text {
    font-size: 26px;
    line-height: 36px;
  }

  .g-points {
    font-size: clamp(34px, 5.2dvh, 46px);
    padding-top: clamp(18px, 3dvh, 28px);
    padding-bottom: clamp(18px, 3dvh, 28px);
  }

  :deep(.v-field__input) {
    min-height: clamp(50px, 5dvh, 55px);
  }

  :deep(.v-field) {
    font-size: 16px;
  }

  :deep(.v-messages) {
    font-size: 16px;
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