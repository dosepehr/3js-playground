import * as THREE from 'three';

// scene

const scene = new THREE.Scene();

// cube
const geometry = new THREE.BoxGeometry(1, 1, 1); //width,height,depth
const material = new THREE.MeshBasicMaterial({ color: '#ff00ff' });
const cube = new THREE.Mesh(geometry, material);

cube.position.x = 0.7;
cube.position.y = -0.6;
cube.position.z = 1;

// distance between cube center and scene center
console.log(cube.position.length());
console.log(cube.position.distanceTo(new THREE.Vector3(1, 1, 1)));
// console.log(cube.position.distanceTo(camera.position));

cube.position.normalize(); // makes cube length 1
cube.position.set(1, -1, 1); // do all three vectors
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
