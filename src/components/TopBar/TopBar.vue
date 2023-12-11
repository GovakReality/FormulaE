<script setup>
	import LanguageSwitcher from './LanguageSwitcher.vue';
	import MainMenu from './MainMenu.vue';
</script>

<template>
	<v-app-bar flat color="transparent">
		<template v-slot:prepend>
			<v-img
			src="/textures/logoipsum-321.svg"
			height="40"
			width="300"
			contain
			></v-img>
		</template>

		<template v-slot:append>
			<LanguageSwitcher />
			<MainMenu />
		</template>
	</v-app-bar>
</template>

<style scoped>
</style>