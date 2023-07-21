import * as THREE from 'three';
const canvas = document.querySelector('canvas.webgl');
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';
const sizes = {
    w: window.innerWidth,
    h: window.innerHeight,
};
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.w / sizes.h);
camera.position.set(0, 0, 2);
scene.add(camera);

const planeMaterial = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(plane);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.w, sizes.h);

const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
const tick = () => {
    control.update();
    window.requestAnimationFrame(tick);
    renderer.render(scene, camera);
};

tick();
