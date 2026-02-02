/* FINAL VERSION 20260131_092704 */
/* Planeten Skalierung: 3.0 statt 2.2 (36% größer) */
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

const mainNav = document.querySelector('.main-navigation');

gsap.timeline({
  scrollTrigger: {
    trigger: '.wrapper',
    start: 'top top',
    end: '+=300%',
    pin: true,
    scrub: true,
    markers: false,
    onUpdate: (self) => {
      // Show navigation after 30% of tunnel animation
      if (self.progress > 0.3) {
        mainNav.classList.add('visible');
      } else {
        mainNav.classList.remove('visible');
      }
    }
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
.to('.hero .title .small:first-of-type', {
  opacity: 0,
  y: -50
}, '-<0.5')
.to('.hero .title .small:last-of-type', {
  opacity: 0,
  y: 50
}, '-<0.5')
.to('.hero .title .big', {
  opacity: 0,
  y: -100
}, '<0.4');

// =========================
// 3D PLANET CAROUSEL MIT GLB
// =========================
const planetFiles = [
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
  },
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
      
      // Saturn schief stellen (wie in Realität - ca. 26.7° Neigung)
      if (planetData.name === 'Saturn') {
        planetModel.rotation.z = Math.PI / 6.75; // ~26.7 Grad Neigung
        planetModel.rotation.x = Math.PI / 36;   // Zusätzliche leichte Neigung für Drama
        planetModel.scale.setScalar(scale * 1.8);  // Saturn ist jetzt 80% größer
        
        // Position MUSS nach sub(center) gesetzt werden - verwende += für relative Verschiebung
        planetModel.position.x += 0;  // Nach rechts verschieben
        planetModel.position.y += 0;    // Runter (-) / Hoch (+)
        planetModel.position.z += 0;    // Näher (-) / Weiter weg (+)
        
        console.log('Carousel Saturn Position:', planetModel.position.x);
      }
      
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
    
    // Berechne die aktuelle Position des Planeten im Kreis
    const currentAngle = (index * degreesPerPlanet - (360 - normalizedRotation)) % 360;
    
    // Berechne Z-Tiefe: Planeten näher an 0° oder 360° sind vorne
    const normalizedAngle = ((currentAngle + 360) % 360);
    let zDepth;
    
    if (normalizedAngle <= 180) {
      zDepth = Math.cos((normalizedAngle * Math.PI) / 180);
    } else {
      zDepth = Math.cos(((360 - normalizedAngle) * Math.PI) / 180);
    }
    
    // Z-Index: je höher zDepth (näher vorne), desto höher der z-index
    const calculatedZIndex = Math.round(50 + zDepth * 50);
    
    if (isFrontPlanet) {
      canvas.style.zIndex = '100';
    } else {
      canvas.style.zIndex = calculatedZIndex.toString();
    }
    
    const baseTransform = canvas.style.transform.replace(/scale\([^)]*\)/g, '').trim();
    
    if (isFrontPlanet) {
      // Front-Planet wird groß - mit Verzögerung
      canvas.style.transitionDelay = '0.3s';
      canvas.style.transform = baseTransform + ' scale(1.8)';
    } else {
      // Andere Planeten werden sofort klein (keine Verzögerung)
      canvas.style.transitionDelay = '0s';
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

// Hide scroll indicator permanently after first scroll
let hasScrolledOnce = false;
window.addEventListener('scroll', () => {
  if (!hasScrolledOnce && window.scrollY > 50) {
    hasScrolledOnce = true;
    gsap.to(scrollIndicator, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        scrollIndicator.style.display = 'none';
      }
    });
  }
});

function applyTransform(obj) {
  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

// Initiale Rotation setzen
applyTransform(odrag);

let hasCompletedRotation = false;
let isCarouselActive = false;
let previousCarouselState = false;

// Prüfe ob Carousel aktiv ist
function checkCarouselActive() {
  const carouselRect = carouselSection.getBoundingClientRect();
  isCarouselActive = carouselRect.top <= 100 && carouselRect.bottom >= window.innerHeight - 100;
  
  // Reset carousel wenn wir die Section verlassen haben
  if (previousCarouselState && !isCarouselActive) {
    console.log('🔄 Resetting carousel...');
    hasCompletedRotation = false;
    carouselLocked = false;
    currentRotation = 0;
    tX = 0;
    tY = 10;
    applyTransform(odrag);
    console.log('✓ Carousel reset complete');
  }
  
  previousCarouselState = isCarouselActive;
  
  if (isCarouselActive && !hasCompletedRotation) {
    scrollIndicator.classList.add('hidden');
  } else if (!isCarouselActive && !hasScrolledOnce) {
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
    
    // Rückkehr false um sicherzustellen dass nichts durchkommt
    return false;
  }
}, { passive: false });

// Verhindere auch Touchpad-Scroll im Carousel
document.addEventListener('touchmove', function(e) {
  if (isCarouselActive && !hasCompletedRotation) {
    e.preventDefault();
    return false;
  }
}, { passive: false });

// Zusätzlich: Verhindere Scroll-Events komplett
document.addEventListener('scroll', function(e) {
  if (isCarouselActive && !hasCompletedRotation) {
    // Scroll zur Carousel-Position zurücksetzen
    const carouselTop = carouselSection.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: carouselTop,
      behavior: 'auto'
    });
  }
}, { passive: false });

