import * as THREE from 'three';

// scene

const scene = new THREE.Scene();

// cube
const geometry = new THREE.BoxGeometry(1, 1, 1); //width,height,depth
const material = new THREE.MeshBasicMaterial({ color: '#ff00ff' });
const cube = new THREE.Mesh(geometry, material);

//position
cube.position.set(0.7, -0.6, 1);
//scale
cube.scale.set(0.5, 0.5, 0.5);
// rotation
// pi ==> half a rotation
cube.rotation.reorder('YXZ');
cube.rotation.x = 3.14 + 0.25;
cube.rotation.y = 3.14 + 0.25;
scene.add(cube);

// axes helper

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper); //red -> x , green -> y , blue-> z

// camera
const sizes = {
    width: 800,
    height: 600,
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3; //we must pull up camera to see cube
scene.add(camera);

// rendered
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas,
});

renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
