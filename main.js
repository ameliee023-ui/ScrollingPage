console.clear();
gsap.registerPlugin(ScrollTrigger);

// =========================
// INTRO (DEIN CODE – SAUBER)
// =========================
gsap.timeline({
  scrollTrigger: {
    trigger: '.wrapper',
    start: 'top top',
    end: '+=300%', // 🔥 WICHTIG
    pin: true,
    scrub: true,
    markers: false
  }
})

.to('.tunnel img', {
  scale: 2,
  z: 650,
  rotationY: 10
})
.to('.hero .title', {
  scale: 3.5
}, '<');

// =========================
// PLANETEN
// =========================
const canvas = document.getElementById("planet-canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Licht
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(10, 10, 10);
scene.add(light);

// Sonne
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(3, 64, 64),
  new THREE.MeshStandardMaterial({ emissive: 0xffaa00 })
);
scene.add(sun);

// Planet
const planet = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 64, 64),
  new THREE.MeshStandardMaterial({ color: 0x3fa9f5 })
);
planet.position.x = 8;

const orbit = new THREE.Group();
orbit.add(planet);
scene.add(orbit);

// Render
function animate() {
  requestAnimationFrame(animate);
  sun.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();

// Scroll für Planeten
gsap.timeline({
  scrollTrigger: {
    trigger: ".section.planets",
    start: "top top",
    end: "+=200%",
    scrub: true,
    pin: true
  }
})
.to(camera.position, { z: 10 })
.to(orbit.rotation, { y: Math.PI * 2 }, 0);
