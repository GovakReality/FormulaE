<script setup>
import LanguageSwitcher from './LanguageSwitcher.vue';
import MainMenu from './MainMenu.vue';
import Lockup from './Lockup.vue';
</script>

<template>
	<v-app-bar flat class="py-sm-5 px-sm-5 g-bar">
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
.v-app-bar.v-toolbar {
	background: #28673c !important;
	background: linear-gradient(180deg, rgba(49, 49, 49, 0.6) 0%, rgba(49, 49, 49, 0.1) 75%, rgba(49, 49, 49, 0) 100%) !important;
}

.g-bar {
	pointer-events: none;
}

@media (max-width: 599px) {
	:deep(.v-toolbar__content) {
		height: 80px !important;
	}
}

@media (min-width: 2560px) {
	:deep(.v-toolbar__content) {
		height: 100px !important;
	}
}
</style>