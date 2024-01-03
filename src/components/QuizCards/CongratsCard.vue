<script setup>
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useQuizStore } from '/src/stores/QuizStore';
  import { useAPIStore } from '/src/stores/APIStore';
  import { ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import saudiaLogo from '/images/SaudiaLogo.png';
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n();

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
          return t('rules.name.format')
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
  <v-sheet v-if="show" class="d-flex align-center justify-center h-100 pa-10">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave">
      <v-card
      v-if="expand"
      class="g-card py-5 pe-2 rounded-xl"
      variant="flat"
      >
        <v-card-item class="text-center">
          <v-img
          :src="saudiaLogo"
          width="138"
          class="text-center justify-center mx-auto"
          ></v-img>
          <h3 class="g-title font-weight-bold pt-8">
            {{ $t("congrats.title") }}
          </h3>
          <h3 class="g-title font-weight-bold pt-2">
            {{ $t("congrats.subtitle") }}
          </h3>          
          <div class="g-points font-weight-bold pb-7 pt-6 px-5 py-xxl-10">
            {{scoreFixed}} {{ $t("global.pts") }}
          </div>          
          <div class="g-text pb-6 px-7 px-xxl-11">
            {{ $t("congrats.text") }}
          </div>    
          <v-form @submit.prevent="submit" class="px-6 pt-4 pt-xxl-6" v-model="isFormValid">
            <v-text-field
              v-model="fullName"
              :label="$t('global.fullname')"
              :rules="fullNameRules"
              variant="solo"
              rounded="lg"
              bg-color="white"
              class="g-tfield mb-xxl-8"
              required
            ></v-text-field>
      
            <v-text-field
              v-model="email"
              :label="$t('global.email')"
              type="email"
              :rules="emailRules"
              variant="solo"
              rounded="lg"
              bg-color="white"
              class="g-tfield my-4 mb-xxl-8"
              required
            ></v-text-field>
      
            <v-checkbox
              v-model="terms"
              :rules="termsRules"
              :center-affix=false
              color="white"
              false-icon="mdi-checkbox-blank"
              hide-details
              class="g-terms"
              :ripple="false"
              :label="$t('congrats.terms')"
            ></v-checkbox>

            <v-btn :loading="loading" type="submit" rounded="xl" variant="tonal" :slim="false" :disabled="!isFormValid" class="g-bt font-weight-black mb-2 mt-8 mt-xxl-10">{{ $t("global.continue") }}</v-btn>
          </v-form>                 
        </v-card-item>
        <v-snackbar
          v-model="showError"
          multi-line
          color="error"
          elevation="16"
          timeout="10000"
          >
          {{ errorMsg }}
          <template v-slot:actions>
            <v-btn
              color="white"
              variant="text"
              @click="showError = !showError"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-card>     
    </v-slide-y-reverse-transition>
  </v-sheet>
  <v-sheet v-if="show" class="g-try">
    <v-slide-y-reverse-transition >
      <v-btn v-if="expand" rounded="xl" variant="tonal" :slim="false" @click="tryAgainClick" class="g-try-bt font-weight-black">
        {{ $t("global.tryagain") }}
      </v-btn>
    </v-slide-y-reverse-transition>        
  </v-sheet>  
</template>

<style scoped>
.g-card{
  background: linear-gradient(67deg, #07361C 7.82%, #28673C 75.59%);
  max-width: 100%;
  width: 413px;
  color: #F0F0F0;
}
.g-title {
  font-size: 26px;
  line-height: normal;
}

.g-text {
  font-family: Saudia Sans;
  line-height: 34px;
  font-weight: 400;
  font-size: 24px;
}
.g-points {
  font-family: IBM Plex Sans;
  line-height: normal;
  font-size: 44px;
}
.g-tfield {
  max-width: 100%;
}
:deep(.v-messages) {
  font-size: 15px;
  padding-top: 3px;
  padding-bottom: 1px 
}
:deep(.v-field__input ) {
  min-height: 60px;
}

.g-bt {
  font-size: 18px;
  width: 183px;
  max-width: 100%;
  line-height: normal;
}

:deep(.v-btn--variant-tonal .v-btn__underlay) {
  opacity: 0.4;
  background-color: white;
}

:deep(.v-btn.v-btn--density-default) {
  height: 46px;
}
.g-terms {
  opacity: 1;
  text-align: left;
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
  bottom: 56px;
  right: 38px;
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

@media (max-width: 599px) {
  .g-try {
    bottom: 40px;
    right: 40px;
  }   
}

@media (min-width: 2560px) {
  .g-card{
    width: 513px;
  }
  .g-title {
    font-size: 32px;
  }
  .g-text {
    font-size: 30px;
  }
  .g-points {
    font-size: 54px;
  }
  :deep(.v-messages) {
    font-size: 18px;
  }
  .g-bt {
    font-size: 22px;
    width: 223px;
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