<script setup>
import { useGraphicsStore } from '/src/stores/GraphicsStore';
import { storeToRefs } from 'pinia';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const graphicsStore = useGraphicsStore();
const { directionalLightIntensity } = storeToRefs(graphicsStore);

// gui
const gui = new GUI({ title: 'Graphics Properties' });

// rendering and lighting constants
const API = {
    directionalLightIntensity: directionalLightIntensity.value,
};

gui.add(API, 'directionalLightIntensity', 0, 100, 0.02)
    .name('Directional Light Intensity')
    .onChange(function () {
        directionalLightIntensity.value = API.directionalLightIntensity; // render();
    });

const guiElement = document.querySelector('.lil-gui');
guiElement.style.zIndex = "1100";

</script>