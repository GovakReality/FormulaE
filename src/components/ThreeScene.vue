<script setup>
  import { onMounted, ref, computed, watch } from 'vue';
  import { PerspectiveCamera, Scene, WebGLRenderer, Mesh, BoxGeometry, MeshBasicMaterial, Vector3, PlaneGeometry, DoubleSide, SphereGeometry, TextureLoader} from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  const webGl = ref();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspectRatio = computed(() => {
    return width / height;
  });

  let camera;
  let renderer;
  let scene;
  let controls;

  let car1Pos = new Vector3(0, 0, 0);
  let car2Pos = new Vector3(5, 0, -5);
  let car3Pos = new Vector3(0, 0, -10);

  const setCanvas = () => {
    // Create Scene
    scene = new Scene();

    // Create 360 sphere
    const bgGeometry = new SphereGeometry(5,60,40);
    bgGeometry.scale(10, 10, 10);
    const bgMaterial = new MeshBasicMaterial({
        map: new TextureLoader().load("/background.jpg"),
        side: DoubleSide
      });
    const bgSphere = new Mesh(bgGeometry, bgMaterial);
    scene.add(bgSphere);


    // Create floor
    const floorGeometry = new PlaneGeometry(50, 50);
    const floorMaterial = new MeshBasicMaterial({color: 0xdddddd, side: DoubleSide});
    const floor = new Mesh(floorGeometry, floorMaterial);
    floor.rotateX( - Math.PI / 2);
    scene.add(floor);

    // Create Cars
    const geometry = new BoxGeometry(1, 1, 2);

    const material1 = new MeshBasicMaterial({color: 0xccaa22});
    const car1Obj = new Mesh(geometry, material1);
    car1Obj.position.copy(car1Pos);
    scene.add(car1Obj);

    const material2 = new MeshBasicMaterial({color: 0xcc0000});
    const car2Obj = new Mesh(geometry, material2);
    car2Obj.position.copy(car2Pos);
    scene.add(car2Obj);

    const material3 = new MeshBasicMaterial({color: 0x0CCCA2});
    const car3Obj = new Mesh(geometry, material3);
    car3Obj.position.copy(car3Pos);
    scene.add(car3Obj);

    // Camera
    camera = new PerspectiveCamera(45, aspectRatio.value, 0.1, 100);
    camera.position.set(10,10,20);
    scene.add(camera);

    // Renderer
    const canvas = webGl.value;
    renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);
    renderer.render(scene, camera);

    // Controls
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.target.copy(car1Pos);
    controls.update();
  };

  const updateCamera = () => {
    camera.aspect = aspectRatio.value;
    camera.updateProjectionMatrix();
  };

  const updateRenderer = () => {
    renderer.setSize(width, height);
    renderer.render(scene, camera);
  };

/*   watch(aspectRatio, (val) => {
    if (val) {
      updateCamera();
      updateRenderer();
    }
  }); */

  const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  onMounted(() => {
    setCanvas(); 
    animate();   
  });


</script>

<template>
  <canvas ref="webGl" class="webGl" />
</template>

<style scoped>
.webGl {
  width: 100%;
}
</style>
