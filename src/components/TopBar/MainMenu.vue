<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuizStore } from '/src/stores/QuizStore';
import { storeToRefs } from 'pinia';

const { t } = useI18n();
const quizStore = useQuizStore();
const { eventMode } = storeToRefs(quizStore);

const menuItems = ref([
  {
    title: computed(() => t('menu.termsAndConditions')),
    href: computed(() => t('menu.termsUrl')),
  },
  {
    title: computed(() => t('menu.privacyPolicy')),
    href: computed(() => t('menu.privacyUrl')),
  }
]);

const toggleEventMode = (event) => {
  eventMode.value = !eventMode.value;
};

const eventBtnText = computed(() => {
  if (eventMode.value) {
    return t('menu.eventModeOn');
  } else {
    return t('menu.eventModeOff');
  }
});
</script>
<template>
  <v-menu transition="scroll-y-transition">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-menu" v-bind="props" size="large" color="white" class="g-bt-menu"></v-btn>
    </template>

    <v-list class="mt-2 text-center" item-type="link">
      <v-list-item>
        <v-list-item-title class="g-menu-item" @click="toggleEventMode">{{ eventBtnText }}</v-list-item-title>
      </v-list-item>
      <v-list-item v-for="(item, i) in menuItems" :key="i" :value="item" :href="item.href" link target="_blank">
        <v-list-item-title class="g-menu-item">{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>


<style scoped>
.g-bt-menu {
  pointer-events: auto;
  background-color: #cccccc42 !important;
}

@media (min-width: 2560px) {
  .g-bt-menu {
    font-size: 18px;
    height: 64px !important;
    width: 64px !important;
  }

  .g-menu-item {
    font-size: 30px;
    padding: 20px 40px;
  }
}
</style>