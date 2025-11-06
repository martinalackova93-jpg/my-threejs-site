import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/controls/PointerLockControls.js';

console.log("script.js loaded!");

// --- Scene ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);

// --- Camera ---
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.y = 1.6;

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Floor ---
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x808080 })
);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// --- Light ---
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,10,5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// --- Cube ---
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(2,2,2),
  new THREE.MeshStandardMaterial({ color: 0xff6347 })
);
cube.position.set(0,1,-5);
scene.add(cube);

// --- Controls ---
const controls = new PointerLockControls(camera, renderer.domElement);

// --- Button to trigger pointer lock on canvas ---
const overlayButton = document.getElementById('overlayButton');
overlayButton.addEventListener('click', () => {
    renderer.domElement.requestPointerLock();
});

// Enable controls when pointer is locked
document.addEventListener('pointerlockchange', () => {
    if(document.pointerLockElement === renderer.domElement){
        controls.enabled = true;
        overlayButton.style.display = 'none';
        console.log("Pointer locked!");
    } else {
        controls.enabled = false;
        overlayButton.style.display = 'block';
        console.log("Pointer unlocked!");
    }
});

// --- Movement ---
const move = { forward: false, backward: false, left: false, right: false };
const velocity = new THREE.Vector3();
const speed = 5;

document.addEventListener('keydown', (e) => {
    switch(e.code){
        case 'KeyW': move.forward = true; break;
        case 'KeyS': move.backward = true; break;
        case 'KeyA': move.left = true; break;
        case 'KeyD': move.right = true; break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.code){
        case 'KeyW': move.forward = false; break;
        case 'KeyS': move.backward = false; break;
        case 'KeyA': move.left = false; break;
        case 'KeyD': move.right = false; break;
    }
});

// --- Animate ---
const clock = new THREE.Clock();

function animate(){
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    velocity.x = velocity.z = 0;

    if(move.forward) velocity.z = -speed*delta;
    if(move.backward) velocity.z = speed*delta;
    if(move.left) velocity.x = -speed*delta;
    if(move.right) velocity.x = speed*delta;

    if(controls.enabled){
        controls.moveRight(velocity.x);
        controls.moveForward(velocity.z);
    }

    renderer.render(scene, camera);
}
animate();

// --- Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