// =========================
// ASTEROID ANIMATION (angepasst für zentrierte Canvas-Größe)
// =========================
const asteroidCanvas = document.getElementById('asteroid-canvas');
const asteroidContent = document.querySelector('.asteroid-content');

// Funktion zum Initialisieren des Asteroiden
function initAsteroid() {
  if (!asteroidCanvas) return;
  
  // Versuche die Größe vom Orbit-Kreis zu übernehmen (falls vorhanden)
  const orbitEl = document.querySelector('.orbit-circle');
  const baseSize = orbitEl ? Math.min(orbitEl.clientWidth, orbitEl.clientHeight) : Math.min(window.innerWidth, window.innerHeight);
  const size = Math.max(200, Math.min(800, baseSize)); // clamp für vernünftige Werte

  // Setze Canvas-Attribute (Pixelauflösung) UND CSS-Größe (für Layout)
  asteroidCanvas.width = size;
  asteroidCanvas.height = size;
  asteroidCanvas.style.width = size + 'px';
  asteroidCanvas.style.height = size + 'px';

  const asteroidScene = new THREE.Scene();
  const asteroidCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000); // quadratisch -> aspect = 1
  asteroidCamera.position.set(0, 0, 6); // näher dran (angepasst an kleinere Canvas)
  asteroidCamera.lookAt(0, 0, 0);
  
  const asteroidRenderer = new THREE.WebGLRenderer({ 
    canvas: asteroidCanvas,
    alpha: true,
    antialias: true
  });
  asteroidRenderer.setPixelRatio(window.devicePixelRatio);
  asteroidRenderer.setSize(size, size); // quadratische Renderfläche
  
  // Licht Setup
  const asteroidAmbientLight = new THREE.AmbientLight(0xffffff, 0.4);
  asteroidScene.add(asteroidAmbientLight);
  
  const asteroidDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  asteroidDirectionalLight.position.set(5, 5, 5);
  asteroidScene.add(asteroidDirectionalLight);
  
  // Rim Light für dramatischen Effekt
  const rimLight = new THREE.DirectionalLight(0x8a2be2, 0.8);
  rimLight.position.set(-5, 0, -5);
  asteroidScene.add(rimLight);
  
  let asteroidModel = null;
  let asteroidGroup = new THREE.Group();
  asteroidScene.add(asteroidGroup);
  
  // Setze Asteroid direkt in die Mitte des Kreises
  asteroidGroup.position.set(0, 0, 0);
  asteroidGroup.scale.set(1, 1, 1);
  
  // Lade deine GLB Datei
  loader.load(
    'planets/asteroid.glb',
    function(gltf) {
      asteroidModel = gltf.scene;
      
      // Zentriere und skaliere das Modell
      const box = new THREE.Box3().setFromObject(asteroidModel);
      const center = box.getCenter(new THREE.Vector3());
      asteroidModel.position.sub(center);
      
      const sizeBox = box.getSize(new THREE.Vector3()).length();
      const scale = 3.5 / sizeBox; // angepasste Skalierung für das Canvas
      asteroidModel.scale.setScalar(scale);
      
      asteroidGroup.add(asteroidModel);
      console.log('✓ Asteroid geladen');
    },
    function(progress) {
      if (progress.total) {
        console.log('Lade Asteroid: ' + Math.round(progress.loaded / progress.total * 100) + '%');
      }
    },
    function(error) {
      console.error('✗ Fehler beim Laden des Asteroiden:', error);
      // Fallback: Erstelle einen einfachen Asteroid
      const geometry = new THREE.DodecahedronGeometry(2, 1);
      const material = new THREE.MeshStandardMaterial({
        color: 0x8b7355,
        roughness: 0.9,
        metalness: 0.1
      });
      asteroidModel = new THREE.Mesh(geometry, material);
      asteroidGroup.add(asteroidModel);
    }
  );
  
  // Partikel-Effekt für Weltraum-Staub
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 50;
    positions[i + 1] = (Math.random() - 0.5) * 50;
    positions[i + 2] = (Math.random() - 0.5) * 50;
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x888888,
    size: 0.05,
    transparent: true,
    opacity: 0.6
  });
  
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  asteroidScene.add(particles);
  
  // Animation Loop
  let isAsteroidActive = false;
  
  function animateAsteroid() {
    requestAnimationFrame(animateAsteroid);
    
    // Nur rendern wenn die Section aktiv ist
    const asteroidSection = document.getElementById('asteroid-section');
    if (asteroidSection && asteroidSection.classList.contains('active')) {
      isAsteroidActive = true;
      // Partikel Bewegung
      particles.rotation.y += 0.0005;
      
      // Asteroid rotiert langsam
      if (asteroidModel) {
        asteroidGroup.rotation.y += 0.003;
        asteroidGroup.rotation.x += 0.001;
      }
      
      asteroidRenderer.render(asteroidScene, asteroidCamera);
    } else if (isAsteroidActive) {
      // Section wurde gerade deaktiviert - einmal leeren Canvas rendern
      asteroidRenderer.clear();
      isAsteroidActive = false;
    }
  }
  animateAsteroid();
  
  // Resize Handler: passt Canvas und Renderer an (nutzt Orbit-Kreis falls vorhanden)
  function handleResize() {
    const orbitEl = document.querySelector('.orbit-circle');
    const baseSize = orbitEl ? Math.min(orbitEl.clientWidth, orbitEl.clientHeight) : Math.min(window.innerWidth, window.innerHeight);
    const newSize = Math.max(200, Math.min(800, baseSize));
    asteroidCanvas.width = newSize;
    asteroidCanvas.height = newSize;
    asteroidCanvas.style.width = newSize + 'px';
    asteroidCanvas.style.height = newSize + 'px';
    asteroidCamera.aspect = 1;
    asteroidCamera.updateProjectionMatrix();
    asteroidRenderer.setSize(newSize, newSize);
  }
  window.addEventListener('resize', handleResize);
}

