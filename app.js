import * as THREE from 'three';

/**
 * cursor
 */

const cursor = {
    x: 0,
    y: 0,
};
window.onmousemove = (e) => {
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = -(e.clientY / sizes.height - 0.5);
};

// scene

const scene = new THREE.Scene();

// cube
const group = new THREE.Group();
scene.add(group);
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#ff0' })
);

group.add(cube1);

// axes helper

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper); //red -> x , green -> y , blue-> z

// camera
const sizes = {
    width: 800,
    height: 600,
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

renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();
const tick = () => {
    camera.position.x = Math.sin(cursor.x + Math.PI * 2) * 3;
    camera.position.z = Math.cos(cursor.x + Math.PI * 2) * 3;
    camera.position.y = cursor.y * 3;
    camera.lookAt(cube1.position);
    const elapsedTime = clock.getElapsedTime();
    // render
    // cube1.rotation.y = elapsedTime;
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};
tick();
