import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { handleResize, handleFullscreen } from './helpers/resize';
import { gsap } from 'gsap';
import * as dat from 'dat.gui';

/**
 * Textures
 */

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
    console.log('start');
};

const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('/textures/door/color.jpg');
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;

// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping

// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;

// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;
// colorTexture.minFilter=THREE.NearestFilter //when texture is big
// colorTexture.magFilter = THREE.NearestFilter; // makes texture sharp

colorTexture.rotation = Math.PI * 0.5;
colorTexture.center.x = 0.5;
colorTexture.center.y = 0.5;
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
const c1Material = new THREE.MeshBasicMaterial({ map: colorTexture });
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
const gui = new dat.GUI({ closed: true, width: 400 }); //https://jsfiddle.net/ikatyang/182ztwao
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