/* DEAKTIVIERT - Verwende stattdessen das neue System unten
// =========================
// ASTEROID INITIALISIERUNG
// =========================
let asteroidInitialized = false;

// Warte bis Carousel fertig ist
ScrollTrigger.create({
  trigger: '#carousel-section',
  start: 'bottom top',
  once: true,
  onEnter: () => {
    console.log('✓ Carousel abgeschlossen');
    
    // Jetzt Asteroid initialisieren
    if (!asteroidInitialized) {
      asteroidInitialized = true;
      initAsteroid();
      console.log('✓ Asteroid initialisiert');
    }
  }
});
*/

/* DEAKTIVIERT - Verwende stattdessen das System bei Zeile 1227
// Asteroid Section Trigger - Pinterest Style Animation
ScrollTrigger.create({
  trigger: '#asteroid-section',
  start: 'center center',
  end: 'bottom top',
  onEnter: () => {
    console.log('✓ Asteroid Section ENTER - starte Animation');
    
    // SCHRITT 1: Asteroid fliegt von links ein (1.8s)
    gsap.to('#asteroid-canvas', {
      opacity: 1,
      x: 0,
      duration: 1.8,
      ease: 'power3.out',
      onComplete: () => {
        console.log('✓ Asteroid angekommen - Kreis bildet sich');
        
        // SCHRITT 2: Kurze Pause, dann Kreis bildet sich
        setTimeout(() => {
          // Ring erscheint
          gsap.to('.orbit-ring', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          });
          
          // Kreis wird gezeichnet
          gsap.to('.orbit-circle-line', {
            strokeDashoffset: 0,
            duration: 2.5,
            ease: 'power2.inOut'
          });
        }, 400); // 0.4s Pause
      }
    });
  },
  onLeave: () => {
    console.log('✗ Asteroid Section LEAVE');
  },
  onEnterBack: () => {
    console.log('✓ Asteroid Section ENTER BACK');
    gsap.to('#asteroid-canvas', { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' });
    gsap.to('.orbit-ring', { opacity: 1, duration: 0.6, ease: 'power2.out' });
    gsap.to('.orbit-circle-line', { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' });
  },
  onLeaveBack: () => {
    console.log('✗ Asteroid Section LEAVE BACK');
    gsap.to('#asteroid-canvas', { opacity: 0, x: -300, duration: 0.5, ease: 'power2.in' });
    gsap.to('.orbit-ring', { opacity: 0, duration: 0.3 });
    setTimeout(() => gsap.set('.orbit-circle-line', { strokeDashoffset: 1884 }), 500);
  }
});
*/

