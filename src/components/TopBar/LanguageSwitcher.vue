<script setup>
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n'

const { t, locale, availableLocales } = useI18n()

const availableLocalesComp = computed(() => {
  return availableLocales.map(function (code, index) {
    return { title: t(`locale.${code}`), value: code };
  });
});

watch(locale, () => {
  document.querySelector("html").setAttribute("lang", locale.value)
});

</script>
<template>
  <v-select v-model="locale" :items="availableLocalesComp" item-title="title" item-value="value" rounded="sm"
    bg-color="transparent" item-color="green" variant="solo" flat menu-icon="" class="g-lang mt-6 text-center"
    transition="scroll-y-transition">
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props" class="text-center g-lang-item"></v-list-item>
    </template>
    <template v-slot:prepend-inner>
      <v-icon icon="mdi-chevron-down" class="g-icon"></v-icon>
    </template>
  </v-select>
</template>

<style scoped>
.g-lang {
  color: white !important;
  pointer-events: auto;
  font-weight: 700;
  font-size: 24px;
  padding-right: 10px;
}

.g-lang-item {
  font-size: 24px;
}

.v-select--active-menu .g-icon {
  transform: rotate(180deg);
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-select .g-icon {
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 599px) {
  .g-lang {
    padding-right: 2px;
  }
}

@media (max-width: 399px) {
  :deep(.v-field.v-field--appended) {
    padding-left: 2px;
    padding-right: 2px;
  }
}

@media (min-width: 2560px) {
  .g-lang {
    padding-right: 40px;
  }

  :deep(.v-field) {
    font-size: 26px;
  }

  :deep(.v-list-item-title) {
    font-size: 26px;
    padding: 20px 0px;
  }
}
</style>