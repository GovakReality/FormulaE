<script setup>
import { useCardsStore } from '/src/stores/CardsStore';
import { useLoadingStore } from '/src/stores/LoadingStore';
import { useQuizStore } from '/src/stores/QuizStore';
import { useCameraStore } from '/src/stores/CameraStore';
import { storeToRefs } from 'pinia';
import { ref, watch, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { useLocale, useDisplay } from 'vuetify';

const { t } = useI18n();
const { isRtl } = useLocale();
const { xs } = useDisplay();

const cardsStore = useCardsStore();
const { cardIndex, showHints } = storeToRefs(cardsStore);
const loadingStore = useLoadingStore();
const { loadStart, loadComplete, loadError, loadProgress } = storeToRefs(loadingStore);
const quizStore = useQuizStore();
const { shouldCameraMove } = storeToRefs(quizStore);
const cameraStore = useCameraStore();
const { currentCar } = storeToRefs(cameraStore);

const expand = ref(false);
const show = ref(false);

watch(loadComplete, (val) => {
    if (loadComplete.value) {
        expand.value = true;
    }
});

watch(cardIndex, () => {
    if (cardIndex.value == 0 || cardIndex.value == 1) {
        show.value = true;
        setTimeout(() => expand.value = true, 100);
    }
    else {
        expand.value = false;
    }
});

const onAfterLeave = (el) => {
    show.value = false;
}

onMounted(() => {
    show.value = true;
});

const CycleCar = () => {
    shouldCameraMove.value = true;
    showHints.value = false;
    // console.log(currentCar);
    currentCar.value--;
    if (currentCar.value < 1) {
        currentCar.value = 3;
    }
}

</script>

<template>
    <v-sheet v-if="(show && !xs) || (show && xs && cardIndex == 0)" class="g-switch-car"
        :class="{ 'g-switch-def': !isRtl, 'g-switch-rtl': isRtl }">
        <v-slide-y-reverse-transition @after-leave="onAfterLeave" group>
            <div v-if="expand" class="g-title">
                <v-sheet class="g-hint-wrapper">
                    <v-fade-transition>
                        <div v-if="showHints" class="g-hint-text" :class="{ 'g-hint-def': !isRtl, 'g-hint-rtl': isRtl }">{{
                            $t("global.exploreMore") }}</div>
                    </v-fade-transition>
                </v-sheet>
                <v-btn icon="mdi-chevron-left" variant="flat" color="#28673C" size="x-large" class="g-switch-btn"
                    @click="CycleCar"></v-btn>
            </div>
        </v-slide-y-reverse-transition>
    </v-sheet>
</template>

<style scoped>
.g-switch-car {
    background-color: transparent;
    position: absolute;
    z-index: 20;
    max-width: 100%;
    top: 50%;
    transform: translateY(-50%);
    height: fit-content;
    font-family: Saudia Sans;
    line-height: 44px;
    text-transform: uppercase;
    color: white;
}

.g-switch-btn {
    font-size: 30px;
}

.g-switch-def {
    left: 50px;
    transform: rotate(0deg);
}

.g-switch-rtl {
    right: 50px;
    transform: rotate(180deg);
}

.g-hint-wrapper {
    display: block;
    background-color: transparent;
    position: absolute;
    text-transform: capitalize;
    /* width: max-content; */
    white-space: nowrap;
    text-align: center;
}

.g-hint-def {
    margin-top: 76px;
    margin-left: -50px;
}

.g-hint-rtl {
    margin-top: -40px;
    margin-right: -54px;
}

.g-hint-text {
    font-weight: 700;
    font-size: clamp(14px, 3dvh, 17px);
    line-height: clamp(27px, 3.5dvh, 28px);
    padding-bottom: 4px;
    padding-left: 28px;
    padding-right: 28px;
    color: white;
    text-shadow: 1px 1px 0 #28673c34, -1px 1px 0 #28673c34, -1px -1px 0 #28673c34, 1px -1px 0 #28673c34;
    opacity: 0.75;
}

@media (max-width: 599px) {
    .g-hint-wrapper {
        display: none;
    }

    .g-switch-car {
        z-index: 20;
        max-width: 100%;
        top: 43%;
        transform: translateY(-50%);
        height: fit-content;
        font-family: Saudia Sans;
        line-height: 44px;
    }

    .g-switch-btn {
        font-size: 20px;
        height: 46px !important;
        width: 46px !important;
    }

    .g-switch-def {
        right: 20px !important;
        transform: rotate(180deg);
    }

    .g-switch-rtl {
        right: 20px !important;
        transform: rotate(180deg);
    }
}

@media (min-width: 2560px) {
    .g-switch-btn {
        font-size: 46px;
        height: 86px !important;
        width: 86px !important;
    }

    .g-switch-car {
        bottom: 70px;
    }

    .g-switch-def {
        left: 75px;
    }

    .g-switch-rtl {
        right: 75px;
    }

    .g-hint-def {
        margin-top: 76px;
        margin-left: -55px;
        line-height: 80px;
    }

    .g-hint-rtl {
        margin-top: -40px;
        margin-right: -60px;
        line-height: 0px;
    }

    .g-hint-text {
        font-size: 26px;

        padding-bottom: 4px;
        padding-left: 15px;
        padding-right: 15px;
    }

}
</style>