/* DEAKTIVIERT - Gehört zum alten System
// Initiale Position setzen (Asteroid links außerhalb, unsichtbar)
gsap.set('#asteroid-canvas', { opacity: 0, x: -300 });
gsap.set('.orbit-ring', { opacity: 0 });
gsap.set('.orbit-circle-line', { strokeDashoffset: 1884 });
*/

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
  
  // Texte setzen BEVOR das Modal öffnet
  const titleEl = document.getElementById('modal-planet-name');
  const descEl = document.getElementById('modal-planet-description');
  const smallTitleEl = document.querySelector('.modal-small-title');
  
  if (titleEl) titleEl.innerHTML = `PLANET<br>${planetData.name.toUpperCase()}`;
  if (descEl) descEl.textContent = planetData.longDescription;
  
  // Stelle sicher, dass Modal display: block hat
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Force reflow um sicherzustellen dass die initialen Styles angewendet werden
  void modal.offsetHeight;
  
  // Canvas holen und vorbereiten BEVOR active gesetzt wird
  const canvas = document.getElementById('modal-planet-canvas');
  if (!canvas) {
    console.error('Modal canvas not found');
    return;
  }
  
  // Canvas context clearen
  const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (ctx) {
    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
  }
  
  // Cleanup alte Scene falls vorhanden
  if (modalPlanetScene) {
    if (modalPlanetScene.animationId) {
      cancelAnimationFrame(modalPlanetScene.animationId);
    }
    if (modalPlanetScene.scene) {
      modalPlanetScene.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      modalPlanetScene.scene.clear();
    }
    if (modalPlanetScene.renderer) {
      modalPlanetScene.renderer.dispose();
    }
    modalPlanetScene = null;
  }
  
  // Jetzt Modal active setzen (triggert Text-Animation)
  requestAnimationFrame(() => {
    modal.classList.add('active');
  });
  
  // Neue Scene erstellen
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 0, 5.5); // Weiter weg damit Saturn-Ringe komplett sichtbar (war 4)
  camera.lookAt(0, 0, 0);
  
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(600, 600);
  renderer.setClearColor(0x000000, 0);
  
  // Besseres Licht-Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
  mainLight.position.set(5, 5, 5);
  scene.add(mainLight);
  
  const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
  backLight.position.set(-5, -3, -5);
  scene.add(backLight);
  
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
  fillLight.position.set(0, -5, 3);
  scene.add(fillLight);
  
  // Glow color für diesen Planeten
  const glowRGB = planetData.glowColor.split(',').map(c => parseInt(c.trim()) / 255);
  
  // Rim light in planet color
  const rimLight = new THREE.DirectionalLight(
    new THREE.Color(glowRGB[0], glowRGB[1], glowRGB[2]), 
    0.5
  );
  rimLight.position.set(-3, 0, -3);
  scene.add(rimLight);
  
  let planetModel = null;
  let animationId = null;
  let animationState = { shouldAnimate: true };
  
  // Animation Funktion
  function animateModal() {
    if (!animationState.shouldAnimate) {
      if (animationId) cancelAnimationFrame(animationId);
      return;
    }
    
    animationId = requestAnimationFrame(animateModal);
    
    if (planetModel) {
      planetModel.rotation.y += 0.005;
    }
    
    renderer.render(scene, camera);
  }
  
  // Starte Animation sofort (auch wenn Model noch lädt)
  animateModal();
  
  // Lade das GLB Model
  console.log('⏳ Lade Modal Planet:', planetData.name, 'von', planetData.path);
  
  loader.load(
    planetData.path,
    // onLoad
    function(gltf) {
      console.log('✓ GLB geladen für:', planetData.name);
      
      planetModel = gltf.scene;
      
      // Zentrieren
      const box = new THREE.Box3().setFromObject(planetModel);
      const center = box.getCenter(new THREE.Vector3());
      planetModel.position.sub(center);
      
      // Skalieren - GRÖSSER für bessere Sichtbarkeit
      const size = box.getSize(new THREE.Vector3()).length();
      const scale = 3.0 / size;  // 3.0 statt 2.2 = ca. 36% größer
      planetModel.scale.setScalar(scale);
      
      // Saturn special treatment - WICHTIG: Nach dem Zentrieren verschieben!
      if (planetData.name === 'Saturn') {
        planetModel.rotation.z = Math.PI / 6.75;
        planetModel.rotation.x = Math.PI / 36;
        planetModel.scale.setScalar(scale * 1.8);  // Saturn bleibt proportional größer
        
        // Position MUSS nach sub(center) gesetzt werden
        planetModel.position.x += 0;  // Zentriert
        planetModel.position.y += 0;
        planetModel.position.z += 0;
        
        // Kamera weiter weg für Saturn damit Ringe sichtbar sind
        camera.position.set(0, 0, 5.5);
        camera.lookAt(0, 0, 0);
        
        console.log('Saturn Position gesetzt:', planetModel.position.x);
      } else {
        // Für alle anderen Planeten: Kamera näher für größere Ansicht
        camera.position.set(0, 0, 4);
        camera.lookAt(0, 0, 0);
      }
      
      scene.add(planetModel);
      console.log('✓ Planet zu Scene hinzugefügt:', planetData.name);
    },
    // onProgress
    function(xhr) {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log('Lade', planetData.name + ':', Math.round(percentComplete) + '%');
      }
    },
    // onError
    function(error) {
      console.error('✗✗✗ FEHLER beim Laden von', planetData.name, ':', error);
      console.error('Path war:', planetData.path);
      
      // Fallback: Farbige Kugel
      console.log('Erstelle Fallback-Sphere für', planetData.name);
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(glowRGB[0], glowRGB[1], glowRGB[2]),
        roughness: 0.8,
        metalness: 0.2,
        emissive: new THREE.Color(glowRGB[0], glowRGB[1], glowRGB[2]),
        emissiveIntensity: 0.2
      });
      planetModel = new THREE.Mesh(geometry, material);
      scene.add(planetModel);
      console.log('✓ Fallback Sphere erstellt');
    }
  );
  
  // Speichere Scene für später
  modalPlanetScene = { 
    scene, 
    renderer, 
    camera, 
    canvas,
    animationId,
    animationState
  };
}

