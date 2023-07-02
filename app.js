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
/**
 * lights
 */
const ambientLight = new THREE.AmbientLight('#fff', 0.5);
const pointLight = new THREE.PointLight('#fff', 0.5);
pointLight.position.set(2, 3, 4);
scene.add(ambientLight, pointLight);

// cube
const group = new THREE.Group();
scene.add(group);
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture;
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.05;
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
material.normalMap = doorNormalTexture;
material.normalScale.set(0.5, 0.5);
material.alphaMap = doorAlphaTexture;
material.transparent = true;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
);
sphere.position.x = -1.5;
torus.position.x = 1.5;
group.add(sphere, plane, torus);

// uv2
sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

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
const gui = new dat.GUI({ closed: true, width: 400 }); //https://jsfiddle.net/ikatyang/182ztwao
gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001);
gui.add(material, 'displacementScale').min(0).max(1).step(0.001);

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
