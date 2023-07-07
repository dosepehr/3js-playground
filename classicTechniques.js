import * as THREE from 'three';
import { handleResize, handleFullscreen } from './helpers/resize';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';
const canvas = document.querySelector('canvas');

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load('/textures/baked/bakedShadow.jpg');

window.onresize = () => {
    handleResize(sizes, camera, renderer);
};
window.ondblclick = () => {
    handleFullscreen(canvas);
};
/**
 * !lights
 */

const ambientLight = new THREE.AmbientLight('white', 0.4);
const directionalLight = new THREE.DirectionalLight('#fff', 0.4);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.position.set(2, 2, -1);
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 2000;
directionalLight.shadow.camera.bottom = -2;

const spotLight = new THREE.SpotLight('#fff', 0.4, 10, Math.PI * 0.3);
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);
scene.add(spotLight, spotLight.target);

const pointLight = new THREE.PointLight('#fff', 0.3);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
scene.add(pointLight);

scene.add(ambientLight, directionalLight);

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const planeGeometry = new THREE.PlaneGeometry(5, 5);
// const cube = new THREE.Mesh(cubeGeometry, material);
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.castShadow = true;
// const donut = new THREE.Mesh(donutGeometry, material);
const plane = new THREE.Mesh(
    planeGeometry,
    new THREE.MeshBasicMaterial({
        map: bakedShadow,
    })
);
plane.receiveShadow = true;

plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -1;

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(sphere, plane, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = false;

const gui = new dat.GUI();
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001);
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);
gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);
gui.add(directionalLight, 'castShadow');

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    sphere.rotation.x = elapsedTime * 0.5;
    sphere.rotation.y = elapsedTime * 0.5;

    // render
    renderer.render(scene, camera);
    controls.update();

    window.requestAnimationFrame(tick);
};
tick();
