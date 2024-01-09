<script setup>
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n();

  const menuItems = ref([
    { title:  computed(() => t('menu.admin'))},
    { title:  computed(() => t('menu.about'))}
  ]);
</script>
<template>
  <v-menu transition="scroll-y-transition">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-menu" v-bind="props" size="large" color="white" class="g-bt-menu"></v-btn>
    </template>
  
    <v-list class="mt-2 text-center">
      <v-list-item
        v-for="(item, i) in menuItems"
        :key="i"
        :value="item"
      >
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