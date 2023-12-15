<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue';
import { PerspectiveCamera, Scene, WebGLRenderer, Mesh, BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, Vector3, PlaneGeometry, DoubleSide, SphereGeometry, TextureLoader, DirectionalLight, LoadingManager, AmbientLight, EquirectangularReflectionMapping, CubeTextureLoader, SRGBColorSpace, NoToneMapping, LinearToneMapping, ReinhardToneMapping, CineonToneMapping, ACESFilmicToneMapping, CustomToneMapping, LightProbe, WebGLCubeRenderTarget, CubeCamera, Color, Fog } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { LightProbeGenerator } from 'three/addons/lights/LightProbeGenerator.js';
// import { LightProbeHelper } from 'three/addons/helpers/LightProbeHelper.js';
import { gsap } from 'gsap';
import { usePositionStore } from '/src/stores/PositionStore';
import { useLoadingStore } from '/src/stores/LoadingStore';
import { useGraphicsStore } from '/src/stores/GraphicsStore';
import { useCameraStore } from '/src/stores/CameraStore';
import { storeToRefs } from 'pinia';

// get stores
const positionStore = usePositionStore();
const { positionIndex } = storeToRefs(positionStore);
const loadingStore = useLoadingStore();
const { loadStart, loadComplete, loadError, loadProgress } = storeToRefs(loadingStore);
const graphicsStore = useGraphicsStore();
const { directionalLightIntensity, directionalLightColor, ambientLightIntensity, ambientLightColor, lightProbeIntensity, backgroundIntensity, backgroundBlurriness, fogColor, fogNear, fogFar, toneMapping, toneMappingExposure } = storeToRefs(graphicsStore);
const cameraStore = useCameraStore();
const { cameraPosX, cameraPosY, cameraPosZ, cameraTargetX, cameraTargetY, cameraTargetZ } = storeToRefs(cameraStore);

// global variables
const webGl = ref();
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);
const aspectRatio = computed(() => {
  return windowWidth.value / windowHeight.value;
});

let camera;
let renderer;
let scene;
let controls;

// Graphic elements
let directionalLight;
let ambientLight;
let lightProbe;

// Graphic properties
// Lighting
directionalLightIntensity.value = 13 // Directional light intensity
directionalLightColor.value = 0xFEBF71 // Directional light color 0xF0AC59
ambientLightIntensity.value = 0 // Ambient light intensity
ambientLightColor.value = 0x000000 // Ambient light color
lightProbeIntensity.value = 0.3 // Light probe intensity
// Environment
backgroundIntensity.value = 1.05 // Background intensity
backgroundBlurriness.value = 0 // Background blur
// Fog
fogColor.value = 0xFFE9C2 // Fog color 0xFFEBC2
fogNear.value = 10 // Fog near treshold
fogFar.value = 435 // Fog far treshold
// Renderer
toneMapping.value = CineonToneMapping // Tone mapping type
toneMappingExposure.value = 1 // Tone mapping exposure

// Camera Coordinates
cameraPosX.value = 0;
cameraPosY.value = 0;
cameraPosZ.value = 0;
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

// set positions
const raceTrackPos = new Vector3(0, 0, 0);

const car1Pos = new Vector3(0, 0, 0);
const car2Pos = new Vector3(5, 0, -5);
const car3Pos = new Vector3(0, 0, -10);

const initialPos = new Vector3(-3.6, 1.4, 5.5); // on intial screen
const initialTarget = new Vector3(0, 0.46, 0.35); // on intial screen

// car 1 points
const car1Pos1 = new Vector3(2.34, 0.38, 3.51);
const car1Target1 = new Vector3(1, 0.3, 1.6);
const car1Pos2 = new Vector3(-0.60, 0.94, 1.43);
const car1Target2 = new Vector3(0, 0.8, 0.4);
const car1Pos3 = new Vector3(-2.39, 0.57, -5.02);
const car1Target3 = new Vector3(-0.32, 0.16, -1.79);

// car 2 points
const car2Pos1 = new Vector3(2.75, 1.86, -2.72);
const car2Target1 = new Vector3(6.9, 0.36, -7.69);
const car2Pos2 = new Vector3(10.2, 1.69, -2.10);
const car2Target2 = new Vector3(6.9, 0.36, -7.69);
const car2Pos3 = new Vector3(5.3, 1.6, -14);
const car2Target3 = new Vector3(6.9, 0.36, -7.69);

