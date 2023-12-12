<script setup>
  import { usePositionStore } from '/src/stores/PositionStore';
  import { ref } from 'vue';

  const positionStore = usePositionStore();
  const expand = ref(true);

  const onClick = (event) => {
    expand.value = false;
    positionStore.increment();
  };
</script>

<template>
  <v-sheet class="d-flex align-end justify-end h-100 pa-10">
    <v-slide-y-reverse-transition>
      <v-card
      v-if="expand"
      class="g-card py-5 pe-2 rounded-xl"
      color="teal-darken-4"
      variant="elevated"
      >
        <v-card-item class="text-center">
          <v-img
          src="/textures/logoipsum-321.svg"
          width="200"
          class="text-center justify-center mx-auto"
          ></v-img>
          <div class="text-h6 mb-1 pa-6">
            Take a quiz now and grab your chance to win exclusive prizes!
          </div>
        </v-card-item>
        <v-card-actions class="text-center justify-center">
          <v-btn rounded="lg" variant="tonal" @click="onClick">
            Start Quiz
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-slide-y-reverse-transition>
  </v-sheet>
</template>

<style scoped>
.g-card{
  background: linear-gradient(45deg, rgba(7,55,29,1) 0%, rgba(2,101,54,1) 100%);
  max-width: 100%;
  width: 400px;
}
</style>