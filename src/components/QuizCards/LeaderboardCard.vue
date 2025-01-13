<script setup>
import { useCardsStore } from '/src/stores/CardsStore';
import { useQuizStore } from '/src/stores/QuizStore';
import { useAPIStore } from '/src/stores/APIStore';
import { useCameraStore } from '/src/stores/CameraStore';
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useLocale, useDisplay } from 'vuetify';
import { useI18n } from 'vue-i18n';
import saudiaLogo from '/images/SaudiaLogo.svg';

const { isRtl } = useLocale();
const { xs } = useDisplay();
const { t } = useI18n();
const cardsStore = useCardsStore();
const { cardIndex } = storeToRefs(cardsStore);
const quizStore = useQuizStore();
const { fullName, email, score, scoreFixed, place, scorePlace, scorePlaceFixed } = storeToRefs(quizStore);
const APIStore = useAPIStore();
const cameraStore = useCameraStore();

const expand = ref(false);
const show = ref(false);
const formattedPlayers = ref([]);

const { players } = storeToRefs(APIStore);
/* const players = ref([
  {
    full_name: 'JORDAN Mitchell',
    score: '82546',
  },
  {
    full_name: 'Heather Reynolds',
    score: '80317',
  },
  {
    full_name: 'Wesley Anderson',
    score: '78367',
  },
  {
    full_name: 'Natalie Chambers',
    score: '72382',
  },
  {
    full_name: 'Victor Ramirez',
    score: '70111',
  },
  {
    full_name: 'Chloe Bennett',
    score: '56777',
  }
]); */

watch(cardIndex, () => {
  if (cardIndex.value == 16) {
    show.value = true;
    formatLeaderboard();
    setTimeout(() => expand.value = true, 100);
  } else if (cardIndex.value == 0) {
    expand.value = false;
    show.value = false;
  } else {
    expand.value = false;
  }
});

const formatLeaderboard = () => {
  formattedPlayers.value = [];

  players.value.forEach((item, index) => {
    if (index < 10) {
      if (index == place.value) {
        item = { ...item, 'current': true };
      }
      if (index < 1) {
        item = { ...item, 'finalist': true };
      }
      item = { ...item, 'scoreFixed': (item.score / 1000).toFixed(3).replace(".", ",") };
      formattedPlayers.value.push(item);
    }
  });
  let blank = 10 - formattedPlayers.value.length;
  if (blank > 0) {
    for (let i = 0; i < blank; i++) {
      formattedPlayers.value.push('');
    }
  }
};

const placeComp = computed(() => {
  return place.value + 1;
});

const conditionalTextComp = computed(() => {
  if (scorePlace.value == score.value) {
    return t('leaderboard.placeHintEqualOrGreater');
  } else {
    return t('leaderboard.placeHintWorse');
  }
});

/*   const playersFinalists = computed(() => {
    return players.value.map((el, index) => {
      return index < 3 ? {...el, finalist: true} : {...el};
    });
  });

  const playersChecked = computed(() => {
    return playersFinalists.value.map((el, index) => {
      return index == currentIndex.value ? {...el, current: true} : {...el};
    });
  }); */

const onClick = (event) => {
  expand.value = false;
};

const onAfterLeave = (el) => {
  show.value = false;
  cardsStore.reset();
  quizStore.reset();
  cameraStore.reset();
  APIStore.reset();
}

</script>

