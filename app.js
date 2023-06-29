import * as THREE from 'three';

// scene

const scene = new THREE.Scene();

// cube
const group = new THREE.Group();
scene.add(group);
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#ff0' })
);
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#f0f' })
);
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#0ff' })
);
cube2.position.x = -2;
cube3.position.x = 2;
group.add(cube1);

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
// look at
// camera.lookAt(new THREE.Vector3(0, -1, 0));

// rendered
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas,
});

renderer.setSize(sizes.width, sizes.height);
let time = Date.now();

const tick = () => {
    let currentTime = Date.now();
    const delta = currentTime - time;
    time = currentTime;
    console.log(delta);
    // update objects
    cube1.rotation.x += 0.01 * delta;

    // render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};
tick();
