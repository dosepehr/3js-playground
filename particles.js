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
const textureLoader = new THREE.TextureLoader();

const particleTexture = textureLoader.load('/textures/particles/2.png');
/**
 * particles
 */
// geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
    colors[i] = Math.random();
}
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
// material
const particleMaterial = new THREE.PointsMaterial({
    size: 10,
    sizeAttenuation: false,
    color: '#ff88cc',
    transparent: true,
    alphaMap: particleTexture,
    // alphaTest: 0.001
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
});
// points
const particles = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particles);

const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(sizes.w, sizes.h);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const clock = new THREE.Clock();
const aniamte = () => {
    const elapsedTime = clock.getElapsedTime();
    // particles.rotation.y = elapsedTime * 0.2;
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = particlesGeometry.attributes.position.array[i3];
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
            elapsedTime + x
        );
    }
    particlesGeometry.attributes.position.needsUpdate = true;
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
