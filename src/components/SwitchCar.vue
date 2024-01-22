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

const cardStore = useCardsStore();
const { cardIndex } = storeToRefs(cardStore);
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
    console.log(currentCar);
    currentCar.value--;
    if (currentCar.value < 1) {
        currentCar.value = 3;
    }
}

</script>

<template>
    <v-sheet v-if="show && !xs" class="g-switch-car" :class="{ 'g-switch-def': !isRtl, 'g-switch-rtl': isRtl }">
        <v-slide-y-reverse-transition @after-leave="onAfterLeave" group>
            <div v-if="expand" class="g-title">
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
    left: 38px;
}

.g-switch-rtl {
    right: 38px;
}

.g-title {
    font-size: 48px;
    font-weight: 700;
}

@media (min-width: 2560px) {
    .g-switch-car {
        bottom: 70px;
    }

    .g-switch-def {
        left: 50px;
    }

    .g-switch-rtl {
        right: 50px;
    }
}
</style>