<script setup>
  const languages = [
    'English',
		'lang2',
		'lang3',
  ]

	const defaultSelected = ['English']
</script>
<template>
  <v-select
    rounded="sm"
    bg-color="transparent"
    item-color="green"
    variant="solo"
    flat
    :items="languages"
    v-model="defaultSelected"			
    menu-icon=""
    class="g-lang mt-6 text-center"
    transition="scroll-y-transition"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props"></v-list-item>
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
  font-size: 24px;
  font-weight: 700;
  width: 130px;
}
.v-select--active-menu .g-icon {
  transform: rotate(180deg);
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.v-select .g-icon {
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>