// car 3 points
const car3Pos1 = new Vector3(2.68, 1.8, -8.6);
const car3Target1 = new Vector3(0, 0.36, -14.9);
const car3Pos2 = new Vector3(-6.7, 1.87, -14.94);
const car3Target2 = new Vector3(0, 0.36, -14.9);
const car3Pos3 = new Vector3(4.8, 3.0, -19.10);
const car3Target3 = new Vector3(0, 0.36, -14.9);

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
  loadError.value = true;
};

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
    '/textures/px.jpg',
    '/textures/nx.jpg',
    '/textures/py.jpg',
    '/textures/ny.jpg',
    '/textures/pz.jpg',
    '/textures/nz.jpg',
  ], (backgroundMap) => {
    scene.background = backgroundMap;
    scene.backgroundIntensity = backgroundIntensity.value;
    scene.backgroundBlurriness = backgroundBlurriness.value;
  });

  // Race Track (with Draco)
  gltfLoader.load('/models/RaceTrack.glb', function (gltf) {
    const raceTrackObj = gltf.scene;
    raceTrackObj.position.copy(raceTrackPos);
    scene.add(raceTrackObj);
  }, undefined, function (error) {
    console.error('raceTrackObj gltfLoader error' + error);
  });

  // Car 1 (with Draco)
  gltfLoader.load('/models/Gen3.glb', function (gltf) {
    const car1Obj = gltf.scene;
    car1Obj.position.copy(car1Pos);
    scene.add(car1Obj);
  }, undefined, function (error) {
    console.error('car1 gltfLoader error' + error);
  });

  // Car 2 (with Draco)
  gltfLoader.load('/models/Gen3Placeholder-1.glb', function (gltf) {
    const car2Obj = gltf.scene;
    car2Obj.position.copy(car1Pos);
    scene.add(car2Obj);
  }, undefined, function (error) {
    console.error('car2 gltfLoader error' + error);
  });

  // Car 3 (with Draco)
  gltfLoader.load('/models/Gen3Placeholder-2.glb', function (gltf) {
    const car3Obj = gltf.scene;
    car3Obj.position.copy(car1Pos);
    scene.add(car3Obj);
  }, undefined, function (error) {
    console.error('car3 gltfLoader error' + error);
  });

  // Lights
  // Ambient Light
  ambientLight = new AmbientLight(ambientLightColor.value, ambientLightIntensity.value); // soft white light
  scene.add(ambientLight);

  // Directional Light
  directionalLight = new DirectionalLight(directionalLightColor.value, directionalLightIntensity.value); // 0xF09D59 0xF0AC59
  directionalLight.position.set(20, 20, 20);
  scene.add(directionalLight);

  // Fog
  const fog = new Fog(fogColor.value, fogNear.value, fogFar.value);
  scene.fog = fog;

  // Camera
  camera = new PerspectiveCamera(45, aspectRatio.value, 0.1, 300);
  camera.position.copy(initialPos);
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
  rgbeLoader.load('/textures/RaceTrack.hdr', (environmentMap) => {
    //Adding the environment map to the scene
    environmentMap.mapping = EquirectangularReflectionMapping
    // scene.background = environmentMap;
    scene.environment = environmentMap;

    // Rendering the cube camera render target and applying it to the light probe
    cubeCamera.update(renderer, scene);
    lightProbe.copy(LightProbeGenerator.fromCubeRenderTarget(renderer, cubeRenderTarget));
    lightProbe.intensity = lightProbeIntensity.value;
    // scene.add(new LightProbeHelper(lightProbe, 5));
  });

  // Controls
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  // Controls limit
  controls.minDistance = 3.5;
  controls.maxDistance = 7;
  controls.maxPolarAngle = (Math.PI / 2) - 0.01;
  //controls.maxAzimuthAngle = (Math.PI/2); // radians
  controls.enablePan = false;

  controls.target.copy(initialTarget);
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

watch(positionIndex, () => {
  switch (positionIndex.value) {
    case 0:
      cameraMovement(initialPos, initialTarget);
      controls.minDistance = 3.5;
      break;
    case 1:
      cameraMovement(car1Pos1, car1Target1);
      controls.minDistance = 1.2;
      break;
    case 2:
      cameraMovement(car1Pos2, car1Target2);
      controls.minDistance = 1.2;
      break;
    case 3:
      cameraMovement(car1Pos3, car1Target3);
      controls.minDistance = 1.2;
      break;
    case 4:
      cameraMovement(car2Pos1, car2Target1);
      controls.minDistance = 3.5;
      break;
    case 5:
      cameraMovement(car2Pos2, car2Target2);
      controls.minDistance = 3.5;
      break;
    case 6:
      cameraMovement(car2Pos3, car2Target3);
      controls.minDistance = 3.5;
      break;
    case 7:
      cameraMovement(car3Pos1, car3Target1);
      controls.minDistance = 3.5;
      break;
    case 8:
      cameraMovement(car3Pos2, car3Target2);
      controls.minDistance = 3.5;
      break;
    case 9:
      cameraMovement(car3Pos3, car3Target3);
      controls.minDistance = 3.5;
      break;
    default:
      positionStore.reset();
      console.log('no way');
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
  ambientLight.intensity = ambientLightIntensity.value;
});

watch(ambientLightColor, () => {
  ambientLight.color.setHex(ambientLightColor.value);
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
      renderer.toneMapping = NoToneMapping;
      break;
    case "LinearToneMapping":
      renderer.toneMapping = LinearToneMapping;
      break;
    case "ReinhardToneMapping":
      renderer.toneMapping = ReinhardToneMapping;
      break;
    case "CineonToneMapping":
      renderer.toneMapping = CineonToneMapping;
      break;
    case "ACESFilmicToneMapping":
      renderer.toneMapping = ACESFilmicToneMapping;
      break;
    case "CustomToneMapping":
      renderer.toneMapping = CustomToneMapping;
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
watch(cameraPosX, () => {
  camera.position.x = cameraPosX.value;
});

watch(cameraPosY, () => {
  camera.position.y = cameraPosY.value;
});

watch(cameraPosZ, () => {
  camera.position.z = cameraPosZ.value;
});

watch(cameraTargetX, () => {
  controls.target.x = cameraTargetX.value;
});

watch(cameraTargetY, () => {
  controls.target.y = cameraTargetY.value;
});

watch(cameraTargetZ, () => {
  controls.target.z = cameraTargetZ.value;
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  setCanvas();
  animate();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
})

</script>

<template>
  <canvas ref="webGl" class="webGl" />
</template>

<style scoped>
.webGl {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 0;
}
</style>
