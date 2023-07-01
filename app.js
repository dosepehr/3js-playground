import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { handleResize, handleFullscreen } from './helpers/resize';
import { parameters } from './helpers/parameters';
import { gsap } from 'gsap';
import * as dat from 'dat.gui';

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load('./textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('./textures/door/Alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
    './textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('./textures/door/Height.jpg');
const doorNormalTexture = textureLoader.load('./textures/door/Normal.jpg');
const doorMetalnessTexture = textureLoader.load(
    './textures/door/Metalness.jpg'
);
const doorRoughnessTexture = textureLoader.load(
    './textures/door/Roughness.jpg'
);
const matcapTexture = textureLoader.load('./textures/matcaps/3.png');
const gradintTexture = textureLoader.load('./textures/gradients/3.jpg');
// scene
const scene = new THREE.Scene();

// cube
const group = new THREE.Group();
scene.add(group);
const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
);
sphere.position.x = -1.5;
torus.position.x = 1.5;
group.add(sphere, plane, torus);

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
window.ondblclick = () => {
    handleFullscreen(canvas);
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

// debug
// const gui = new dat.GUI({ closed: true, width: 400 }); //https://jsfiddle.net/ikatyang/182ztwao
// gui.add(cube1.position, 'y', 0, 5, 0.5); //object,propert,min,max,step
// gui.add(cube1.position, 'x').min(-3).max(3).step(0.5).name('x axis');

// gui.add(cube1, 'visible');

// gui.add(c1Material, 'wireframe');

// gui.addColor(parameters, 'color').onChange(() => {
//     c1Material.color.set(parameters.color);
// });
// gui.add(parameters, 'spin');
const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    // update object
    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;
    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    // render
    renderer.render(scene, camera);
    controls.update();

    window.requestAnimationFrame(tick);
};
tick();
