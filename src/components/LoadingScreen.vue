<script setup>
  import { ref, watch } from 'vue';
  import { useLoadingStore } from '../stores/LoadingStore';
  import { storeToRefs } from 'pinia';

  const loadingStore = useLoadingStore();
  const { loadStart, loadComplete, loadError, loadProgress } = storeToRefs(loadingStore);
  const isShow = ref(true);

  watch(loadComplete, (val) => {
    if (loadComplete.value) {
      //setTimeout(() => isShow.value = false, 2500);
      isShow.value = false;
    }
  });

</script>

<template>
  <div v-show="isShow" class="container">
    <div class="wrapper">
        <div class="loader" id="loader">
            loading...
        </div>
    </div>
  </div>   
</template>

<style scoped>
.container {
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
  overflow: hidden;
  z-index: 100;
  background-color: aliceblue;  
}
.wrapper { 
	display: flex; 
	justify-content: center;
	align-items: center;
	height: 100%;
} 
</style>