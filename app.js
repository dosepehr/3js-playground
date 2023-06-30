import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { handleResize } from './helpers/resize';
/**
 * cursor
 */

// scene

const scene = new THREE.Scene();

// cube
const group = new THREE.Group();
scene.add(group);
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#ff0' })
);

group.add(cube1);

// axes helper

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper); //red -> x , green -> y , blue-> z

// camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
window.onresize = () => {
    handleResize(sizes, camera, renderer);
};
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);

camera.position.set(0, 0, 2);
scene.add(camera);

// rendered
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas,
});

// controll
const controls = new OrbitControls(camera, canvas);
// controls.target.y = 2;
controls.enableDamping = true;
renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    // render
    // cube1.rotation.y = elapsedTime;
    renderer.render(scene, camera);
    controls.update();

    window.requestAnimationFrame(tick);
};
tick();
