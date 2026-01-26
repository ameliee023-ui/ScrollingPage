// =========================
// STARFIELD BACKGROUND
// =========================
const space = document.getElementById('space');
space.innerHTML = `
  <div class="stars"></div>
  <div class="twinkling"></div>
  <div class="nebula"></div>
`;

// =========================
// TUNNEL INTRO ANIMATION
// =========================
console.clear();
gsap.registerPlugin(ScrollTrigger);

gsap.timeline({
  scrollTrigger: {
    trigger: '.wrapper',
    start: 'top top',
    end: '+=300%',
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
}, '<')
.to('.hero .title .small', {
  opacity: 0,
  y: -50
}, '<')
.to('.hero .title .big', {
  opacity: 0,
  y: -100
}, '<0.2');

// =========================
// 3D PLANET CAROUSEL MIT GLB
// =========================
const planetFiles = [
  { 
    path: 'planets/mercury.glb', 
    name: 'Mercury', 
    description: 'The smallest planet in our solar system',
    longDescription: 'Mercury is the smallest planet in our solar system and closest to the Sun. It has a rocky surface covered with craters and no atmosphere to retain heat. Despite being closest to the Sun, it experiences extreme temperature variations from scorching hot days to freezing cold nights.',
    glowColor: '169, 169, 169'
  },
  { 
    path: 'planets/venus.glb', 
    name: 'Venus', 
    description: 'The hottest planet with thick atmosphere',
    longDescription: 'Venus is the hottest planet in our solar system with surface temperatures hot enough to melt lead. Its thick atmosphere traps heat in a runaway greenhouse effect. Often called Earth\'s twin due to similar size, Venus rotates backwards compared to most planets.',
    glowColor: '255, 198, 73'
  },
  { 
    path: 'planets/earth.glb', 
    name: 'Earth', 
    description: 'Our home planet with life',
    longDescription: 'The Earth is the only known planet with life and has a protective atmosphere, liquid water, and diverse landscapes. It is the only known planet with life and has a protective atmosphere that shields us from harmful radiation while maintaining the perfect conditions for water to exist in all three states.',
    glowColor: '100, 149, 237'
  },
  { 
    path: 'planets/mars.glb', 
    name: 'Mars', 
    description: 'The Red Planet with thin atmosphere',
    longDescription: 'Mars is known as the Red Planet due to iron oxide (rust) on its surface. It has the largest volcano and canyon in the solar system. With a thin atmosphere and evidence of ancient water, Mars is the most explored planet beyond Earth and a prime candidate for future human colonization.',
    glowColor: '255, 99, 71'
  },
  { 
    path: 'planets/jupiter.glb', 
    name: 'Jupiter', 
    description: 'The largest planet in our solar system',
    longDescription: 'Jupiter is the largest planet in our solar system, so massive that all other planets could fit inside it. Its iconic Great Red Spot is a storm larger than Earth that has raged for centuries. Jupiter has over 80 moons and acts as a shield for inner planets by attracting asteroids with its powerful gravity.',
    glowColor: '218, 165, 32'
  },
  { 
    path: 'planets/saturn.glb', 
    name: 'Saturn', 
    description: 'Famous for its beautiful rings',
    longDescription: 'Saturn is famous for its stunning ring system made of ice particles, rocks, and dust. It is the least dense planet - light enough to float in water if there was a bathtub big enough. Saturn has over 80 moons, with Titan being larger than Mercury and having its own thick atmosphere.',
    glowColor: '240, 230, 140'
  },
  { 
    path: 'planets/uranus.glb', 
    name: 'Uranus', 
    description: 'The ice giant rotating on its side',
    longDescription: 'Uranus is an ice giant that rotates on its side at nearly 98 degrees, likely due to a massive collision long ago. This unique tilt causes extreme seasonal variations - each pole experiences 42 years of continuous sunlight followed by 42 years of darkness. Its blue-green color comes from methane in the atmosphere.',
    glowColor: '173, 216, 230'
  },
  { 
    path: 'planets/neptune.glb', 
    name: 'Neptune', 
    description: 'The windiest planet in our solar system',
    longDescription: 'Neptune is the windiest planet in our solar system with supersonic winds reaching speeds of 2,000 km/h. Its deep blue color comes from methane in the atmosphere. Despite being smaller than Uranus, Neptune is more massive due to its denser composition. It has 14 known moons and a faint ring system.',
    glowColor: '65, 105, 225'
  }
];

const INITIAL_RADIUS = 400;
const MIN_RADIUS = 300;
const MAX_RADIUS = 550;
let radius = INITIAL_RADIUS;
let canvasSize = 600;

let odrag = document.getElementById('drag-container');
let ospin = document.getElementById('spin-container');

ospin.style.width = canvasSize + "px";
ospin.style.height = canvasSize + "px";

let ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

const planetScenes = [];
const loader = new THREE.GLTFLoader();

const infoContainer = document.createElement('div');
infoContainer.id = 'planet-info-container';
document.body.appendChild(infoContainer);

planetFiles.forEach((planetData, index) => {
  const canvas = document.createElement('canvas');
  canvas.className = 'planet-canvas';
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  canvas.dataset.planetIndex = index;
  ospin.appendChild(canvas);
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 4;
  
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(canvasSize, canvasSize);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);
  
  let planetModel = null;
  
  loader.load(
    planetData.path,
    function(gltf) {
      planetModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(planetModel);
      const center = box.getCenter(new THREE.Vector3());
      planetModel.position.sub(center);
      const size = box.getSize(new THREE.Vector3()).length();
      const scale = 2 / size;
      planetModel.scale.setScalar(scale);
      scene.add(planetModel);
      console.log('✓ Geladen:', planetData.name);
    },
    function(progress) {
      console.log('Lade ' + planetData.name + ': ' + Math.round(progress.loaded / progress.total * 100) + '%');
    },
    function(error) {
      console.error('✗ Fehler bei', planetData.name, error);
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        roughness: 0.5,
        metalness: 0.2
      });
      planetModel = new THREE.Mesh(geometry, material);
      scene.add(planetModel);
    }
  );
  
  planetScenes.push({
    scene: scene,
    camera: camera,
    renderer: renderer,
    model: () => planetModel,
    planetData: planetData,
    canvas: canvas
  });
  
  canvas.style.filter = `drop-shadow(0 0 15px rgba(${planetData.glowColor}, 0.3)) drop-shadow(0 0 30px rgba(${planetData.glowColor}, 0.2))`;
});

