<script setup>
  import { onMounted, ref } from 'vue';
  import {PerspectiveCamera, Scene, WebGLRenderer, Mesh, BoxGeometry, MeshBasicMaterial} from 'three';

  const webGl = ref();

  const setCanvas = () => {
    // Create Scene
    const scene = new Scene();

    // Create Object
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new MeshBasicMaterial({color: 0xccaa22});
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    // Camera
    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 30;
    scene.add(camera);

    // Renderer
    const canvas = webGl.value;
    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);

  };

  onMounted(() => {
    setCanvas();    
  });


</script>

<template>
  <canvas ref="webGl" />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
