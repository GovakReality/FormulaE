<script setup>
import { useInspectorStore } from '/src/stores/InspectorStore';
import { storeToRefs } from 'pinia';

const inspectorStore = useInspectorStore();
const { lightIntensity } = storeToRefs(inspectorStore);

lightIntensity.value = 99;

</script>