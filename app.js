import * as THREE from 'three';

// scene

const scene = new THREE.Scene();

// cube
const geometry = new THREE.BoxGeometry(1, 1, 1); //width,height,depth
const material = new THREE.MeshBasicMaterial({ color: '#ff00ff' });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube)