<script setup>
import { onMounted, onUnmounted, ref, computed, watch, provide } from 'vue';
import { PerspectiveCamera, Scene, WebGLRenderer, Vector3, DirectionalLight, LoadingManager, EquirectangularReflectionMapping, CubeTextureLoader, SRGBColorSpace, CineonToneMapping, LightProbe, WebGLCubeRenderTarget, CubeCamera, Fog } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { LightProbeGenerator } from 'three/addons/lights/LightProbeGenerator.js';
import { gsap } from 'gsap';
import { useQuizStore } from '/src/stores/QuizStore';
import { useCardsStore } from '/src/stores/CardsStore';
import { useLoadingStore } from '/src/stores/LoadingStore';
import { useGraphicsStore } from '/src/stores/GraphicsStore';
import { useCameraStore } from '/src/stores/CameraStore';
import UIHint from './UIHint.vue';
import { storeToRefs } from 'pinia';

import raceTrackGLB from '/models/RaceTrack.glb?url';
import gen3GLB from '/models/Gen3.glb?url';
import gen2GLB from '/models/Gen2.glb?url';
import gen1GLB from '/models/Gen1.glb?url';
import raceTrackHDR from '/textures/RaceTrack.hdr?url';
import pxTexture from '/textures/px.jpg';
import nxTexture from '/textures/nx.jpg';
import pyTexture from '/textures/py.jpg';
import nyTexture from '/textures/ny.jpg';
import pzTexture from '/textures/pz.jpg';
import nzTexture from '/textures/nz.jpg';

// get stores
const quizStore = useQuizStore();
const { shouldCameraMove, question, iniPosMove } = storeToRefs(quizStore);
const loadingStore = useLoadingStore();
const { loadStart, loadComplete, loadError, loadProgress, errorUrl } = storeToRefs(loadingStore);
const cardsStore = useCardsStore();
const { cardIndex } = storeToRefs(cardsStore);
const graphicsStore = useGraphicsStore();
const { directionalLightIntensity, directionalLightColor, ambientLightIntensity, ambientLightColor, lightProbeIntensity, backgroundIntensity, backgroundBlurriness, fogColor, fogNear, fogFar, toneMapping, toneMappingExposure } = storeToRefs(graphicsStore);
const cameraStore = useCameraStore();
const { cameraTargetX, cameraTargetY, cameraTargetZ, currentCar } = storeToRefs(cameraStore);

// global variables
const webGl = ref();
provide("webGlCanvas", webGl);
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);
const aspectRatio = computed(() => {
  return windowWidth.value / windowHeight.value;
});
const shouldBlur = ref(false);

let camera;
let renderer;
let scene;
let controls;

// Graphic elements
let directionalLight;
// let ambientLight;
let lightProbe;

// Graphic properties
// Lighting
directionalLightIntensity.value = 15 // Directional light intensity
directionalLightColor.value = 0xFEBF71 // Directional light color 0xFEBF71 0xF0AC59 0xFFCF9D 0xFFCB82 0xFFD894
ambientLightIntensity.value = 0 // Ambient light intensity
ambientLightColor.value = 0x000000 // Ambient light color
lightProbeIntensity.value = 0.6 // Light probe intensity
// Environment
backgroundIntensity.value = 1.05 // Background intensity
backgroundBlurriness.value = 0 // Background blur
// Fog
fogColor.value = 0xFFE9C2 // Fog color 0xFFEBC2
fogNear.value = 0 // Fog near treshold
fogFar.value = 400 // Fog far treshold
// Renderer
toneMapping.value = CineonToneMapping // Tone mapping type
toneMappingExposure.value = 1.1 // Tone mapping exposure

// Camera Coordinates
cameraTargetX.value = 0;
cameraTargetY.value = 0;
cameraTargetZ.value = 0;

// create loaders
const manager = new LoadingManager();
const gltfLoader = new GLTFLoader(manager); // cars
const dracoLoader = new DRACOLoader(manager); // cars
const rgbeLoader = new RGBELoader(manager); // environment map (.HDR)
const cubeTextureLoader = new CubeTextureLoader(manager); // environment map (cubemaps)

// setup draco decoder module
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.preload();
gltfLoader.setDRACOLoader(dracoLoader);

// set camera positions
const initialPos = ref(new Vector3(-3.6, 1.4, 5.5)); // on intial screen
const initialTarget = ref(new Vector3(0, 0.46, 0.35)); // on intial screen

// Loader manager functions
manager.onStart = function (item, loaded, total) {
  // console.log('Loading started');
  loadStart.value = true;
};

manager.onLoad = function () {
  // console.log('Loading complete');   
  loadComplete.value = true;
};

manager.onProgress = function (item, loaded, total) {
  // console.log(item, loaded, total);
  // console.log('Loaded:', Math.round(loaded / total * 100, 2) + '%')
  loadProgress.value = Math.round(loaded / total * 100, 2);
};

manager.onError = function (url) {
  // console.log('Error loading');
  errorUrl.value = url;
  loadError.value = true;
};

watch(cardIndex, () => {
  if (cardIndex.value >= 11) {
    shouldBlur.value = true;
  } else {
    shouldBlur.value = false;
  }
});

