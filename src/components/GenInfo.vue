<script setup>
  import { useCardsStore } from '/src/stores/CardsStore';
  import { useLoadingStore } from '/src/stores/LoadingStore';
  import { storeToRefs } from 'pinia';
  import { ref, watch, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n();

  const cardStore = useCardsStore();
  const { cardIndex } = storeToRefs(cardStore);
  const loadingStore = useLoadingStore();
  const { loadStart, loadComplete, loadError, loadProgress } = storeToRefs(loadingStore);

  const expand = ref(false);
  const show = ref(false);

  const gens = [
    {
      title: 'GEN 3',
      subtitle: '2023 - ' + t('geninfo.present'),
    },
    {
      title: 'GEN 2',
      subtitle: '2018 - 2022',
    },
    {
      title: 'GEN 1',
      subtitle: '2014 - 2017',
    }
  ];

  let actualGen = ref(gens[0]);
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
    } else if (cardIndex.value == 5) {
      expand.value = false;
      actualGen.value = gens[1];
    } else if (cardIndex.value == 8) {
      expand.value = false;
      actualGen.value = gens[2];
    } else if (cardIndex.value == 11) {
      expand.value = false;
      shouldExpand.value = false;
      actualGen.value = gens[0];
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
  <v-sheet v-if="show" class="g-geninfo">
    <v-slide-y-reverse-transition @after-leave="onAfterLeave" group>
      <div v-if="expand" class="g-title">
        {{actualGen.title}}
      </div>
      <div v-if="expand" class="g-subtitle">
        {{actualGen.subtitle}}
      </div>
    </v-slide-y-reverse-transition>
  </v-sheet>  
</template>

<style scoped>
.g-geninfo {
  background-color: transparent;
  position: absolute;
  z-index: 90;
  max-width: 100%;
  bottom: 33px;
  left: 38px;
  pointer-events: none;
  font-family: Saudia Sans;
  line-height: normal;
  text-transform: uppercase;
  color: white;    
}
.g-title {
  font-size: 42px;
  font-weight: 700;
}
.g-subtitle {
  font-size: 21px;
  font-weight: 400;
}
</style>