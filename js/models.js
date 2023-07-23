import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
import { gsap } from 'gsap';
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
let sceneReady = false;
const scene = new THREE.Scene();

/**
 * overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
        uAlpha: { value: 1 },
    },
    vertexShader: `
    void main(){
        gl_Position =  vec4(position,1.0);
    }
    `,
    fragmentShader: `
    uniform float uAlpha;
    void main(){
        gl_FragColor= vec4(0.0,0.0,0.0,uAlpha);
    }
    `,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);
/**
 * Loaders
 */
const loadingBar = document.querySelector('.loading-bar');
const loadingManager = new THREE.LoadingManager(
    // loaded
    () => {
        setTimeout(() => {
            gsap.to(overlayMaterial.uniforms.uAlpha, { value: 0, duration: 2 });
            gsap.to(loadingBar, { left: '100%', duration: 1 });
        }, 500);

        setTimeout(() => {
            sceneReady = true;
        }, 2000);
    },
    // progress
    (itemUtl, itemLoaded, itemTotal) => {
        console.log('progress');
        loadingBar.style.transform = `scaleX(${itemLoaded / itemTotal})`;
    }
);

const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (
            child instanceof THREE.Mesh &&
            child.material instanceof THREE.MeshStandardMaterial
        ) {
            child.material.envMap = environmentMap;
            child.material.envMapIntensity = 2.5;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
]);
environmentMap.colorSpace = THREE.SRGBColorSpace;

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Material
 */

// Textures
// const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg');
// mapTexture.colorSpace = THREE.SRGBColorSpace;

// const normalTexture = textureLoader.load('/models/LeePerrySmith/normal.jpg');

// // Material
// const material = new THREE.MeshStandardMaterial({
//     map: mapTexture,
//     normalMap: normalTexture,
// });

/**
 * Models
 */
gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
    // Model
    const mesh = gltf.scene;
    mesh.scale.set(2.5, 2.5, 2.5);
    mesh.rotation.y = Math.PI * 0.5;
    scene.add(mesh);

    // Update materials
    updateAllMaterials();
});
/**
 * points
 */
const raycaster = new THREE.Raycaster();
const points = [
    {
        position: new THREE.Vector3(1.55, 0.3, -0.6),
        element: document.querySelector('.point-0'),
    },
    {
        position: new THREE.Vector3(0.5, 0.8, -1.6),
        element: document.querySelector('.point-1'),
    },
    {
        position: new THREE.Vector3(1.6, -1.3, -0.7),
        element: document.querySelector('.point-2'),
    },
];

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
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
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.useLegacyLights = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMappingExposure = 3;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // points positions
    for (const point of points) {
        if (sceneReady) {
            const screenPosition = point.position.clone();
            screenPosition.project(camera);
            raycaster.setFromCamera(screenPosition, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length === 0) {
                point.element.classList.add('visible');
            } else {
                const intersectionDistance = intersects[0].distance;
                const pointDistance = point.position.distanceTo(
                    camera.position
                );

                if (intersectionDistance < pointDistance) {
                    point.element.classList.remove('visible');
                } else {
                    point.element.classList.add('visible');
                }
            }

            const translateX = screenPosition.x * sizes.width * 0.5;
            const translateY = -screenPosition.y * sizes.height * 0.5;
            point.element.style.transform = `translate(${translateX}px,${translateY}px)`;
        }
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
