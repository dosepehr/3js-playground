import * as THREE from 'three';
import { handleResize, handleFullscreen } from './helpers/resize';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';
const canvas = document.querySelector('canvas');

window.onresize = () => {
    handleResize(sizes, camera, renderer);
};
window.ondblclick = () => {
    handleFullscreen(canvas);
};
/**
 * !lights
 */

// const ambientLight = new THREE.AmbientLight('white', 0.5);
// const directionalLight = new THREE.DirectionalLight('#0f0', 0.5);
// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
// const pointLight = new THREE.PointLight('#ff9000', 0.3, 10, 0.1);
// const rectAreaLight = new THREE.RectAreaLight('#4e00ff', 2, 1, 1);
const spotlight = new THREE.SpotLight(
    '#78ff00',
    0.5,
    10,
    Math.PI * 0.1,
    0.25,
    1
);
const scene = new THREE.Scene();
scene.add(spotlight);

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
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

const gui = new dat.GUI();

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    donut.rotation.x = elapsedTime * 0.5;
    cube.rotation.x = elapsedTime * 0.5;
    sphere.rotation.x = elapsedTime * 0.5;

    donut.rotation.y = elapsedTime * 0.5;
    cube.rotation.y = elapsedTime * 0.5;
    sphere.rotation.y = elapsedTime * 0.5;

    // render
    renderer.render(scene, camera);
    controls.update();

    window.requestAnimationFrame(tick);
};
tick();
