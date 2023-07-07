import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { handleResize, handleFullscreen } from './helpers/resize';

const sizes = {
    w: window.innerWidth,
    h: window.innerHeight,
};
const canvas = document.querySelector('canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.w / sizes.h);
camera.position.z = 5;

/**
 * particles
 */
// geometry
const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
// material
const particleMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
});
// points
const particles = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particles);

const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(sizes.w, sizes.h);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const aniamte = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(aniamte);
};

aniamte();

window.onresize = () => {
    handleResize(sizes, camera, renderer);
};
window.ondblclick = () => {
    handleFullscreen(canvas);
};
