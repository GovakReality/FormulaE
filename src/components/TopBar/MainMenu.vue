<script setup>

  const menuItems = [
    { title: 'Click Me' },
    { title: 'Click Me' },
    { title: 'Click Me' },
    { title: 'Click Me 2' },
  ]
</script>
<template>
  <v-menu transition="scroll-y-transition">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-menu" v-bind="props" color="white" class="g-bt-menu"></v-btn>
    </template>
  
    <v-list>
      <v-list-item
        v-for="(item, i) in menuItems"
        :key="i"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>


<style scoped>
.g-bt-menu {
	background-color: #cccccc42 !important;
}
</style>