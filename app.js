import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { handleResize, handleFullscreen } from './helpers/resize';
import { gsap } from 'gsap';
import * as dat from 'dat.gui';

// scene
const scene = new THREE.Scene();
let parameters = {
    color: '#f0f',
    spin: () => {
        gsap.to(cube1.rotation, {
            y: cube1.rotation.y + Math.PI * 2,
            duration: 1,
        });
    },
};
// cube
const group = new THREE.Group();
scene.add(group);
const c1Material = new THREE.MeshBasicMaterial({ color: parameters.color });
const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), c1Material);

group.add(cube1);

// axes helper

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper); //red -> x , green -> y , blue-> z

// camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
window.onresize = () => {
    handleResize(sizes, camera, renderer);
};
window.ondblclick = () => {
    handleFullscreen(canvas);
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

// controll
const controls = new OrbitControls(camera, canvas);
// controls.target.y = 2;
controls.enableDamping = true;
renderer.setSize(sizes.width, sizes.height);

// debug
const gui = new dat.GUI({ closed: true, width: 400 });  //https://jsfiddle.net/ikatyang/182ztwao
gui.add(cube1.position, 'y', 0, 5, 0.5); //object,propert,min,max,step
gui.add(cube1.position, 'x').min(-3).max(3).step(0.5).name('x axis');

gui.add(cube1, 'visible');

gui.add(c1Material, 'wireframe');

gui.addColor(parameters, 'color').onChange(() => {
    c1Material.color.set(parameters.color);
});
gui.add(parameters, 'spin');

const tick = () => {
    // render
    renderer.render(scene, camera);
    controls.update();

    window.requestAnimationFrame(tick);
};
tick();
