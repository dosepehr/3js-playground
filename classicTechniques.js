import * as THREE from 'three';
import { handleResize, handleFullscreen } from './helpers/resize';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const canvas = document.querySelector('canvas');

window.onresize = () => {
    handleResize(sizes, camera, renderer);
};
window.ondblclick = () => {
    handleFullscreen(canvas);
};
const scene = new THREE.Scene();
const material = new THREE.MeshBasicMaterial();

const cubeGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75);
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const cube = new THREE.Mesh(cubeGeometry, material);
const sphere = new THREE.Mesh(sphereGeometry, material);
const donut = new THREE.Mesh(donutGeometry, material);
const plane = new THREE.Mesh(planeGeometry, material);

plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -1;

sphere.position.x = -1.5;
donut.position.x = 1.5;
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(cube, sphere, donut, plane, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // render
    renderer.render(scene, camera);
    controls.update();

    window.requestAnimationFrame(tick);
};
tick();
