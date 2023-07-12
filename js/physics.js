import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import cannon from 'cannon';

/**
 * Debug
 */
const parameters = {};
parameters.createSphere = () => {
    createSphere(Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
    });
};
parameters.createBox = () => {
    createBox(Math.random(), Math.random(), Math.random(), {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
    });
};
const gui = new dat.GUI();
gui.add(parameters, 'createSphere');
gui.add(parameters, 'createBox');
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
    '../textures/environmentMaps/0/px.jpg',
    '../textures/environmentMaps/0/nx.jpg',
    '../textures/environmentMaps/0/py.jpg',
    '../textures/environmentMaps/0/ny.jpg',
    '../textures/environmentMaps/0/pz.jpg',
    '../textures/environmentMaps/0/nz.jpg',
]);

/**
 * Test sphere
 */

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
    })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// world
const world = new cannon.World();
world.gravity.set(0, -9.82, 0);
// sphere

const floorShape = new cannon.Plane();
const floorBody = new cannon.Body({ mass: 0, shape: floorShape });
floorBody.quaternion.setFromAxisAngle(new cannon.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

// material
const concreteMaterial = new cannon.Material('concrete');
const plasticMaterial = new cannon.Material('plastic');
floorBody.material = concreteMaterial;
const concretePlastciContcatMaterial = new cannon.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.7,
    }
);
world.addContactMaterial(concretePlastciContcatMaterial);

// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const objectsToUpdate = [];
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
});
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
});
const createBox = (width, height, depth, position) => {
    // 3js
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.scale.set(width, height, depth);
    box.castShadow = true;
    box.position.copy(position);
    scene.add(box);
    // physics
    const boxShape = new cannon.Box(
        new cannon.Vec3(width * 0.5, height * 0.5, depth * 0.5)
    );
    const body = new cannon.Body({
        mass: 1,
        position: new cannon.Vec3(0, 3, 0),
        shape: boxShape,
        material: plasticMaterial,
    });
    body.position.copy(position);
    objectsToUpdate.push({ mesh: box, body });
    world.addBody(body);
};
createBox(1, 1, 1, { x: 1, y: 1, z: 1 });
const createSphere = (radius, position) => {
    // 3js part
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.scale.set(radius, radius, radius);

    sphere.castShadow = true;
    sphere.position.copy(position);
    scene.add(sphere);
    // cannon js body
    const shape = new cannon.Sphere(radius);
    const body = new cannon.Body({
        mass: 1,
        position: new cannon.Vec3(0, 3, 0),
        shape,
        material: plasticMaterial,
    });
    body.position.copy(position);
    world.addBody(body);
    objectsToUpdate.push({
        mesh: sphere,
        body,
    });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });
/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    // Update controls
    controls.update();
    // update physics world
    world.step(1 / 60, deltaTime, 3);
    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
    }
    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
