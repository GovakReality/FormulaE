<script setup>
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useQuizStore } from '/src/stores/QuizStore';
  import { ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';

  const cardsStore = useCardsStore();
  const { cardIndex } = storeToRefs(cardsStore);
  const quizStore = useQuizStore();

  const expand = ref(false);
  const show = ref(false);

  const terms = ref(false);
  const fullName = ref('');
  const email = ref('');
  const fullNameRules = [
    value => {
      if (value) return true
      return 'You must enter your full name.'
    },    
    value => {
      if (value?.length > 1) return true
      return 'Full name must be at least 2 characters.'
    },
  ]
  const emailRules = [
    value => {
      if (value) return true
      return 'You must enter a valid email.'
    }, 
  ]

  watch(cardIndex, () => {
    if (cardIndex.value == 11) {
      show.value = true;
      setTimeout(() => expand.value = true, 100);
    } else {
      expand.value = false;
    }
  });

  async function submit (event) {
    event.preventDefault();
    console.log('submit')
    expand.value = false;
  }  

  const onAfterLeave = (el) => {
    show.value = false;
    cardsStore.incrementCardIndex();
  }    
</script>

<template>
  <v-sheet v-if="show" class="d-flex align-center justify-center h-100 pa-10">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave">
      <v-card
      v-if="expand"
      class="g-card py-5 pe-2 rounded-xl"
      variant="elevated"
      >
        <v-card-item class="text-center">
          <v-img
          src="/images/SaudiaLogo.png"
          width="138"
          class="text-center justify-center mx-auto"
          ></v-img>
          <h3 class="g-title font-weight-bold pt-8">
            Congratulations!
          </h3>
          <h3 class="g-title font-weight-bold pt-3">
            Your score is:
          </h3>          
          <div class="g-points font-weight-bold py-10 px-5">
            64,2564 PTS
          </div>          
          <div class="g-text pb-6 px-7">
            Enter your information to win exclusive Formula E prizes and find your place on the leaderboard!
          </div>    
          <v-form @submit.prevent="submit" class="px-6 pt-4">
            <v-text-field
              v-model="fullName"
              label="Full name"
              :rules="fullNameRules"
              variant="outlined"
              rounded="lg"
              bg-color="white"
              class="g-tfield"
            ></v-text-field>
      
            <v-text-field
              v-model="email"
              label="E-mail"
              type="email"
              :rules="emailRules"
              variant="outlined"
              rounded="lg"
              bg-color="white"
              class="g-tfield my-4"
            ></v-text-field>
      
            <v-checkbox
              v-model="terms"
              :center-affix=false
              label="I am 18 years old or older, and I have read, and agreed with our  Terms & Conditions and Privacy Policy."
            ></v-checkbox>

            <v-btn type="submit" rounded="xl" variant="tonal" :slim="false" class="g-bt font-weight-black my-2">CONTINUE</v-btn>
          </v-form>                 
        </v-card-item>
      </v-card>
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
  line-height: normal;
  font-weight: 400;
  font-size: 24px;
}
.g-points {
  font-family: IBM Plex Sans;
  line-height: normal;
  font-size: 46px;
}
.g-tfield {
  max-width: 100%;
}
.g-bt {
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
</style>