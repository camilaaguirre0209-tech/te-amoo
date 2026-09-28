document.addEventListener('DOMContentLoaded', () => {

  // --- 1. AUDIO Y PANTALLA INICIAL ---
  const startBtn = document.getElementById('start-btn');
  const startScreen = document.getElementById('start-screen');
  const cardModal = document.getElementById('card-modal');
  const closeBtn = document.getElementById('close-btn');
  const bgMusic = document.getElementById('bg-music');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (bgMusic) {
        bgMusic.volume = 0.8;
        bgMusic.play().catch(e => console.log("Audio listo"));
      }

      startScreen.style.opacity = '0';
      setTimeout(() => {
        startScreen.style.display = 'none';
        if (cardModal) cardModal.classList.add('active');
      }, 800);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      cardModal.classList.remove('active');
    });
  }

  // --- 2. ESCENA 3D E INTERACCIÓN LIBRE ---
  const container = document.getElementById('canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
  camera.position.z = 22;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const galaxyGroup = new THREE.Group();
  scene.add(galaxyGroup);

  // --- 3. POLVO DE ESTRELLAS Y DESTELLOS ---
  const particleCount = 2500;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(particleCount * 3);
  const starColors = new Float32Array(particleCount * 3);

  const colorCyan = new THREE.Color(0x00f3ff);
  const colorPink = new THREE.Color(0xff3377);

  for (let i = 0; i < particleCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 90;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 90;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 90;

    const col = Math.random() > 0.4 ? colorCyan : colorPink;
    starColors[i * 3] = col.r;
    starColors[i * 3 + 1] = col.g;
    starColors[i * 3 + 2] = col.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });

  const starField = new THREE.Points(starGeo, starMat);
  galaxyGroup.add(starField);

  // --- 4. PALABRAS ROMÁNTICAS FLOTANTES PARA ÁNGEL ---
  const words = [
    "Ángel", "Mi amor", "Mi vida", "Mi esperanza", 
    "Mi ser", "Mi todo", "Mi refugio", "Mi destino", 
    "Eternidad", "Campeón", "Te amo", "Brillamos"
  ];

  function createTextSprite(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const isMain = text === "Ángel";
    ctx.font = isMain ? "Bold 44px Orbitron, sans-serif" : "Bold 28px Quicksand, sans-serif";
    ctx.fillStyle = isMain ? "#ff3377" : "#00f3ff";
    ctx.textAlign = "center";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 16;
    ctx.fillText(text, 256, 70);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(6, 1.5, 1);
    return sprite;
  }

  words.forEach((word) => {
    const sprite = createTextSprite(word);
    const radius = 7 + Math.random() * 11;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    sprite.position.x = radius * Math.sin(phi) * Math.cos(theta);
    sprite.position.y = radius * Math.sin(phi) * Math.sin(theta);
    sprite.position.z = radius * Math.cos(phi);

    galaxyGroup.add(sprite);
  });

  // --- 5. 7 FOTOS NUESTRAS Y HOT WHEELS FLOTANDO EN LA GALAXIA ---
  const textureLoader = new THREE.TextureLoader();

  // Lista con tus 7 fotos + los carritos Hot Wheels
  const imageFiles = [
    'foto1.jpg.jpeg',
    'foto2.jpg.jpeg',
    'foto3.jpg.jpeg',
    'foto4.jpg.jpeg',
    'foto5.jpg.jpeg',
    'foto6.jpn.jpeg',
    'foto7.jpn.jpeg',
    'foto8.jpeg',
    'foto9.jpeg',
    
  ];
  
  const sparklesList = [];

  imageFiles.forEach((file, index) => {
    const texture = textureLoader.load(file);
    const itemGroup = new THREE.Group();

    // Crear la imagen flotante
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.95 });
    const photoSprite = new THREE.Sprite(spriteMat);
    
    // Si es la imagen de hotwheels la hacemos un poco más ancha, si es foto la dejamos cuadrada
    if (file === 'hotwheels.png') {
      photoSprite.scale.set(5.5, 3.5, 1);
    } else {
      photoSprite.scale.set(4.2, 4.2, 1);
    }
    
    itemGroup.add(photoSprite);

    // Destellos brillantes de luz alrededor de cada foto
    const sparkleGeo = new THREE.BufferGeometry();
    const sparkleCount = 18;
    const sparklePos = new Float32Array(sparkleCount * 3);

    for (let s = 0; s < sparkleCount * 3; s++) {
      sparklePos[s] = (Math.random() - 0.5) * 5;
    }

    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xff3377,
      size: 0.18,
      transparent: true,
      opacity: 0.9
    });

    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    itemGroup.add(sparkles);
    sparklesList.push(sparkles);

    // Repartir las 7 fotos y los autos uniformemente en la esfera 3D
    const radius = 8 + Math.random() * 7;
    const theta = (index / imageFiles.length) * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    itemGroup.position.x = radius * Math.sin(phi) * Math.cos(theta);
    itemGroup.position.y = radius * Math.sin(phi) * Math.sin(theta);
    itemGroup.position.z = radius * Math.cos(phi);

    galaxyGroup.add(itemGroup);
  });

  // --- 6. ROTACIÓN CON RATÓN O DEDO ---
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  function onPointerDown(e) {
    isDragging = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    previousMousePosition = { x: clientX, y: clientY };
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const deltaX = clientX - previousMousePosition.x;
    const deltaY = clientY - previousMousePosition.y;

    galaxyGroup.rotation.y += deltaX * 0.005;
    galaxyGroup.rotation.x += deltaY * 0.005;

    previousMousePosition = { x: clientX, y: clientY };
  }

  function onPointerUp() {
    isDragging = false;
  }

  window.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);
  window.addEventListener('touchstart', onPointerDown);
  window.addEventListener('touchmove', onPointerMove);
  window.addEventListener('touchend', onPointerUp);

  // --- 7. ANIMACIÓN CONTINUA ---
  function animate() {
    requestAnimationFrame(animate);

    if (!isDragging) {
      galaxyGroup.rotation.y += 0.0018;
    }

    sparklesList.forEach(sp => {
      sp.rotation.y += 0.02;
      sp.material.opacity = 0.4 + Math.sin(Date.now() * 0.005) * 0.5;
    });

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

});