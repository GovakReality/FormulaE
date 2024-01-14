<script setup>
import { useCardsStore } from '/src/stores/CardsStore';
import { useLoadingStore } from '/src/stores/LoadingStore';
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

const expand = ref(false);
const show = ref(false);



const gens = ref([
  {
    title: 'GEN3',
    subtitle: computed(() => t('geninfo.gen3Year')),
  },
  {
    title: 'GEN2',
    subtitle: computed(() => t('geninfo.gen2Year')),
  },
  {
    title: 'GEN1',
    subtitle: computed(() => t('geninfo.gen1Year')),
  }
]);

let actualGen = ref(gens.value[0]);
let shouldExpand = ref(true);

watch(loadComplete, (val) => {
  if (loadComplete.value) {
    expand.value = true;
  }
});

watch(cardIndex, () => {
  if (cardIndex.value == 0) {
    shouldExpand.value = true;
    expand.value = true;
    actualGen.value = gens.value[0];
  } else if (cardIndex.value == 5) {
    expand.value = false;
    actualGen.value = gens.value[1];
  } else if (cardIndex.value == 8) {
    expand.value = false;
    actualGen.value = gens.value[2];
  } else if (cardIndex.value == 11) {
    expand.value = false;
    shouldExpand.value = false;
    actualGen.value = gens.value[0];
  }
});

const onAfterLeave = (el) => {
  if (shouldExpand.value) expand.value = true
}

onMounted(() => {
  show.value = true;
});


</script>

<template>
  <v-sheet v-if="show && !xs" class="g-geninfo" :class="{ 'g-lang-def': !isRtl, 'g-lang-rtl': isRtl }">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave" group>
      <div v-if="expand" class="g-title">
        {{ actualGen.title }}
      </div>
      <div v-if="expand" class="g-subtitle">
        {{ actualGen.subtitle }}
      </div>
    </v-slide-y-reverse-transition>
  </v-sheet>
</template>

<style scoped>
.g-geninfo {
  background-color: transparent;
  position: absolute;
  z-index: 20;
  max-width: 100%;
  bottom: 33px;
  pointer-events: none;
  font-family: Saudia Sans;
  line-height: 44px;
  text-transform: uppercase;
  color: white;
}

.g-lang-def {
  left: 38px;
}

.g-lang-rtl {
  right: 38px;
}

.g-title {
  font-size: 48px;
  font-weight: 700;
}

.g-subtitle {
  font-size: 26px;
  font-weight: 400;
}

@media (min-width: 2560px) {
  .g-geninfo {
    bottom: 40px;
  }

  .g-lang-def {
    left: 50px;
  }

  .g-lang-rtl {
    right: 50px;
  }

  .g-title {
    font-size: 64px;
  }

  .g-subtitle {
    font-size: 34px;
  }
}
</style>