function init(delayTime) {
  const canvases = document.querySelectorAll('.planet-canvas');
  canvases.forEach((canvas, i) => {
    const angle = i * (360 / canvases.length);
    canvas.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
    canvas.style.transition = "transform 1s";
    canvas.style.transitionDelay = delayTime || (canvases.length - i) / 4 + "s";
  });
}

setTimeout(() => init(), 1500);

let currentRotation = 0;
let stableFrontPlanetIndex = 0;
let carouselLocked = false;

function animate() {
  requestAnimationFrame(animate);
  
  planetScenes.forEach(item => {
    const model = item.model();
    if (model) {
      model.rotation.y += 0.01;
    }
    item.renderer.render(item.scene, item.camera);
  });
  
  updateFrontPlanet();
}
animate();

function updateFrontPlanet() {
  const numPlanets = planetScenes.length;
  const degreesPerPlanet = 360 / numPlanets;
  
  // Normalisiere die Rotation auf 0-360 Grad
  let normalizedRotation = currentRotation % 360;
  if (normalizedRotation < 0) normalizedRotation += 360;
  
  // Berechne welcher Planet vorne ist (mit Offset-Korrektur)
  // Da wir bei 0° starten und nach rechts drehen, müssen wir invertieren
  const adjustedRotation = (360 - normalizedRotation) % 360;
  const frontIndex = Math.round(adjustedRotation / degreesPerPlanet) % numPlanets;
  
  if (frontIndex !== stableFrontPlanetIndex) {
    stableFrontPlanetIndex = frontIndex;
    
    planetScenes.forEach((item, index) => {
      const canvas = item.canvas;
      const planetData = item.planetData;
      const isFrontPlanet = index === stableFrontPlanetIndex;
      
      if (isFrontPlanet) {
        canvas.style.opacity = '1';
        canvas.classList.add('front-planet');
        canvas.style.filter = `drop-shadow(0 0 20px rgba(${planetData.glowColor}, 0.5)) drop-shadow(0 0 40px rgba(${planetData.glowColor}, 0.3)) drop-shadow(0 0 60px rgba(${planetData.glowColor}, 0.2))`;
        canvas.style.zIndex = '100';
      } else {
        canvas.style.opacity = '0.6';
        canvas.classList.remove('front-planet');
        canvas.style.filter = `drop-shadow(0 0 15px rgba(${planetData.glowColor}, 0.3)) drop-shadow(0 0 30px rgba(${planetData.glowColor}, 0.2))`;
        canvas.style.zIndex = '1';
      }
    });
  }
  
  planetScenes.forEach((item, index) => {
    const canvas = item.canvas;
    const isFrontPlanet = index === stableFrontPlanetIndex;
    
    const baseTransform = canvas.style.transform.replace(/scale\([^)]*\)/g, '').trim();
    
    if (isFrontPlanet) {
      canvas.style.transform = baseTransform + ' scale(1.8)';
    } else {
      canvas.style.transform = baseTransform + ' scale(0.5)';
    }
  });
  
  if (stableFrontPlanetIndex !== null) {
    const item = planetScenes[stableFrontPlanetIndex];
    const planetData = item.planetData;
    const canvas = item.canvas;
    const rect = canvas.getBoundingClientRect();
    
    const planetCenterX = rect.left + rect.width / 2;
    const planetCenterY = rect.top + rect.height / 2;
    const fixedOffset = 200;
    
    infoContainer.style.display = 'block';
    infoContainer.style.left = planetCenterX + 'px';
    infoContainer.style.top = (planetCenterY + fixedOffset) + 'px';
    
    if (infoContainer.dataset.currentPlanet !== planetData.name) {
      infoContainer.dataset.currentPlanet = planetData.name;
      infoContainer.innerHTML = `
        <div class="planet-title">Planet</div>
        <div class="planet-name">${planetData.name}</div>
        <div class="planet-description">${planetData.description}</div>
        <button class="planet-button" data-planet="${planetData.name}">Learn more</button>
      `;
    }
  }
}

