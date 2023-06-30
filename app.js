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

group.add(cube1);

// axes helper

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper); //red -> x , green -> y , blue-> z

// camera
const sizes = {
    width: 800,
    height: 600,
};
// const camera = new THREE.PerspectiveCamera(
//     75,
//     sizes.width / sizes.height,
//     0.1,
//     100
// );
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(
    -1 * aspectRatio,
    1 * aspectRatio,
    1,
    -1,
    0.1,
    100
);

camera.position.set(2, 2, 2);
camera.lookAt(cube1.position);
scene.add(camera);

// rendered
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas,
});

renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    // render
    cube1.rotation.y = elapsedTime;
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};
tick();
