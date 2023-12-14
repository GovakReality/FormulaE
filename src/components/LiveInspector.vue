<script setup>
import { useInspectorStore } from '/src/stores/InspectorStore';
import { storeToRefs } from 'pinia';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const inspectorStore = useInspectorStore();
const { lightIntensity } = storeToRefs(inspectorStore);

// lightIntensity.value = 99;

// gui
const gui = new GUI({ title: 'Properties' });

// rendering and lighting constants
const API = {
    directionalLightIntensity: 1,
};

gui.add(API, 'directionalLightIntensity', 0, 100, 0.02)
    .name('directional light')
    .onChange(function () {
        lightIntensity.value = API.directionalLightIntensity; // render();
    });

const guiElement = document.querySelector('.lil-gui');
guiElement.style.zIndex = "1100";

</script>