// script.js - Three.js 3D Scene for Anime Blossom Garden

import * as THREE from 'three';

// Setup Scene, Camera, Renderer (Transparent Canvas)
const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
scene.background = null; // transparent so CSS gradient shows
scene.fog = new THREE.FogExp2(0x03050b, 0.008);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 18);
camera.lookAt(0, 2, 0);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lighting System for Anime Glow
const ambientLight = new THREE.AmbientLight(0x443366);
scene.add(ambientLight);
const mainLight = new THREE.DirectionalLight(0xffccaa, 1.2);
mainLight.position.set(5, 12, 6);
scene.add(mainLight);
const fillLight = new THREE.PointLight(0xffaa88, 0.6);
fillLight.position.set(-3, 5, 4);
scene.add(fillLight);
const backLight = new THREE.PointLight(0x88aaff, 0.5);
backLight.position.set(0, 5, -8);
scene.add(backLight);

// Helper function: Create Cartoon Style 3D Flower
function createCartoonFlower(x, z, color, petalColor2, size = 0.6) {
    const group = new THREE.Group();
    
    // Stem
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x7cb518, roughness: 0.4, emissive: 0x226622, emissiveIntensity: 0.2 });
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.2, 6), stemMat);
    stem.position.y = -0.5;
    group.add(stem);
    
    // Leaves
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x6aab35, emissive: 0x33aa33, emissiveIntensity: 0.2 });
    const leafGeo = new THREE.SphereGeometry(0.22, 6, 6);
    const leaf1 = new THREE.Mesh(leafGeo, leafMat);
    leaf1.position.set(0.3, -0.2, 0);
    leaf1.scale.set(0.9, 0.3, 0.5);
    group.add(leaf1);
    const leaf2 = leaf1.clone();
    leaf2.position.set(-0.3, -0.2, 0);
    group.add(leaf2);
    
    // Center pistil (glowing)
    const pistilMat = new THREE.MeshStandardMaterial({ color: 0xffaa66, emissive: 0xff6633, emissiveIntensity: 0.5 });
    const pistil = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), pistilMat);
    pistil.position.y = 0.25;
    group.add(pistil);
    
    // Outer Petals (rounded spheres for cute look)
    const petalMat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.25 });
    const petalMat2 = new THREE.MeshStandardMaterial({ color: petalColor2, emissive: petalColor2, emissiveIntensity: 0.2 });
    const petalGeo = new THREE.SphereGeometry(0.4, 12, 12);
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.7;
        const petal = new THREE.Mesh(petalGeo, i % 2 === 0 ? petalMat : petalMat2);
        petal.position.x = Math.cos(angle) * radius;
        petal.position.z = Math.sin(angle) * radius;
        petal.position.y = 0.15;
        petal.scale.set(0.9, 0.55, 0.9);
        group.add(petal);
    }
    // Inner petals
    const innerMat = new THREE.MeshStandardMaterial({ color: 0xffdd99, emissive: 0xffaa77 });
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const innerPetal = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10), innerMat);
        innerPetal.position.x = Math.cos(angle) * 0.45;
        innerPetal.position.z = Math.sin(angle) * 0.45;
        innerPetal.position.y = 0.28;
        innerPetal.scale.set(0.8, 0.5, 0.8);
        group.add(innerPetal);
    }
    
    group.position.set(x, -1.2 + Math.random() * 0.5, z);
    return group;
}

// Color palette for anime flowers
const flowerColors = [
    { main: 0xff7799, second: 0xffb3c6 }, // sakura pink
    { main: 0xffaa66, second: 0xffdd99 }, // orange
    { main: 0x99ccff, second: 0xcce6ff }, // pastel blue
    { main: 0xddaaff, second: 0xf0ccff }, // lavender
    { main: 0x88dd88, second: 0xb8f2b8 }  // mint
];

// Fixed positions for 3D flowers
const positions = [
    [-3.2, -1.2, -3], [3.5, -1.2, -2.5], [-2, -1, -4.5], [1.8, -1.1, -4], [0, -1.3, -5.2],
    [-4, -1, 0], [4.2, -1, 0.5], [-1.5, -0.8, 1.8], [2.5, -1, 2.2], [0, -0.9, 3],
    [-3.8, -1, 2.8], [3.9, -1.2, 3.2], [-2.8, -0.7, -1], [2.9, -0.9, -1.4]
];

const flowers3D = [];
positions.forEach(pos => {
    const rand = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    const flower = createCartoonFlower(pos[0], pos[2], rand.main, rand.second, 0.55);
    scene.add(flower);
    flowers3D.push(flower);
});

