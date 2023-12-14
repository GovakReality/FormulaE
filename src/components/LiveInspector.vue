<script setup>
import { useGraphicsStore } from '/src/stores/GraphicsStore';
import { storeToRefs } from 'pinia';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const graphicsStore = useGraphicsStore();
const { directionalLightIntensity, directionalLightColor, ambientLightIntensity, ambientLightColor, lightProbeIntensity, backgroundIntensity, backgroundBlurriness, fogColor, fogNear, fogFar } = storeToRefs(graphicsStore);

// gui
const gui = new GUI({ title: 'Graphics Properties' });

// rendering and lighting constants
const API = {
    directionalLightIntensity: directionalLightIntensity.value,
    directionalLightColor: directionalLightColor.value,
    ambientLightIntensity: ambientLightIntensity.value,
    ambientLightColor: ambientLightColor.value,
    lightProbeIntensity: lightProbeIntensity.value,
    backgroundIntensity: backgroundIntensity.value,
    backgroundBlurriness: backgroundBlurriness.value,
    fogColor: fogColor.value,
    fogNear: fogNear.value,
    fogFar: fogFar.value,
};

// Lighting
const folder1 = gui.addFolder('Lighting');

folder1.add(API, 'directionalLightIntensity', 0, 100, 0.02)
    .name('Directional Light Intensity')
    .onChange(function () {
        directionalLightIntensity.value = API.directionalLightIntensity;
    });

folder1.addColor(API, 'directionalLightColor')
    .name('Directional Light Color')
    .onChange(function () {
        directionalLightColor.value = API.directionalLightColor;
    });

folder1.add(API, 'ambientLightIntensity', 0, 100, 0.02)
    .name('Ambient Light Intensity')
    .onChange(function () {
        ambientLightIntensity.value = API.ambientLightIntensity;
    });

folder1.addColor(API, 'ambientLightColor')
    .name('Ambient Light Color')
    .onChange(function () {
        ambientLightColor.value = API.ambientLightColor;
    });

folder1.add(API, 'lightProbeIntensity', 0, 20, 0.02)
    .name('Light Probe Intensity')
    .onChange(function () {
        lightProbeIntensity.value = API.lightProbeIntensity;
    });

// Environment
const folder2 = gui.addFolder('Environment');

folder2.add(API, 'backgroundIntensity', 0, 1, 0.02)
    .name('Background Intensity')
    .onChange(function () {
        backgroundIntensity.value = API.backgroundIntensity;
    });

folder2.add(API, 'backgroundBlurriness', 0, 1, 0.02)
    .name('Background Blurriness')
    .onChange(function () {
        backgroundBlurriness.value = API.backgroundBlurriness;
    });

// Fog
const folder3 = gui.addFolder('Fog');

folder3.addColor(API, 'fogColor')
    .name('Fog Color')
    .onChange(function () {
        fogColor.value = API.fogColor;
    });

folder3.add(API, 'fogNear', 0, 1000, 0.02)
    .name('Fog Near Treshold')
    .onChange(function () {
        fogNear.value = API.fogNear;
    });

folder3.add(API, 'fogFar', 0, 1000, 0.02)
    .name('Fog Far Treshold')
    .onChange(function () {
        fogFar.value = API.fogFar;
    });

// Forcing GUI Z-Index
const guiElement = document.querySelector('.lil-gui');
guiElement.style.zIndex = "1100";

</script>