<template>
  <v-sheet v-if="show" class="d-flex flex-column flex-sm-column flex-md-row align-center justify-center h-100">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave" group>
      <v-sheet v-if="expand" class="g-sheet" position="relative" color="transparent">
        <v-sheet class="d-flex flex-column justify-center g-card"
          :class="{ 'g-card-l-def': !isRtl, 'g-card-l-rtl': isRtl }" variant="flat" color="transparent">
          <v-sheet class="text-center" color="transparent">
            <div class="g-wrapper">
              <v-img v-if="!xs" :src="saudiaLogo" width="128" class="text-center justify-center mx-auto g-img"></v-img>

              <h3 class="g-title">
                {{ $t("leaderboard.title") }}
              </h3>

              <div class="g-place">
                {{ placeComp }}<small>{{ $t("leaderboard.placeSuffix") }}</small>
              </div>

              <div class="g-points px-5">
                <small>{{ $t("leaderboard.beforeScore") }}</small>{{ scorePlaceFixed }} {{ $t("global.pts") }}
              </div>

              <h3 class="g-text px-8">
                {{ conditionalTextComp }}
              </h3>

              <div class="g-text2 px-8">
                {{ $t("leaderboard.text") }}
              </div>

            </div>
          </v-sheet>
          <v-sheet class="text-center justify-center mt-auto d-none d-sm-none d-md-flex" color="transparent">
            <v-btn rounded="xl" color="#f0f0f0" variant="tonal" :slim="false" @click="onClick"
              class="g-bt font-weight-black mb-2">
              {{ $t("global.tryagain") }}
            </v-btn>
          </v-sheet>
        </v-sheet>
      </v-sheet>
      <v-sheet v-if="expand" class="g-sheet g-sheet-l" position="relative" color="transparent">
        <v-card variant="flat" class="g-names-list rounded-0" color="transparent">
          <v-table class="g-table">
            <tbody>
              <tr v-for="(item, index) in formattedPlayers" :key="item.full_name" class="py-4">
                <td class="g-pos px-1" :class="{ current: item.current, 'g-pos-l-def': !isRtl, 'g-pos-l-rtl': isRtl }">
                  <span v-if="item.full_name">{{ index + 1 }}</span>
                </td>
                <td class="g-name" :class="{ current: item.current, 'g-name-l-def': !isRtl, 'g-name-l-rtl': isRtl }">
                  {{ item.full_name }}
                  <span v-if="item.finalist" class="g-flag"
                    :class="{ 'g-flag-l-def': !isRtl, 'g-flag-l-rtl': isRtl }"></span>
                </td>
                <td class="g-score" :class="{ current: item.current }">{{ item.scoreFixed }} <span v-if="item.score">{{
                  $t("global.pts") }}</span></td>
                <td v-if="item.finalist" class="g-final px-0 d-none d-sm-none d-md-inline">
                  <div class="py-2">{{ $t("leaderboard.finalist") }}</div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
        <v-sheet class="text-center justify-center mt-auto d-flex d-sm-flex d-md-none" color="transparent">
          <v-btn rounded="xl" color="#f0f0f0" variant="tonal" :slim="false" @click="onClick"
            class="g-bt font-weight-black mt-5 mb-10">
            {{ $t("global.tryagain") }}
          </v-btn>
        </v-sheet>
      </v-sheet>
    </v-slide-y-reverse-transition>
  </v-sheet>
</template>

<style scoped>
.g-sheet {
  background-color: transparent;
}