// =========================
// SCROLL-BASIERTE STEUERUNG
// =========================
let tX = 0;
let tY = 10;
const carouselSection = document.getElementById('carousel-section');
const scrollIndicator = document.getElementById('scroll-indicator');

function applyTransform(obj) {
  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

// Initiale Rotation setzen
applyTransform(odrag);

let hasCompletedRotation = false;
let isCarouselActive = false;

// Prüfe ob Carousel aktiv ist
function checkCarouselActive() {
  const carouselRect = carouselSection.getBoundingClientRect();
  isCarouselActive = carouselRect.top <= 100 && carouselRect.bottom >= window.innerHeight - 100;
  
  if (isCarouselActive && !hasCompletedRotation) {
    scrollIndicator.classList.add('hidden');
  } else if (!isCarouselActive) {
    scrollIndicator.classList.remove('hidden');
  }
}

// Überwache Scroll-Position
let scrollTimeout;
window.addEventListener('scroll', function() {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(checkCarouselActive, 10);
});

// Initiale Prüfung
checkCarouselActive();

// Mausrad für Rotation
document.addEventListener('wheel', function(e) {
  checkCarouselActive();
  
  if (isCarouselActive && !hasCompletedRotation) {
    // VERHINDERE KOMPLETT SCROLLEN während Carousel aktiv
    e.preventDefault();
    e.stopPropagation();
    
    // Shift + Scroll = Zoom
    if (e.shiftKey) {
      const delta = e.deltaY / 20;
      const newRadius = radius - delta;
      
      if (newRadius >= MIN_RADIUS && newRadius <= MAX_RADIUS) {
        radius = newRadius;
        init(0);
      }
    } 
    // Normales Scroll = Rotation
    else {
      const rotationAmount = e.deltaY * 0.15;
      currentRotation += rotationAmount;
      tX += rotationAmount;
      applyTransform(odrag);
      
      const totalRotated = Math.abs(currentRotation);
      
      // Nach 360° automatisch zur nächsten Section scrollen
      if (totalRotated >= 360 && !hasCompletedRotation) {
        hasCompletedRotation = true;
        carouselLocked = true;
        
        console.log('🎉 Volle Drehung abgeschlossen!');
        
        // Smooth scroll zur nächsten Section
        setTimeout(() => {
          const nextSection = carouselSection.nextElementSibling;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      }
    }
  }
}, { passive: false });

// Verhindere auch Touchpad-Scroll im Carousel
document.addEventListener('touchmove', function(e) {
  if (isCarouselActive && !hasCompletedRotation) {
    e.preventDefault();
  }
}, { passive: false });

// =========================
// MODAL FUNCTIONS
// =========================
let modalPlanetScene = null;

function openModal(planetName) {
  console.log('Opening modal for:', planetName);
  
  const planetData = planetFiles.find(p => p.name === planetName);
  if (!planetData) {
    console.error('Planet not found:', planetName);
    return;
  }
  
  const modal = document.getElementById('planet-detail-modal');
  if (!modal) {
    console.error('Modal element not found');
    return;
  }
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  const titleEl = document.getElementById('modal-planet-name');
  const descEl = document.getElementById('modal-planet-description');
  
  if (titleEl) titleEl.innerHTML = `PLANET<br>${planetData.name.toUpperCase()}`;
  if (descEl) descEl.textContent = planetData.longDescription;
  
  const canvas = document.getElementById('modal-planet-canvas');
  if (!canvas) {
    console.error('Modal canvas not found');
    return;
  }
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 4;
  
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(600, 600);
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);
  
  let planetModel = null;
  
  loader.load(
    planetData.path,
    function(gltf) {
      planetModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(planetModel);
      const center = box.getCenter(new THREE.Vector3());
      planetModel.position.sub(center);
      const size = box.getSize(new THREE.Vector3()).length();
      const scale = 2 / size;
      planetModel.scale.setScalar(scale);
      scene.add(planetModel);
    },
    undefined,
    function(error) {
      console.error('Error loading planet model:', error);
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(Math.random(), Math.random(), Math.random())
      });
      planetModel = new THREE.Mesh(geometry, material);
      scene.add(planetModel);
    }
  );
  
  function animateModal() {
    if (!modal.classList.contains('active')) return;
    requestAnimationFrame(animateModal);
    if (planetModel) {
      planetModel.rotation.y += 0.005;
    }
    renderer.render(scene, camera);
  }
  animateModal();
  
  modalPlanetScene = { scene, renderer };
}

function closeModal() {
  console.log('Closing modal');
  const modal = document.getElementById('planet-detail-modal');
  if (modal) {
    modal.classList.remove('active');
  }
  document.body.style.overflow = 'auto';
  
  if (modalPlanetScene) {
    modalPlanetScene.scene.clear();
    modalPlanetScene.renderer.dispose();
    modalPlanetScene = null;
  }
}

// Event Listeners
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('planet-button')) {
    const planetName = e.target.dataset.planet;
    console.log('Button clicked for planet:', planetName);
    if (planetName) {
      openModal(planetName);
    }
  }
  
  if (e.target && e.target.id === 'close-modal-btn') {
    closeModal();
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});

