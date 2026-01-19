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

var radius = 400;
var autoRotate = true;
var rotateSpeed = -60;
var canvasSize = 600;

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');

ospin.style.width = canvasSize + "px";
ospin.style.height = canvasSize + "px";

var ground = document.getElementById('ground');
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

// =========================
// TUNNEL INTRO ANIMATION (ULTRA SMOOTH)
// =========================
console.clear();
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready before initializing GSAP
window.addEventListener('load', function() {
  
  // Smoother ScrollTrigger defaults
  ScrollTrigger.defaults({
    ease: "power3.inOut"
  });

  // Smooth tunnel zoom with multiple layers
  const tunnelTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.wrapper',
      start: 'top top',
      end: '+=400%',
      pin: true,
      scrub: 1.5,
      markers: false,
      anticipatePin: 1
    }
  });

  tunnelTimeline
    .to('.tunnel img', {
      scale: 2.5,
      z: 800,
      rotationY: 15,
      ease: 'power2.inOut'
    })
    .to('.hero .title .small', {
      opacity: 0,
      y: -30,
      ease: 'power3.in'
    }, 0)
    .to('.hero .title .big', {
      scale: 4,
      opacity: 0,
      y: -50,
      ease: 'power3.in'
    }, 0.1);

  // Multi-layer parallax for starfield
  gsap.to('.stars', {
    scrollTrigger: {
      trigger: '.wrapper',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2
    },
    y: 100,
    ease: 'none'
  });

  gsap.to('.twinkling', {
    scrollTrigger: {
      trigger: '.wrapper',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5
    },
    y: 50,
    ease: 'none'
  });

  gsap.to('.nebula', {
    scrollTrigger: {
      trigger: '.wrapper',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 3
    },
    y: -80,
    scale: 1.2,
    ease: 'none'
  });

  // Smooth carousel entrance
  gsap.fromTo('#drag-container', 
    {
      opacity: 0,
      scale: 0.8,
      y: 100
    },
    {
      scrollTrigger: {
        trigger: '.gradient-purple',
        start: 'top 80%',
        end: 'top 30%',
        scrub: 2
      },
      opacity: 1,
      scale: 1,
      y: 0,
      ease: 'power3.out'
    }
  );

  // Smooth info container reveal - only if element exists
  const planetInfo = document.querySelector('#planet-info-container');
  if (planetInfo) {
    gsap.from('#planet-info-container', {
      scrollTrigger: {
        trigger: '.gradient-purple',
        start: 'top 50%',
        end: 'top 20%',
        scrub: 1.5
      },
      opacity: 0,
      y: 80,
      scale: 0.9,
      ease: 'power2.out'
    });
  }
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