.g-card {
  color: #F0F0F0;
  background: linear-gradient(68deg, #07361C 9.84%, #28673C 76.17%);
  max-width: 100%;
  width: 413px;
  height: clamp(450px, 65dvh, 480px);
  padding-top: 32px;
  padding-bottom: 28px;
}

.g-card-l-def {
  border-top-left-radius: 24px !important;
  border-bottom-left-radius: 24px !important;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.g-card-l-rtl {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  border-top-right-radius: 24px !important;
  border-bottom-right-radius: 24px !important;
}

.g-wrapper {
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
  font-size: clamp(17px, 3dvh, 19px);
  line-height: clamp(27px, 3.5dvh, 28px);
  padding-bottom: 4px;
  padding-left: 28px;
  padding-right: 28px;
  text-wrap: balance;
}

.g-text2 {
  font-family: Saudia Sans;
  line-height: 1.4em;
  font-weight: 400;
  font-size: clamp(12px, 3dvh, 14px);
  padding-top: clamp(18px, 3dvh, 36px);
  margin-bottom: 10px;
  opacity: 0.4;
}

.g-place {
  font-family: IBM Plex Sans;
  line-height: normal;
  font-size: clamp(30px, 5dvh, 36px);
  padding-top: clamp(4px, 1.5dvh, 8px);
  font-weight: 700;
}

.g-place small {
  font-size: clamp(28px, 5dvh, 32px);
  font-family: 'Saudia Sans';
  font-weight: 700;
}

.g-points {
  font-weight: bold;
  font-family: IBM Plex Sans;
  line-height: normal;
  font-size: clamp(17px, 4dvh, 21px);
  padding-bottom: clamp(14px, 2.4dvh, 38px);
  opacity: 0.35;
}

.g-points small {
  font-size: 85%;
  padding-right: 1px;
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
}

:deep(.v-btn.v-btn--density-default) {
  height: clamp(32px, 6.4dvh, 44px);
}

.g-table {
  background-color: transparent;
}

.g-table table td {
  border: none !important;
}

.g-names-list {
  max-width: 100%;
  width: 642px;
  height: clamp(450px, 65dvh, 480px);
}

:deep(.v-table--density-default > .v-table__wrapper > table > tbody > tr > td, .v-table--density-default > .v-table__wrapper > table > thead > tr > td, .v-table--density-default > .v-table__wrapper > table > tfoot > tr > td) {
  height: clamp(45px, 6.525dvh, 48px);
}

.g-pos {
  font-size: clamp(16px, 2dvh, 18px);
  text-transform: uppercase;
  line-height: normal;
  width: 50px;
  background-color: #F0F0F0;
  color: #000000;
}

.g-pos-l-def {
  text-align: right;
}

.g-pos-l-rtl {
  text-align: left;
}

.g-name {
  font-size: clamp(16px, 2dvh, 18px);
  text-transform: uppercase;
  line-height: normal;
  text-align: left;
  font-weight: 700;
  background-color: #F0F0F0;
  color: #000000;
  position: relative;
  max-width: 310px;
  text-wrap: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: normal;
  word-wrap: break-word;
  height: 100% !important;
}

.g-name-l-def {
  text-align: left;
}

.g-name-l-rtl {
  text-align: right;
}

.g-flag {
  display: inline-block;
  background-image: url('/images/LeaderboardFlags.svg');
  background-size: 100% 100%;
  width: 17px;
  height: 100%;
  position: absolute;
  top: 0;
}

.g-flag-l-def {
  right: 0;
}

.g-flag-l-rtl {
  left: 0;
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  filter: FlipH;
  -ms-filter: "FlipH";
}

.g-score {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%), #F0F0F0;
  color: #000000;
  font-family: IBM Plex Sans;
  font-size: clamp(17px, 2dvh, 20px);
  text-transform: uppercase;
  line-height: normal;
  font-weight: 700;
  text-align: right;
  width: 152px;
}

.g-top {
  font-size: clamp(16px, 2dvh, 20px);
  text-transform: uppercase;
  line-height: normal;
  text-align: center;
  font-weight: bold;
  color: #F0F0F0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.25) 100%), #F0F0F0;
  width: 100%;
}

.g-top i {
  font-size: clamp(35px, 3.2dvh, 45px);
}

.g-lefticon-def {
  padding-right: 40px;
}

.g-lefticon-rtl {
  padding-left: 40px;
}

.g-righticon-def {
  padding-left: 40px;
}

.g-righticon-rtl {
  padding-right: 40px;
}

.g-top span {
  display: inline-block;
  vertical-align: middle;
  margin-top: 1px;
}

.current {
  color: #28673C;
}

.g-final {
  font-size: clamp(13px, 2dvh, 15px);
  line-height: normal;
  text-align: center;
  font-weight: 700;
  text-transform: uppercase;
  max-width: 100%;
  width: 90px;
  vertical-align: text-top;
}

.g-final div {
  background-color: #28673C;
  color: #F0F0F0;
  width: 100%;
  padding-left: 1px;
  padding-right: 1px;
}

:deep(.v-btn__content) {
  padding-top: 2px;
}

@media (max-width: 1089px) {
  .g-card {
    width: 358px;
  }

  .g-names-list {
    width: 542px;
  }

  .g-pos {
    font-size: clamp(14px, 2dvh, 16px);
    width: 45px;
  }

  .g-name {
    font-size: clamp(15px, 2dvh, 17px);
    max-width: 250px;
  }

  .g-score {
    font-size: clamp(16px, 2dvh, 19px);
    width: 142px;
  }

  .g-final {
    font-size: clamp(12px, 2dvh, 14px);
    width: 80px;
  }
}

@media (max-width: 959px) {
  .g-img {
    display: flex;
    right: 7px;
  }

  .g-card {
    width: 550px;
    height: auto;
    border-top-left-radius: 24px !important;
    border-bottom-left-radius: 0px !important;
    border-top-right-radius: 24px !important;
    border-bottom-right-radius: 0px !important;
    padding-top: 26px;
    padding-bottom: 20px;
  }

  .g-points {
    padding-top: 0px;
    padding-bottom: clamp(6px, 3dvh, 12px);
  }

  .g-title {
    padding-top: 10px;
    font-size: 18px;
  }

  .g-text {
    font-size: clamp(16px, 3.2dvh, 18px);
  }

  .g-text2 {
    padding-top: clamp(6px, 3dvh, 12px);
    margin-bottom: 0px;
  }

  .g-names-list {
    width: 550px;
    height: auto;
  }

  .g-pos {
    font-size: 14px;
    width: 30px;
  }

  .g-name {
    font-size: 17px;
    max-width: 250px;
  }

  .g-score {
    font-size: 17px;
    width: 120px;
  }

  :deep(.v-table--density-default > .v-table__wrapper > table > tbody > tr > td, .v-table--density-default > .v-table__wrapper > table > thead > tr > td, .v-table--density-default > .v-table__wrapper > table > tfoot > tr > td) {
    height: 42px;
    font-size: 15px;
  }

  :deep(.v-table--density-default > .v-table__wrapper) {
    border-radius: 0px 0px 15px 15px;
  }
}

@media (max-width: 599px) {
  .g-card {
    padding-top: 0px !important;
    padding-bottom: 2px !important;
  }

  .g-img {
    display: none;
  }

  .g-place {
    padding-top: 10px !important;
    padding-bottom: 0px !important;
    font-size: 26px !important;
    line-height: 24px !important;
  }

  .g-place small {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    font-size: 24px !important;
  }

  .g-points {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    font-size: 22px !important;
    display: block;
  }

  .g-title {
    padding-top: clamp(16px, 3dvh, 32px);
    display: block;
    font-size: clamp(17px, 3dvh, 17px);
    line-height: 20px;
    padding-top: 12px;
    padding-bottom: 0px;
  }

  .g-points {
    font-size: clamp(14px, 4dvh, 18px) !important;
    padding-bottom: clamp(4px, 2.4dvh, 4px) !important;
  }

  .g-points small {
    font-size: 100%;
    padding-right: 1px;
  }

  .g-text {
    padding-left: 12px;
    padding-right: 12px;
    font-size: clamp(12px, 3dvh, 14px);
    line-height: 22px;
    padding-top: 5px;
    padding-bottom: 10px;
  }

  .g-text2 {
    padding-left: 12px;
    padding-right: 12px;
    font-size: clamp(12px, 3dvh, 12px);
    line-height: 18px;
    padding-top: 0px;
    padding-bottom: 10px;
  }

  :deep(.v-table--density-default > .v-table__wrapper > table > tbody > tr > td, .v-table--density-default > .v-table__wrapper > table > thead > tr > td, .v-table--density-default > .v-table__wrapper > table > tfoot > tr > td) {
    height: 30px;
    font-size: 12px;
  }

  :deep(.v-table--density-default > .v-table__wrapper) {
    border-radius: 0px 0px 15px 15px;
  }
}

@media (max-width: 549px) {
  .g-card {
    width: auto;
    margin-left: 16px;
    margin-right: 16px;
  }

  .g-sheet-l {
    width: 100%;
  }

  .g-names-list {
    width: auto;
    margin-left: 16px;
    margin-right: 16px;
  }

  .g-pos {
    font-size: 14px;
    width: auto;
  }

  .g-name {
    font-size: 16px;
    width: auto;
    max-width: 200px;
  }

  .g-score {
    font-size: 16px;
    width: auto;
  }
}

@media (max-width: 529px) {
  .g-card {
    margin-left: 12px;
    margin-right: 12px;
  }

  .g-names-list {
    margin-left: 12px;
    margin-right: 12px;
  }

  .g-name {
    font-size: 15px;
    max-width: 180px;
  }

  .g-score {
    font-size: 14px;
    padding-left: 6px !important;
    padding-right: 12px !important;
  }

  .g-flag {
    width: 12px;
  }
}

@media (max-width: 399px) {
  .g-card {
    margin-left: 10px;
    margin-right: 10px;
  }

  .g-names-list {
    margin-left: 10px;
    margin-right: 10px;
  }

  .g-pos {
    font-size: 12px;
    padding-left: 3px !important;
    padding-right: 3px !important;
  }

  .g-name {
    font-size: 14px;
    max-width: 170px;
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .g-score {
    font-size: 13px;
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .g-flag {
    width: 10px;
  }
}

@media (min-width: 2560px) {
  .g-img {
    display: flex;
    width: 190px !important;
    right: 7px;
  }

  .g-card {
    width: 513px;
    height: 684px;
  }

  .g-title {
    font-size: 28px;
    padding-top: 42px;
    padding-bottom: 17px;
  }

  .g-text {
    font-size: 26px;
  }

  .g-text2 {
    font-size: 22px;
    line-height: 34px;
  }

  .g-place {
    font-size: 50px;
  }

  .g-points {
    font-size: 36px;
  }

  .g-place small {
    font-size: 44px;
  }

  .g-bt {
    font-size: 22px;
    width: 213px;
  }

  :deep(.v-btn.v-btn--density-default) {
    height: 56px;
  }

  .g-names-list {
    width: 780px;
    max-width: 100%;
    height: 684px;
  }

  .g-pos {
    font-size: 22px;
    width: 70px;
  }

  .g-name {
    font-size: 22px;
    max-width: 410px;
  }

  .g-score {
    font-size: 23px;
    width: 210px;
  }

  .g-top {
    font-size: 22px;
    width: 100%;
  }

  .g-top i {
    font-size: 45px;
  }

  .g-final {
    font-size: 20px;
    width: 90px;
  }

  .g-final div {
    width: 100%;
    height: 60px;
    padding-top: 20px !important;
  }

  :deep(.v-table--density-default > .v-table__wrapper > table > tbody > tr > td, .v-table--density-default > .v-table__wrapper > table > thead > tr > td, .v-table--density-default > .v-table__wrapper > table > tfoot > tr > td) {
    height: 69px;
  }
}
</style>