// Start scene
const setCanvas = () => {
  // Create Scene
  scene = new Scene();

  // Create a cube camera render target for light probe
  const cubeRenderTarget = new WebGLCubeRenderTarget(256);
  const cubeCamera = new CubeCamera(1, 1000, cubeRenderTarget);

  // Create light probe
  lightProbe = new LightProbe();
  scene.add(lightProbe);

  // Create LDR equirretangular background
  cubeTextureLoader.load([
    pxTexture,
    nxTexture,
    pyTexture,
    nyTexture,
    pzTexture,
    nzTexture,
  ], (backgroundMap) => {
    scene.background = backgroundMap;
    scene.backgroundIntensity = backgroundIntensity.value;
    scene.backgroundBlurriness = backgroundBlurriness.value;
  });

  // Race Track (with Draco)
  gltfLoader.load(raceTrackGLB, function (gltf) {
    const raceTrackObj = gltf.scene;
    scene.add(raceTrackObj);
  }, undefined, function (error) {
    console.error('raceTrackObj gltfLoader error' + error);
  });

  // Car 1 (with Draco)
  gltfLoader.load(gen3GLB, function (gltf) {
    const car1Obj = gltf.scene;
    scene.add(car1Obj);
  }, undefined, function (error) {
    console.error('car1 gltfLoader error' + error);
  });

  // Car 2 (with Draco)
  gltfLoader.load(gen2GLB, function (gltf) {
    const car2Obj = gltf.scene;
    scene.add(car2Obj);
  }, undefined, function (error) {
    console.error('car2 gltfLoader error' + error);
  });

  // Car 3 (with Draco)
  gltfLoader.load(gen1GLB, function (gltf) {
    const car3Obj = gltf.scene;
    scene.add(car3Obj);
  }, undefined, function (error) {
    console.error('car3 gltfLoader error' + error);
  });

  // Lights
  // Ambient Light
  // ambientLight = new AmbientLight(ambientLightColor.value, ambientLightIntensity.value); // soft white light
  // scene.add(ambientLight);

  // Directional Light
  directionalLight = new DirectionalLight(directionalLightColor.value, directionalLightIntensity.value); // 0xF09D59 0xF0AC59
  directionalLight.position.set(20, 20, 20);
  scene.add(directionalLight);

  // Fog
  const fog = new Fog(fogColor.value, fogNear.value, fogFar.value);
  scene.fog = fog;

  // Camera
  camera = new PerspectiveCamera(45, aspectRatio.value, 0.1, 300);
  camera.position.copy(initialPos.value);
  scene.add(camera);
  updateCamera();

  // Renderer
  const canvas = webGl.value;
  renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = toneMapping.value; // https://threejs.org/docs/#api/en/constants/Renderer
  renderer.toneMappingExposure = toneMappingExposure.value;
  updateRenderer();

  // Create HDR equirretangular environment map
  rgbeLoader.load(raceTrackHDR, (environmentMap) => {
    //Adding the environment map to the scene
    environmentMap.mapping = EquirectangularReflectionMapping
    // scene.background = environmentMap;
    scene.environment = environmentMap;

    // Rendering the cube camera render target and applying it to the light probe
    cubeCamera.update(renderer, scene);
    lightProbe.copy(LightProbeGenerator.fromCubeRenderTarget(renderer, cubeRenderTarget));
    lightProbe.intensity = lightProbeIntensity.value;
  });

  // Controls
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = -0.4;
  // Controls limit
  controls.minDistance = 3.5;
  controls.maxDistance = 7;
  controls.maxPolarAngle = (Math.PI / 2) - 0.01;
  //controls.maxAzimuthAngle = (Math.PI/2); // radians
  controls.enablePan = false;

  controls.target.copy(initialTarget.value);
  controls.update();
};

const updateCamera = () => {
  camera.aspect = aspectRatio.value;
  camera.updateProjectionMatrix();
};

const updateRenderer = () => {
  renderer.setSize(windowWidth.value, windowHeight.value);
  renderer.render(scene, camera);
};

const cameraMovement = (toPos, toTarget) => {
  controls.enabled = false;
  gsap.to(camera.position, {
    x: toPos.x,
    y: toPos.y,
    z: toPos.z,
    duration: 1,
    ease: 'power1.inOut',
    onUpdate: function () {
    },
    onComplete: function () {
      controls.enabled = true;
    }
  });
  gsap.to(controls.target, {
    x: toTarget.x,
    y: toTarget.y,
    z: toTarget.z,
    duration: 1,
    ease: 'power1.inOut',
    onUpdate: function () {
    },
    onComplete: function () {
    }
  })
};

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  windowHeight.value = window.innerHeight;
  updateCamera();
  updateRenderer();
};

const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