let previousFrontPlanetIndex = null;
let stableFrontPlanetIndex = null;
let stabilityCounter = 0;
const STABILITY_THRESHOLD = 10;

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
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  let closestPlanet = null;
  let minDistance = Infinity;
  let maxZ = -Infinity;
  
  planetScenes.forEach((item) => {
    const canvas = item.canvas;
    const transform = canvas.style.transform;
    const zMatch = transform.match(/translateZ\(([^)]+)\)/);
    const zValue = zMatch ? parseFloat(zMatch[1]) : 0;
    if (zValue > maxZ) {
      maxZ = zValue;
    }
  });
  
  planetScenes.forEach((item, index) => {
    const canvas = item.canvas;
    const rect = canvas.getBoundingClientRect();
    const planetCenterX = rect.left + rect.width / 2;
    const planetCenterY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(planetCenterX - centerX, 2) + 
      Math.pow(planetCenterY - centerY, 2)
    );
    
    const transform = canvas.style.transform;
    const zMatch = transform.match(/translateZ\(([^)]+)\)/);
    const zValue = zMatch ? parseFloat(zMatch[1]) : 0;
    
    if (Math.abs(zValue - maxZ) < 100) {
      if (distance < minDistance) {
        minDistance = distance;
        closestPlanet = { item, rect, index, zValue };
      }
    }
  });
  
  const currentFrontPlanetIndex = closestPlanet ? closestPlanet.index : null;
  
  if (currentFrontPlanetIndex === previousFrontPlanetIndex) {
    stabilityCounter++;
  } else {
    stabilityCounter = 0;
    previousFrontPlanetIndex = currentFrontPlanetIndex;
  }
  
  if (stabilityCounter >= STABILITY_THRESHOLD && currentFrontPlanetIndex !== stableFrontPlanetIndex) {
    stableFrontPlanetIndex = currentFrontPlanetIndex;
    
    planetScenes.forEach((item, index) => {
      const canvas = item.canvas;
      const planetData = item.planetData;
      const isFrontPlanet = index === stableFrontPlanetIndex;
      
      if (isFrontPlanet) {
        canvas.style.opacity = '1';
        canvas.classList.add('front-planet');
        canvas.style.filter = `drop-shadow(0 0 20px rgba(${planetData.glowColor}, 0.5)) drop-shadow(0 0 40px rgba(${planetData.glowColor}, 0.3)) drop-shadow(0 0 60px rgba(${planetData.glowColor}, 0.2))`;
      } else {
        canvas.style.opacity = '0.6';
        canvas.classList.remove('front-planet');
        canvas.style.filter = `drop-shadow(0 0 15px rgba(${planetData.glowColor}, 0.3)) drop-shadow(0 0 30px rgba(${planetData.glowColor}, 0.2))`;
      }
    });
  }
  
  planetScenes.forEach((item, index) => {
    const canvas = item.canvas;
    const transform = canvas.style.transform;
    const zMatch = transform.match(/translateZ\(([^)]+)\)/);
    const zValue = zMatch ? parseFloat(zMatch[1]) : 0;
    
    const isFrontPlanet = index === stableFrontPlanetIndex;
    const isInFrontArea = Math.abs(zValue - maxZ) < 100;
    
    let scale;
    if (isFrontPlanet && isInFrontArea) {
      scale = 1.8;
    } else if (isInFrontArea) {
      scale = 0.8;
    } else {
      scale = 0.5;
    }
    
    canvas.style.transform = canvas.style.transform.replace(/scale\([^)]*\)/g, '') + ` scale(${scale})`;
  });
  
  if (stableFrontPlanetIndex !== null && closestPlanet && closestPlanet.index === stableFrontPlanetIndex) {
    const { item, rect } = closestPlanet;
    const planetData = item.planetData;
    
    // Die Mitte des Planeten auf der X-Achse
    const planetCenterX = rect.left + rect.width / 2;
    
    // Der untere Rand des Planeten-Canvas (getBoundingClientRect berücksichtigt bereits das Scaling!)
    const planetBottom = rect.bottom;
    
    // Negativer Abstand - Text überlappt leicht mit dem Planeten
    const fixedOffset = -20;
    
    infoContainer.style.display = 'block';
    infoContainer.style.left = planetCenterX + 'px';
    infoContainer.style.top = (planetBottom + fixedOffset) + 'px';
    
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
// SMOOTH SCROLL TRANSITION TO DETAIL VIEW
// =========================
let detailPlanetScene = null;
let isTransitioning = false;

function openDetailView(planetName) {
  if (isTransitioning) return;
  isTransitioning = true;
  
  console.log('Opening detail view for:', planetName);
  
  const planetData = planetFiles.find(p => p.name === planetName);
  if (!planetData) {
    console.error('Planet not found:', planetName);
    isTransitioning = false;
    return;
  }
  
  const detailView = document.getElementById('planet-detail-view');
  const dragContainer = document.getElementById('drag-container');
  const infoContainer = document.getElementById('planet-info-container');
  
  // Ultra smooth fade-out with stagger
  gsap.to(infoContainer, {
    opacity: 0,
    y: 30,
    scale: 0.95,
    duration: 0.6,
    ease: 'power3.in'
  });
  
  // Smooth carousel exit with blur
  gsap.to(dragContainer, {
    opacity: 0,
    scale: 0.85,
    y: -80,
    filter: 'blur(10px)',
    duration: 1,
    ease: 'power3.inOut',
    onComplete: () => {
      dragContainer.style.pointerEvents = 'none';
    }
  });
  
  setTimeout(() => {
    detailView.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const titleEl = document.getElementById('detail-planet-name');
    const descEl = document.getElementById('detail-planet-description');
    
    if (titleEl) titleEl.innerHTML = `PLANET<br>${planetData.name.toUpperCase()}`;
    if (descEl) descEl.textContent = planetData.longDescription;
    
    const detailCanvas = document.getElementById('detail-planet-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 4;
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: detailCanvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(800, 800);
    
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
        console.error('Error loading detail planet:', error);
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(Math.random(), Math.random(), Math.random())
        });
        planetModel = new THREE.Mesh(geometry, material);
        scene.add(planetModel);
      }
    );
    
    detailCanvas.style.filter = `drop-shadow(0 0 30px rgba(${planetData.glowColor}, 0.6)) drop-shadow(0 0 60px rgba(${planetData.glowColor}, 0.4))`;
    
    function animateDetail() {
      if (!detailView.classList.contains('active')) return;
      requestAnimationFrame(animateDetail);
      if (planetModel) {
        planetModel.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    }
    animateDetail();
    
    detailPlanetScene = { scene, renderer };
    
    isTransitioning = false;
    
  }, 600);
}

function closeDetailView() {
  console.log('Closing detail view');
  const detailView = document.getElementById('planet-detail-view');
  const dragContainer = document.getElementById('drag-container');
  const infoContainer = document.getElementById('planet-info-container');
  
  // Smooth fade-out of detail view
  gsap.to(detailView, {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.in',
    onComplete: () => {
      if (detailView) {
        detailView.classList.remove('active');
        // Reset opacity for next time
        gsap.set(detailView, { opacity: 1 });
      }
    }
  });
  
  // Clean up Three.js scene properly
  if (detailPlanetScene) {
    // Dispose of all geometries, materials, and textures
    detailPlanetScene.scene.traverse((object) => {
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
    
    detailPlanetScene.scene.clear();
    detailPlanetScene.renderer.dispose();
    detailPlanetScene = null;
  }
  
  setTimeout(() => {
    dragContainer.style.pointerEvents = 'all';
    dragContainer.style.filter = 'blur(0px)';
    
    // Smooth carousel return
    gsap.to(dragContainer, {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'power3.out'
    });
    
    gsap.to(infoContainer, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      delay: 0.4,
      ease: 'power3.out'
    });
    
    document.body.style.overflow = 'auto';
  }, 300);
}

// Event Listeners
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('planet-button')) {
    const planetName = e.target.dataset.planet;
    console.log('Button clicked for planet:', planetName);
    if (planetName) {
      openDetailView(planetName);
    }
  }
  
  if (e.target && e.target.id === 'close-detail-btn') {
    closeDetailView();
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeDetailView();
  }
});

// =========================
// CAROUSEL CONTROLS
// =========================
function applyTranform(obj) {
  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes ? 'running' : 'paused');
}

var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10;

if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

document.onpointerdown = function(e) {
  if (isTransitioning) return false;
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX, sY = e.clientY;
  
  this.onpointermove = function(e) {
    e = e || window.event;
    var nX = e.clientX, nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };
  
  this.onpointerup = function(e) {  
    odrag.timer = setInterval(function() {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };
  return false;
};

document.onmousewheel = function(e) {
  if (isTransitioning) return false;
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};