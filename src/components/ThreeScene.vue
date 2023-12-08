<script setup>
  import { onMounted, onUnmounted, ref, computed, watch } from 'vue';
  import { PerspectiveCamera, Scene, WebGLRenderer, Mesh, BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, Vector3, PlaneGeometry, DoubleSide, SphereGeometry, TextureLoader, DirectionalLight} from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { gsap } from 'gsap';
  import { usePositionStore } from '/src/stores/PositionStore';
  import { storeToRefs } from 'pinia';

  const positionStore = usePositionStore();
  const { positionIndex } = storeToRefs(positionStore);

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
  let light;

  // set positions
  const car1Pos = new Vector3(0, 0, 0);
  const car2Pos = new Vector3(5, 0, -5);
  const car3Pos = new Vector3(0, 0, -10);

  const initialPos = new Vector3(6,8,15); // on intial screen
  const initialTarget = new Vector3(2.5, 0, -5); // on intial screen

  // car 1 points
  const car1Pos1 = new Vector3(-5, 5, 5);
  const car1Target1 = car1Pos;
  const car1Pos2 = new Vector3(5, 5, 5);
  const car1Target2 = car1Pos;
  const car1Pos3 = new Vector3(-5, 5, 5);
  const car1Target3 = car1Pos;

  // car 2 points
  const car2Pos1 = new Vector3(10, 5, 0);
  const car2Target1 = car2Pos;
  const car2Pos2 = new Vector3(0, 5, 0);
  const car2Target2 = car2Pos;
  const car2Pos3 = new Vector3(10, 5, 0);
  const car2Target3 = car2Pos;

  // car 3 points
  const car3Pos1 = new Vector3(-5, 5, -5);
  const car3Target1 = car3Pos;
  const car3Pos2 = new Vector3(5, 5, -5);
  const car3Target2 = car3Pos;
  const car3Pos3 = new Vector3(-5, 5, -5);
  const car3Target3 = car3Pos;    

  const setCanvas = () => {
    // Create Scene
    scene = new Scene();

    // Create 360 sphere
    const bgGeometry = new SphereGeometry(4,60,40);
    bgGeometry.scale(12, 12, 12);
    const bgMaterial = new MeshBasicMaterial({
        map: new TextureLoader().load('/textures/background.jpg'),
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
    const modelLoader = new GLTFLoader();

    // Car 1
    modelLoader.load( '/models/box.glb', function ( gltf ) {
      const car1Obj = gltf.scene;
      car1Obj.position.copy(car1Pos);
      scene.add(car1Obj);
    }, undefined, function ( error ) {
      console.error( 'car1 modelLoader error' + error );
    });

    // Car 2
     modelLoader.load( '/models/box.glb', function ( gltf ) {
      const car2Obj = gltf.scene;
      car2Obj.position.copy(car2Pos);
      scene.add(car2Obj);
    }, undefined, function ( error ) {
      console.error( 'car2 modelLoader error' + error );
    });

    // Car 3
    modelLoader.load( '/models/box.glb', function ( gltf ) {
      const car3Obj = gltf.scene;
      car3Obj.position.copy(car3Pos);
      scene.add(car3Obj);
    }, undefined, function ( error ) {
      console.error( 'car3 modelLoader error' + error );
    });

/*  // cars with box geometry

    const geometry = new BoxGeometry(1, 1, 2);

    // Car 1
    const material1 = new MeshStandardMaterial({color: 0xccaa22});
    const car1Obj = new Mesh(geometry, material1);
    car1Obj.position.copy(car1Pos);
    scene.add(car1Obj);

    // Car 2
    const material2 = new MeshStandardMaterial({color: 0xcc0000});
    const car2Obj = new Mesh(geometry, material2);
    car2Obj.position.copy(car2Pos);
    scene.add(car2Obj);

    // Car 3
    const material3 = new MeshStandardMaterial({color: 0x0CCCA2});
    const car3Obj = new Mesh(geometry, material3);
    car3Obj.position.copy(car3Pos);
    scene.add(car3Obj); */

    // Lights
    light = new DirectionalLight(0xffffff, 5);
    light.position.set(20, 20, 20);
    //light.target = car1Obj;
    scene.add(light);

    // Camera
    camera = new PerspectiveCamera(45, aspectRatio.value, 0.1, 100);
    camera.position.copy(initialPos);
    scene.add(camera);
    camera.add(light);
    updateCamera();

    // Renderer
    const canvas = webGl.value;
    renderer = new WebGLRenderer({ canvas, antialias: true });
    updateRenderer();

    // Controls
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    // Controls limit
    controls.minDistance = 3;
    controls.maxDistance = 45;
    controls.maxPolarAngle = (Math.PI/2) - 0.01;
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
        //camera.lookAt(car2Pos);
        },
      onComplete: function () {
        //controls.target.copy(car2Pos);
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
      //camera.lookAt(car2Pos);
      },
    onComplete: function () {
      //controls.target.copy(car2Pos);
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

  watch(positionIndex, () => {
    switch (positionIndex.value) {
      case 0:
        cameraMovement(initialPos, initialTarget);
        break;      
      case 1:
        cameraMovement(car1Pos1, car1Target1);
        break;
      case 2:
        cameraMovement(car1Pos2, car1Target2);
        break;
      case 3:
        cameraMovement(car1Pos3, car1Target3);
        break;                
      case 4:
        cameraMovement(car2Pos1, car2Target1);
        break;
      case 5:
        cameraMovement(car2Pos2, car2Target2);
        break;
      case 6:
        cameraMovement(car2Pos3, car2Target3);
        break;                
      case 7:
        cameraMovement(car3Pos1, car3Target1);
        break;   
      case 8:
        cameraMovement(car3Pos2, car3Target2);
        break;  
      case 9:
        cameraMovement(car3Pos3, car3Target3);
        break;                       
      default:
        positionStore.reset();
        console.log('no way');
    }
  })

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