watch(shouldCameraMove, () => {
  if (shouldCameraMove.value) {
    if (iniPosMove.value) {
      switch (currentCar.value) {
        case 3:
          initialPos.value = new Vector3(-3.6, 1.4, 5.5);
          initialTarget.value = new Vector3(0, 0.46, 0.35);
          break;
        case 2:
          initialPos.value = new Vector3(1.33, 1.4, -1.9);
          initialTarget.value = new Vector3(6.0, 0.46, -7.0);
          break;
        case 1:
          initialPos.value = new Vector3(-3.6, 1.4, -8.5);
          initialTarget.value = new Vector3(0, 0.46, -14.5);
          break;
        default:
          initialPos.value = new Vector3(-3.6, 1.4, 5.5);
          initialTarget.value = new Vector3(0, 0.46, 0.35);
          break;
      }
      cameraMovement(initialPos.value, initialTarget.value);
      controls.minDistance = 3.5;
      controls.maxDistance = 7;
      controls.autoRotateSpeed = -0.4;
    } else {
      let pos = new Vector3(...question.value.camPosition);
      let tar = new Vector3(...question.value.camTarget)
      cameraMovement(pos, tar);
      controls.maxDistance = question.value.ctrlMaxDist;
      controls.minDistance = question.value.ctrlMinDist;
      controls.autoRotateSpeed = question.value.ctrlRotateSpeed;
    }
    shouldCameraMove.value = false;
  }
});

// Watching Graphic Properties
// Lighting
watch(directionalLightIntensity, () => {
  directionalLight.intensity = directionalLightIntensity.value;
});

watch(directionalLightColor, () => {
  directionalLight.color.setHex(directionalLightColor.value);
});

watch(ambientLightIntensity, () => {
  // ambientLight.intensity = ambientLightIntensity.value;
});

watch(ambientLightColor, () => {
  // ambientLight.color.setHex(ambientLightColor.value);
});

watch(lightProbeIntensity, () => {
  lightProbe.intensity = lightProbeIntensity.value;
});

// Environment
watch(backgroundIntensity, () => {
  scene.backgroundIntensity = backgroundIntensity.value;
});

watch(backgroundBlurriness, () => {
  scene.backgroundBlurriness = backgroundBlurriness.value;
});

// Fog
watch(fogColor, () => {
  scene.fog.color.setHex(fogColor.value);
});

watch(fogNear, () => {
  scene.fog.near = fogNear.value;
});

watch(fogFar, () => {
  scene.fog.far = fogFar.value;
});

// Renderer
watch(toneMapping, () => {
  switch (toneMapping.value) {
    case "NoToneMapping":
      // renderer.toneMapping = NoToneMapping;
      break;
    case "LinearToneMapping":
      // renderer.toneMapping = LinearToneMapping;
      break;
    case "ReinhardToneMapping":
      // renderer.toneMapping = ReinhardToneMapping;
      break;
    case "CineonToneMapping":
      renderer.toneMapping = CineonToneMapping;
      break;
    case "ACESFilmicToneMapping":
      // renderer.toneMapping = ACESFilmicToneMapping;
      break;
    case "CustomToneMapping":
      // renderer.toneMapping = CustomToneMapping;
      break;
    default:
      renderer.toneMapping = CineonToneMapping;
  }
  updateRenderer();
});

watch(toneMappingExposure, () => {
  renderer.toneMappingExposure = toneMappingExposure.value;
});

// Camera Coordinates
watch(cameraTargetX, () => {
  controls.target.x = cameraTargetX.value;
});

watch(cameraTargetY, () => {
  controls.target.y = cameraTargetY.value;
});

watch(cameraTargetZ, () => {
  controls.target.z = cameraTargetZ.value;
});

// Press "B" to print camera and target positions
function handleKeyDown(event) {
  if (event.keyCode === 66) { //66 is "b"
    window.isBDown = true;
    console.log("Camera X: " + camera.position.x);
    console.log("Camera Y: " + camera.position.y);
    console.log("Camera Z: " + camera.position.z);
    console.log("Target X: " + controls.target.x);
    console.log("Target Y: " + controls.target.y);
    console.log("Target Z: " + controls.target.z);
  }
}

function handleKeyUp(event) {
  if (event.keyCode === 66) {
    window.isBDown = false;
  }
}

window.addEventListener('keydown', handleKeyDown, false);
window.addEventListener('keyup', handleKeyUp, false);

onMounted(() => {
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  setCanvas();
  animate();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('orientationchange', handleResize);
})

</script>

<template>
  <canvas ref="webGl" class="webGl" :class="{ blur: shouldBlur }" />
  <UIHint />
</template>

<style scoped>
.webGl {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 0;
  transition: 0.5s filter linear;
  -webkit-transition: 0.5s -webkit-filter linear;
  -moz-transition: 0.5s -moz-filter linear;
  -ms-transition: 0.5s -ms-filter linear;
  -o-transition: 0.5s -o-filter linear;
}

.blur {
  -webkit-filter: blur(20px);
  -moz-filter: blur(20px);
  -o-filter: blur(20px);
  -ms-filter: blur(20px);
  filter: blur(20px);
  pointer-events: none;
  transition: 0.5s filter linear;
  -webkit-transition: 0.5s -webkit-filter linear;
  -moz-transition: 0.5s -moz-filter linear;
  -ms-transition: 0.5s -ms-filter linear;
  -o-transition: 0.5s -o-filter linear;
}
</style>