function closeModal() {
  console.log('Closing modal');
  const modal = document.getElementById('planet-detail-modal');
  if (modal) {
    modal.classList.remove('active');
    // Warte bis Animation fertig ist, dann setze display: none
    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        modal.style.display = 'none';
      }
    }, 500);
  }
  document.body.style.overflow = 'auto';
  
  if (modalPlanetScene) {
    // Stop animation using flag
    if (modalPlanetScene.animationState) {
      modalPlanetScene.animationState.shouldAnimate = false;
    }
    if (modalPlanetScene.animationId) {
      cancelAnimationFrame(modalPlanetScene.animationId);
    }
    
    // Properly dispose of Three.js resources
    if (modalPlanetScene.scene) {
      modalPlanetScene.scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      modalPlanetScene.scene.clear();
    }
    if (modalPlanetScene.renderer) {
      modalPlanetScene.renderer.dispose();
    }
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

// =========================
// NAVIGATION MENU
// =========================
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

// Smooth scroll to section
navItems.forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    // Manually update active state immediately on click
    navItems.forEach(navItem => navItem.classList.remove('active'));
    this.classList.add('active');
    
    // Special handling for Tunnel/Hero - scroll to very top
    if (targetId === '#hero-section') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    // For other sections, use normal scrollIntoView
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Einfache ScrollSpy Navigation
function updateActiveNav() {
  const scrollPos = window.scrollY + 300; // Offset für bessere Erkennung
  
  const sections = [
    { id: 'hero-section', element: document.getElementById('hero-section') },
    { id: 'carousel-section', element: document.getElementById('carousel-section') },
    { id: 'asteroid-section', element: document.getElementById('asteroid-section') },
    { id: 'exit-tunnel-section', element: document.getElementById('exit-tunnel-section') }
  ];
  
  let activeId = 'hero-section';
  
  // Finde die Section, in der wir uns befinden
  sections.forEach(section => {
    if (section.element) {
      const rect = section.element.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionBottom = sectionTop + rect.height;
      
      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        activeId = section.id;
      }
    }
  });
  
  // Update Menü
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${activeId}`) {
      item.classList.add('active');
    }
  });
}

// Scroll Event
let scrollTimeout2;
window.addEventListener('scroll', function() {
  clearTimeout(scrollTimeout2);
  scrollTimeout2 = setTimeout(updateActiveNav, 50);
});

// Initial check
updateActiveNav();

// =========================
// ASTEROID SECTION - SMOOTH ENTRY FROM RIGHT
// =========================
(function initAsteroidSection() {
  const section = document.getElementById('asteroid-section');
  
  if (!section) {
    console.warn('Asteroid section not found');
    return;
  }

  // Create canvas dynamically
  const canvas = document.createElement('canvas');
  canvas.id = 'asteroid-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '65%';  // Weiter unten (war 50% = Mitte)
  canvas.style.left = '150%'; // START WEIT RECHTS (außerhalb des Screens)
  canvas.style.transform = 'translate(-50%, -50%)';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '2';
  section.appendChild(canvas);

  // ==================
  // THREE.JS SETUP
  // ==================
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000); // ORIGINAL FOV 45
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setClearColor(0x000000, 0); // Completely transparent
  
  // Set size
  const canvasSize = Math.min(700, window.innerWidth * 0.9, window.innerHeight * 0.9); // ORIGINAL Größe
  renderer.setSize(canvasSize, canvasSize);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ==================
  // LIGHTING - Dramatic Space Lighting
  // ==================
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Reduziert für mehr Drama
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(6, 4, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8a2be2, 0.8);
  fillLight.position.set(-4, 2, -4);
  scene.add(fillLight);

  // HAUPTLICHT VON UNTEN - wie im Pinterest Video!
  const bottomLight = new THREE.PointLight(0xffffff, 3.5); // Starkes weißes Licht
  bottomLight.position.set(0, -8, 3); // Von UNTEN (negative Y)
  scene.add(bottomLight);
  
  // Zusätzliches Bottom Rim Light für mehr Glow
  const bottomRimLight = new THREE.PointLight(0xaa88ff, 2.0);
  bottomRimLight.position.set(0, -6, 2);
  scene.add(bottomRimLight);

  // ==================
  // LOAD ASTEROID GLB
  // ==================
  let asteroid = null;
  const loader = new THREE.GLTFLoader();

  loader.load(
    'planets/asteroid.glb',
    function(gltf) {
      asteroid = gltf.scene;
      
      // Center the model
      const box = new THREE.Box3().setFromObject(asteroid);
      const center = box.getCenter(new THREE.Vector3());
      asteroid.position.sub(center);
      
      // Scale to good size
      const size = box.getSize(new THREE.Vector3()).length();
      const scale = 8.0 / size;  // ORIGINAL Größe
      asteroid.scale.setScalar(scale);
      
      // Position bleibt in der Mitte (0, 0, 0) - das CANVAS bewegt sich!
      asteroid.position.set(0, 0, 0);
      
      // WICHTIG: Starte unsichtbar
      asteroid.visible = false;
      
      scene.add(asteroid);
      console.log('✓ Asteroid GLB loaded - ready for animation');
    },
    function(xhr) {
      if (xhr.lengthComputable) {
        console.log('Loading Asteroid: ' + Math.round((xhr.loaded / xhr.total) * 100) + '%');
      }
    },
    function(error) {
      console.error('✗ Error loading asteroid GLB:', error);
      
      // Fallback: Create procedural asteroid
      const geometry = new THREE.IcosahedronGeometry(2.8, 2);  // Größerer Radius (war 2)
      const positions = geometry.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const vertex = new THREE.Vector3(
          positions.getX(i),
          positions.getY(i),
          positions.getZ(i)
        );
        const noise = (Math.random() * 0.4 - 0.2) * vertex.length();
        vertex.multiplyScalar(1 + noise);
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        roughness: 0.8,
        metalness: 0.2,
        emissive: 0x8a2be2,
        emissiveIntensity: 0.15
      });

      asteroid = new THREE.Mesh(geometry, material);
      asteroid.position.set(0, 0, 0); // Mitte - das CANVAS bewegt sich!
      asteroid.visible = false; // WICHTIG: Starte unsichtbar
      scene.add(asteroid);
      console.log('✓ Fallback asteroid created - ready for animation');
    }
  );

  // ==================
  // ANIMATION STATE
  // ==================
  let animationStarted = false;
  let time = 0;

  // ==================
  // ANIMATION LOOP
  // ==================
  function animate() {
    requestAnimationFrame(animate);
    
    if (!asteroid) {
      renderer.render(scene, camera);
      return;
    }

    time += 0.01;

    // Kontinuierliche langsame Rotation wenn aktiviert
    if (animationStarted) {
      asteroid.rotation.z += 0.001; // Nur Z-Achse für subtile Drehung
    }

    renderer.render(scene, camera);
  }

  animate();

  // ==================
  // SCROLL TRIGGER - Basierend auf Wrapper Scroll Progress
  // ==================
  
  // Variable um zu tracken ob Animation schon gelaufen ist
  let hasAnimated = false;
  let asteroidTimeline = null;
  let orbitRing = null;
  let asteroidTitle = null;
  let asteroidFacts = null;
  
  // Reset-Funktion für Asteroid Animation
  function resetAsteroidAnimation() {
    console.log('🔄 Resetting asteroid animation...');
    
    // Kill timeline wenn vorhanden
    if (asteroidTimeline) {
      asteroidTimeline.kill();
      asteroidTimeline = null;
    }
    
    // Entferne Orbit Ring
    if (orbitRing) {
      orbitRing.remove();
      orbitRing = null;
    }
    
    // Entferne Title
    if (asteroidTitle) {
      asteroidTitle.remove();
      asteroidTitle = null;
    }
    
    // Entferne Facts
    if (asteroidFacts) {
      asteroidFacts.remove();
      asteroidFacts = null;
    }
    
    // Reset Asteroid Position
    if (asteroid) {
      asteroid.visible = false;
      asteroid.rotation.set(0, 0, 0);
      gsap.set(canvas.style, {
        left: '150%',
        top: '45%'
      });
    }
    
    // Reset States
    hasAnimated = false;
    animationStarted = false;
    
    console.log('✓ Asteroid animation reset complete');
  }
  
  // Wir müssen auf den SCROLL-PROGRESS der gepinnten Wrapper reagieren
  // Da Wrapper für 300% gepinnt ist, müssen wir weit nach hinten triggern
  ScrollTrigger.create({
    trigger: '.wrapper',         // Trigger auf die WRAPPER (die ist gepinnt!)
    start: 'top top',            
    end: '+=300%',               // Wrapper ist für 300% gepinnt
    scrub: true,
    onUpdate: (self) => {
      // Reset wenn wir vor 65% sind
      if (self.progress < 0.65 && hasAnimated) {
        resetAsteroidAnimation();
      }
      
      // Triggere bei 65% des Scroll-Progress - früher Start für mehr Zeit
      if (self.progress > 0.65 && !hasAnimated && asteroid) {
        hasAnimated = true;
        console.log('🪨 Starting asteroid animation from RIGHT! Progress:', self.progress);
        
        // Mache Asteroid sichtbar
        asteroid.visible = true;
        animationStarted = true;
        
        // GSAP Animation: Weltraum-Flugbahn mit Kurve!
        // Timeline für synchronisierte Bewegung
        asteroidTimeline = gsap.timeline();
        
        // Horizontale Bewegung von rechts zur Mitte
        asteroidTimeline.fromTo(canvas.style, 
          { 
            left: '150%',  // Start: Weit rechts außerhalb
            top: '45%'     // Start: Etwas höher
          },
          { 
            left: '49%',   // End: Exakt wie Orbit-Ring (war 50%)
            top: '69%',    // End: Exakt wie Orbit-Ring (war 65%)
            duration: 1.6, // Noch langsamer (war 1.2)
            ease: 'power1.out',  // Sanfteres, smootheres Easing
            onUpdate: function() {
              console.log('Canvas position:', canvas.style.left, canvas.style.top);
            },
            onComplete: () => {
              console.log('✓ Asteroid reached center!');
              
              // JETZT: Orbit-Ring Animation starten (wie im Pinterest Video)
              createOrbitRing();
            }
          }
        );
        
        // Gleichzeitig: Wilde Rotation während der Bewegung (taumelnder Asteroid!)
        gsap.to(asteroid.rotation, {
          y: Math.PI * 2,    // Weniger Rotation für smootheren Effekt (war 3)
          x: Math.PI * 1,    // Reduziert (war 1.5)
          z: Math.PI * 0.5,  // Reduziert (war 0.8)
          duration: 1.6,     // Angepasst an neue Bewegungsdauer (war 1.2)
          ease: 'power1.out' // Sanfteres Easing
        });
      }
    }
  });

  // ==================
  // RESPONSIVE HANDLING
  // ==================
  function handleResize() {
    const size = Math.min(700, window.innerWidth * 0.9, window.innerHeight * 0.9);
    renderer.setSize(size, size);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', handleResize);
  handleResize();
  
  // ==================
  // ORBIT RING ANIMATION (Pinterest Style)
  // ==================
  function createOrbitRing() {
    console.log('🌀 Creating orbit ring...');
    
    // Erstelle SVG für den Orbit-Ring
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    orbitRing = svg; // Store reference for cleanup
    svg.style.position = 'fixed';
    svg.style.top = '69%';   // ← Y-POSITION (vertikal): 65% = weiter unten, 50% = Mitte, 30% = oben
    svg.style.left = '49%';  // ← X-POSITION (horizontal): 50% = Mitte, 60% = rechts, 40% = links
    svg.style.transform = 'translate(-50%, -50%)';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1';
    svg.setAttribute('width', '1200');
    svg.setAttribute('height', '1200');
    
    // Circle Element - startet GROSS und schrumpft
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '600');
    circle.setAttribute('cy', '600');
    circle.setAttribute('r', '800'); // Startet sehr groß
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'rgba(255, 255, 255, 0.6)'); // Etwas transparenter
    circle.setAttribute('stroke-width', '0.5'); // Noch dünner - subtiler Ring
    circle.style.opacity = '0'; // Startet unsichtbar
    
    svg.appendChild(circle);
    section.appendChild(svg);
    
    // GSAP Animation - Ring faded ein UND schrumpft zur finalen Größe (wie im Pinterest Video)
    gsap.to(circle.style, {
      opacity: 1,
      duration: 0.5,  // Angepasst an 1.6s Asteroid-Animation (war 0.4)
      ease: 'power2.out'
    });
    
    gsap.to(circle, {
      attr: { 'r': 280 }, // Schrumpft auf finale Größe
      duration: 1.8,      // Angepasst an 1.6s Asteroid-Animation (war 1.4)
      ease: 'power3.out',
      onComplete: () => {
        console.log('✓✓✓ ORBIT RING COMPLETE - CALLING showAsteroidTitle() NOW! ✓✓✓');
        // JETZT: Überschrift erscheinen lassen!
        showAsteroidTitle();
      }
    });
  }
  
  // ==================
  // ASTEROID ÜBERSCHRIFT ANIMATION
  // ==================
  function showAsteroidTitle() {
    console.log('✨✨✨ SHOWING ASTEROID TITLE FUNCTION CALLED! ✨✨✨');
    
    // Erstelle Überschrift Container
    const titleContainer = document.createElement('div');
    asteroidTitle = titleContainer; // Store reference for cleanup
    titleContainer.id = 'asteroid-title';
    titleContainer.style.position = 'absolute';
    titleContainer.style.left = '10%';
    titleContainer.style.top = '0%'; // Weiter oben (war 10%)
    titleContainer.style.zIndex = '10';
    titleContainer.style.opacity = '0';
    
    // Haupttitel
    const mainTitle = document.createElement('h1');
    mainTitle.textContent = 'ASTEROID';
    mainTitle.style.fontFamily = "'Ethnocentric', sans-serif";
    mainTitle.style.fontSize = 'clamp(3rem, 8vw, 6rem)';
    mainTitle.style.color = '#ffffff';
    mainTitle.style.margin = '0';
    mainTitle.style.letterSpacing = '0.1em';
    mainTitle.style.lineHeight = '1';
    mainTitle.style.textTransform = 'uppercase';
    mainTitle.style.textShadow = '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(138, 43, 226, 0.3)';
    
    // Untertitel
    const subtitle = document.createElement('p');
    subtitle.textContent = 'WHAT\'S FASCINATING';
    subtitle.style.fontFamily = "'Satoshi', sans-serif";
    subtitle.style.fontSize = 'clamp(0.9rem, 2vw, 1.2rem)';
    subtitle.style.color = 'rgba(255, 255, 255, 0.7)';
    subtitle.style.margin = '15px 0 0 0';
    subtitle.style.letterSpacing = '0.3em';
    subtitle.style.fontWeight = '300';
    
    titleContainer.appendChild(mainTitle);
    titleContainer.appendChild(subtitle);
    
    // An SECTION anhängen damit es mitscrollt!
    section.appendChild(titleContainer);
    console.log('✓ Title container appended to section');
    
    // GSAP Animation - Fetter Fade-in mit Slide
    gsap.to(titleContainer, {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2,
      onStart: () => console.log('▶ Title fade-in started'),
      onComplete: () => console.log('✓ Title fade-in complete')
    });
    
    // Main Title - leichter Zoom-in Effekt
    gsap.from(mainTitle, {
      scale: 0.9,
      duration: 1.2,
      ease: 'back.out(1.2)',
      delay: 0.2
    });
    
    // Subtitle - kommt etwas später
    gsap.from(subtitle, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.6,
      onComplete: () => {
        // Nach der Überschrift: Zeige die Fakten!
        showAsteroidFacts();
      }
    });
  }
  
  // ==================
  // ASTEROID FAKTEN - GLASSMORPHISM CARDS
  // ==================
  function showAsteroidFacts() {
    console.log('📊📊📊 CREATING ASTEROID FACTS CARDS! 📊📊📊');
    
    const facts = [
      {
        title: "Composition",
        text: "Made of rock, metal, and ice"
      },
      {
        title: "Orbit",
        text: "Between Mars and Jupiter"
      },
      {
        title: "Age",
        text: "Over 4.5 billion years old"
      },
      {
        title: "Size",
        text: "From meters to hundreds of kilometers"
      }
    ];
    
    // Container für alle Cards
    const factsContainer = document.createElement('div');
    asteroidFacts = factsContainer; // Store reference for cleanup
    factsContainer.id = 'asteroid-facts-container';
    factsContainer.style.position = 'absolute';
    factsContainer.style.bottom = '40%'; // Viel weiter oben (war 5%)
    factsContainer.style.left = '50%';
    factsContainer.style.transform = 'translateX(-50%)';
    factsContainer.style.width = '90%';
    factsContainer.style.maxWidth = '1000px';
    factsContainer.style.display = 'grid';
    factsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
    factsContainer.style.gap = '24px';
    factsContainer.style.padding = '20px';
    factsContainer.style.zIndex = '100';
    
    section.appendChild(factsContainer); // An SECTION damit es mitscrollt!
    console.log('✓ Facts container created and appended to body');
    
    // Erstelle jede Card
    facts.forEach((fact, index) => {
      const card = document.createElement('div');
      card.className = 'fact-card';
      card.style.position = 'relative';
      card.style.padding = '30px 24px';
      card.style.borderRadius = '20px';
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      
      // Glassmorphism Effect
      card.style.background = 'rgba(255, 255, 255, 0.06)';
      card.style.backdropFilter = 'blur(10px) saturate(180%)';
      card.style.webkitBackdropFilter = 'blur(10px) saturate(180%)';
      card.style.border = '1px solid rgba(255, 255, 255, 0.15)';
      card.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.03)';
      
      // Title
      const title = document.createElement('h3');
      title.textContent = fact.title;
      title.style.fontFamily = "'Ethnocentric', sans-serif";
      title.style.fontSize = '14px';
      title.style.color = 'rgba(138, 43, 226, 0.9)'; // Lila Akzent
      title.style.marginBottom = '12px';
      title.style.letterSpacing = '1px';
      title.style.textTransform = 'uppercase';
      
      // Text
      const text = document.createElement('p');
      text.textContent = fact.text;
      text.style.fontFamily = "'Satoshi', sans-serif";
      text.style.fontSize = '15px';
      text.style.color = 'rgba(255, 255, 255, 0.85)';
      text.style.lineHeight = '1.6';
      text.style.margin = '0';
      
      card.appendChild(title);
      card.appendChild(text);
      factsContainer.appendChild(card);
      
      console.log(`✓ Card ${index + 1} created: ${fact.title}`);
      
      // Animiere die Card mit Verzögerung
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.4 + (index * 0.15), // Früher (war 0.8)
        ease: 'power3.out',
        onStart: () => console.log(`▶ Animating card ${index + 1}: ${fact.title}`),
        onComplete: () => console.log(`✓ Card ${index + 1} animation complete`)
      });
    });
    
    console.log('✓✓✓ ALL ASTEROID FACTS CARDS CREATED! ✓✓✓');
  }

})();

// =========================
// EXIT TUNNEL ANIMATION - Text starts BIG, scales DOWN
// =========================
gsap.timeline({
  scrollTrigger: {
    trigger: '.exit-tunnel-section',
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: true,
    markers: false
  }
})
// PHASE 1: Text ist am Anfang GROẞ (3.5x) und wird kleiner
.fromTo('.exit-title', 
  {
    scale: 3.5,  // Startet groß
    opacity: 1
  },
  {
    scale: 1,    // Wird normal groß
    duration: 0.6
  }
)
// PHASE 2: Kleine Texte erscheinen während der Text kleiner wird
.from('.exit-title .exit-small:first-of-type', {
  opacity: 0,
  y: -30,
  duration: 0.4
}, '-=0.3')
.from('.exit-title .exit-small:last-of-type', {
  opacity: 0,
  y: 30,
  duration: 0.4
}, '-=0.3')
// PHASE 3: Tunnel fliegt ZURÜCK (umgekehrt wie Intro)
.to('.tunnel img', {
  scale: 1,        // Zurück zu Originalzoom
  z: 0,            // Zurück zu 0
  rotationY: 0,    // Zurück zu 0
  duration: 1.2
}, '-=0.2');