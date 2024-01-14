<script setup>
import { useGraphicsStore } from '/src/stores/GraphicsStore';
import { useCameraStore } from '/src/stores/CameraStore';
import { storeToRefs } from 'pinia';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const graphicsStore = useGraphicsStore();
const { directionalLightIntensity, directionalLightColor, ambientLightIntensity, ambientLightColor, lightProbeIntensity, backgroundIntensity, backgroundBlurriness, fogColor, fogNear, fogFar, toneMapping, toneMappingExposure } = storeToRefs(graphicsStore);
const cameraStore = useCameraStore();
const { cameraTargetX, cameraTargetY, cameraTargetZ } = storeToRefs(cameraStore);

// Snippet to add an HDR preview sphere
// const sphere = new SphereGeometry(0.5, 128, 128);
// let material = new MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 1 });
// let mesh = new Mesh(sphere, material);
// mesh.position.set(0, 2.5, 0);
// scene.add(mesh);

// gui
const gui = new GUI({ title: 'Graphics Properties' });

const toneMappingOptions = [
    "NoToneMapping",
    "LinearToneMapping",
    "ReinhardToneMapping",
    "CineonToneMapping",
    "ACESFilmicToneMapping",
    "CustomToneMapping"
];

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
    toneMapping: toneMappingOptions[toneMapping.value],
    toneMappingExposure: toneMappingExposure.value,
    cameraTargetX: cameraTargetX.value,
    cameraTargetY: cameraTargetY.value,
    cameraTargetZ: cameraTargetZ.value,
};

// messages
const messages = {
    cameraMessage: "Press B to print positions"
}

// Lighting
const folder1 = gui.addFolder('Lighting');

folder1.add(API, 'directionalLightIntensity', 0, 20, 0.02)
    .name('Directional Light Intensity')
    .onChange(function () {
        directionalLightIntensity.value = API.directionalLightIntensity;
    });

folder1.addColor(API, 'directionalLightColor')
    .name('Directional Light Color')
    .onChange(function () {
        directionalLightColor.value = API.directionalLightColor;
    });

folder1.add(API, 'ambientLightIntensity', 0, 10, 0.02)
    .name('Ambient Light Intensity')
    .onChange(function () {
        ambientLightIntensity.value = API.ambientLightIntensity;
    });

folder1.addColor(API, 'ambientLightColor')
    .name('Ambient Light Color')
    .onChange(function () {
        ambientLightColor.value = API.ambientLightColor;
    });

folder1.add(API, 'lightProbeIntensity', 0, 2, 0.02)
    .name('Light Probe Intensity')
    .onChange(function () {
        lightProbeIntensity.value = API.lightProbeIntensity;
    });

// Environment
const folder2 = gui.addFolder('Environment');

folder2.add(API, 'backgroundIntensity', 0, 2, 0.02)
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

// Renderer
const folder4 = gui.addFolder('Renderer');

folder4.add(API, 'toneMapping', Object.values(toneMappingOptions))
    .name('Tone Mapping')
    .onChange(function () {
        toneMapping.value = API.toneMapping;
    });

folder4.add(API, 'toneMappingExposure', 0, 3, 0.02)
    .name('Tone Mapping Exposure')
    .onChange(function () {
        toneMappingExposure.value = API.toneMappingExposure;
    });

// Camera Coordinates
const folder5 = gui.addFolder('Camera Coordinates');

folder5.add(messages, "cameraMessage");

folder5.add(API, 'cameraTargetX', -20, 20, 0.02)
    .name('Camera Target X')
    .onChange(function () {
        cameraTargetX.value = API.cameraTargetX;
    });

folder5.add(API, 'cameraTargetY', -20, 20, 0.02)
    .name('Camera Target Y')
    .onChange(function () {
        cameraTargetY.value = API.cameraTargetY;
    });

folder5.add(API, 'cameraTargetZ', -20, 20, 0.02)
    .name('Camera Target Z')
    .onChange(function () {
        cameraTargetZ.value = API.cameraTargetZ;
    });

// Forcing GUI Z-Index
const guiElement = document.querySelector('.lil-gui');
guiElement.style.zIndex = "1100";

</script>