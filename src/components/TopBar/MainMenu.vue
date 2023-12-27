<script setup>
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n();

  const menuItems = [
    { title:  t('menu.admin') },
    { title:  t('menu.about') },
  ]
</script>
<template>
  <v-menu transition="scroll-y-transition">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-menu" v-bind="props" size="large" color="white" class="g-bt-menu"></v-btn>
    </template>
  
    <v-list width="150" class="mt-2 text-center">
      <v-list-item
        v-for="(item, i) in menuItems"
        :key="i"
        :value="item"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>     
    </v-list>
  </v-menu>
</template>


<style scoped>
.g-bt-menu {
  pointer-events: auto;
	background-color: #cccccc42 !important;
}
</style>