<script setup>
	import LanguageSwitcher from './LanguageSwitcher.vue';
	import MainMenu from './MainMenu.vue';
  import Lockup from '../Lockup.vue';
</script>

<template>
	<v-app-bar flat color="transparent" class="pt-sm-5 pr-sm-5 g-bar">
		<template v-slot:prepend>
			<Lockup />
		</template>		
		<template v-slot:append>
			<LanguageSwitcher />
			<MainMenu />
		</template>
	</v-app-bar>
</template>

<style scoped>
.g-bar {
	pointer-events: none;
}
</style>