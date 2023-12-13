<script setup>
	import LanguageSwitcher from './LanguageSwitcher.vue';
	import MainMenu from './MainMenu.vue';
</script>

<template>
	<v-app-bar flat color="transparent" class="pt-1 g-bar">
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