// Magical floating particles (sparkles)
const particleCount = 350;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
    particlePositions[i*3] = (Math.random() - 0.5) * 22;
    particlePositions[i*3+1] = Math.random() * 8;
    particlePositions[i*3+2] = (Math.random() - 0.5) * 15 - 5;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMaterial = new THREE.PointsMaterial({
    color: 0xffaa88,
    size: 0.08,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Cute floating hearts
const heartGroup = new THREE.Group();
const heartMat = new THREE.MeshStandardMaterial({ color: 0xff5e7e, emissive: 0xff3366, emissiveIntensity: 0.4 });
for (let i = 0; i < 60; i++) {
    const heartGeo = new THREE.SphereGeometry(0.09, 8);
    const heart = new THREE.Mesh(heartGeo, heartMat);
    heart.position.x = (Math.random() - 0.5) * 14;
    heart.position.y = Math.random() * 6;
    heart.position.z = (Math.random() - 0.5) * 12 - 4;
    heart.scale.set(1, 1.2, 0.6);
    heartGroup.add(heart);
}
scene.add(heartGroup);

// Ribbon / magical swirls (torii shapes)
const ribbonGroup = new THREE.Group();
const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xffb374, emissive: 0xff8844 });
for (let i = 0; i < 40; i++) {
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 12, 24), ribbonMat);
    torus.position.set((Math.random() - 0.5) * 12, Math.random() * 7, (Math.random() - 0.5) * 12);
    torus.rotation.x = Math.random() * Math.PI;
    torus.rotation.z = Math.random() * Math.PI;
    ribbonGroup.add(torus);
}
scene.add(ribbonGroup);

// Glowing star sparkles
const starGroup = new THREE.Group();
const starMat = new THREE.MeshStandardMaterial({ color: 0xffdd99, emissive: 0xffaa55 });
for (let i = 0; i < 80; i++) {
    const starShape = new THREE.SphereGeometry(0.06, 6);
    const starMesh = new THREE.Mesh(starShape, starMat);
    starMesh.position.set((Math.random() - 0.5) * 18, Math.random() * 6, (Math.random() - 0.5) * 14);
    starGroup.add(starMesh);
}
scene.add(starGroup);

// Anime butterfly-like floating creatures
const butterflies = [];
const butterflyMat2 = new THREE.MeshStandardMaterial({ color: 0xffaa99, emissive: 0xff8866 });
for (let i = 0; i < 12; i++) {
    const wingL = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 6), butterflyMat2);
    const wingR = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 6), butterflyMat2);
    wingL.rotation.z = 0.7;
    wingR.rotation.z = -0.7;
    wingL.position.set(-0.25, 0, 0);
    wingR.position.set(0.25, 0, 0);
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6), new THREE.MeshStandardMaterial({ color: 0xdd8855 }));
    const butterfly = new THREE.Group();
    butterfly.add(wingL, wingR, body);
    butterfly.position.set((Math.random() - 0.5) * 12, Math.random() * 5 + 1, (Math.random() - 0.5) * 12);
    scene.add(butterfly);
    butterflies.push({ obj: butterfly, speedX: (Math.random() - 0.5) * 0.008, speedY: (Math.random() - 0.5) * 0.006, speedZ: (Math.random() - 0.5) * 0.008, rotSpeed: Math.random() * 0.02 });
}

// Animation Loop: dreamy motion
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.012;
    
    // Gentle floating of 3D flowers
    flowers3D.forEach((flower, idx) => {
        flower.position.y += Math.sin(time * 1.2 + idx) * 0.003;
        flower.rotation.y = Math.sin(time * 0.7 + idx) * 0.2;
        flower.rotation.x = Math.sin(time * 0.5) * 0.05;
    });
    
    // Rotating ethereal elements
    particles.rotation.y = time * 0.05;
    heartGroup.rotation.y = time * 0.1;
    ribbonGroup.rotation.x = Math.sin(time * 0.3) * 0.2;
    starGroup.rotation.z = time * 0.08;
    
    // Butterfly movement
    butterflies.forEach(butter => {
        butter.obj.position.x += butter.speedX;
        butter.obj.position.y += butter.speedY;
        butter.obj.position.z += butter.speedZ;
        butter.obj.rotation.z = Math.sin(time * 3) * 0.5;
        if (Math.abs(butter.obj.position.x) > 9) butter.speedX *= -1;
        if (butter.obj.position.y > 6 || butter.obj.position.y < 1) butter.speedY *= -1;
        if (Math.abs(butter.obj.position.z) > 8) butter.speedZ *= -1;
    });
    
    // Gentle camera sway for immersion
    camera.position.x += (0 - camera.position.x) * 0.02;
    camera.lookAt(0, 1.5, 0);
    
    renderer.render(scene, camera);
}

animate();

// Window resize handler
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
