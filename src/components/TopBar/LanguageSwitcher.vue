<script setup>
  const languages = [
    'lang1',
		'lang2',
		'lang3',
  ]

	const defaultSelected = ['lang1']
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
    class="g-lang mt-5"
    transition="scroll-y-transition"
  >
    <template v-slot:prepend-inner>
      <v-icon icon="mdi-chevron-down" class="g-icon"></v-icon>
    </template>    
  </v-select>
</template>

<style scoped>
.g-lang {
	color: white !important;
  pointer-events: auto;
}
.v-select--active-menu .g-icon {
  transform: rotate(180deg);
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.v-select .g-icon {
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>