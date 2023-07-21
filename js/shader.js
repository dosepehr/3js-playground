import * as THREE from 'three';
const canvas = document.querySelector('canvas.webgl');
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import dat from 'dat.gui';

import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';
const sizes = {
    w: window.innerWidth,
    h: window.innerHeight,
};

const textureLoader = new THREE.TextureLoader();
const frenchFlag = textureLoader.load('../textures/flag-french.jpg');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.w / sizes.h);
camera.position.set(0, 0, 2);
scene.add(camera);

const planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);

const count = planeGeometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
    randoms[i] = Math.random();
}

planeGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

const planeMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#f0f') },
        uTexture: { value: frenchFlag },
    },
});

const gui = new dat.GUI();
gui.add(planeMaterial.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01);
gui.add(planeMaterial.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01);
gui.addColor(planeMaterial.uniforms.uColor, 'value');

const plane = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(plane);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.w, sizes.h);

const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    control.update();
    window.requestAnimationFrame(tick);
    renderer.render(scene, camera);

    planeMaterial.uniforms.uTime.value = elapsedTime;
};

tick();
