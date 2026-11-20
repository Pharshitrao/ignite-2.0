/**
 * IGNITE 2.0 — DOOMSDAY REALISTIC 3D ENGINE (THREE.JS)
 * Features:
 *  1. Realistic 3D Earth Globe with authentic landmasses, oceans, clouds, and night lights
 *  2. PESCE Mandya / AICTE IDEA Lab Coordinates Beacon (76.9°E, 12.5°N) with global data arcs
 *  3. Interactive 3D Doctor Doom Mask / Sentinel Cyber-Helm with smooth gaze tracking & shockwaves
 *  4. Clean, airy space atmosphere (light, spacious, high-tech)
 *  5. Dynamic 3D Track Relics:
 *     - Green: Gaia Bio-Helix & Living Spore Core (Sustainable Development)
 *     - Purple: Resurrected Cyber Sentinel Gyro-Tesseract (Robotics & IoT)
 *     - Red: Crimson Neural Ultron Matrix (Software & Agentic AI)
 *  6. 4-Stage Scroll-Driven Model Morphing (Realistic Earth -> Track Relic -> 4-Tier Warp Portal -> Singularity)
 *  7. Dynamic Camera Banking & Cursor Sorcery Lighting
 */

/* global THREE */

(function() {
  window.Doomsday = window.Doomsday || {};

  let renderer, scene, camera;
  
  // Model Stage 1: Realistic Earth Globe
  let planetGroup, earthMesh, earthCloudsMesh, earthAtmosphere, atmosphereCanvas, atmosphereTexture;
  let globalArcs = [], mandyaBeacon;

  // Model Stage 2: Track Relics Group
  let trackRelicGroup;
  // Green Relic: Gaia Bio-Helix
  let bioHelixGroup, bioStrand1, bioStrand2, bioParticles;
  // Purple Relic: Sentinel Gyro-Core & Scanner Eye
  let sentinelGyroGroup, gyroRing1, gyroRing2, gyroRing3, sentinelScannerEye, laserNodes = [];
  // Red Relic: Crimson Neural Matrix
  let neuralMatrixGroup, neuralOuterBox, neuralInnerOcta, neuralNodes = [];

  // Model Stage 3: 4-Tier Incursion Warp Portal Tunnel (3+1 Evaluation Rounds)
  let warpTunnelGroup, warpRings = [];

  // Model Stage 4: Singularity Reactor (AICTE IDEA Lab / Final)
  let singularityGroup, singularityCore;

  // Trailer Feature: 3D Doctor Doom Mask / Sentinel Cyber-Helm
  let doomMaskGroup, maskFaceMesh, maskBrowMesh, maskJawMesh, maskHoodWire, eyeLeft, eyeRight;

  // Trailer Feature: Arcane Latverian Floor Seal (From Throne Room poster)
  let arcaneSealGroup, arcaneRingOuter, arcaneRingMid, arcaneRingInner, arcaneStar, arcaneWisps;

  // Trailer Feature: Multiverse Incursion Reality Shards
  let realityShards = [];
  let incursionShockwaveActive = false;
  let shockwaveTimer = 0;
  let shockwaveRing;

  // Global Lighting & Particles
  let ambientLight, sunLight, pointLight2, cursorSorceryLight;
  let stars, embers;

  // Current active theme cache
  let currentThemeCache = null;

  // =========================================================================
  // REALISTIC PROCEDURAL EARTH TEXTURE GENERATION
  // =========================================================================
  function createRealisticEarthCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. Deep Ocean Base with realistic marine gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0, '#061324');
    oceanGrad.addColorStop(0.25, '#091c36');
    oceanGrad.addColorStop(0.5, '#0c274a');
    oceanGrad.addColorStop(0.75, '#091c36');
    oceanGrad.addColorStop(1, '#061324');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 1024, 512);

    function toXY(lon, lat) {
      const x = ((lon + 180) / 360) * 1024;
      const y = ((90 - lat) / 180) * 512;
      return [x, y];
    }

    function drawContinent(points, fillColor, strokeColor) {
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const [x, y] = toXY(points[i][0], points[i][1]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    // Africa
    drawContinent([
      [-17, 32], [-5, 36], [11, 37], [25, 32], [32, 31], [43, 12], [51, 12],
      [45, -5], [40, -15], [35, -25], [20, -35], [18, -34], [12, -18],
      [9, 4], [-14, 12], [-17, 21], [-17, 32]
    ], '#1e4b2d', '#133520');

    // Europe & Eurasia
    drawContinent([
      [-9, 36], [-9, 43], [-1, 46], [-5, 48], [5, 54], [8, 57], [10, 54],
      [13, 56], [20, 60], [28, 70], [45, 68], [70, 73], [100, 77], [140, 72],
      [170, 66], [160, 55], [140, 50], [130, 42], [122, 30], [110, 20],
      [104, 10], [100, 14], [90, 22], [80, 26], [78, 8], [72, 22], [60, 25],
      [50, 27], [35, 32], [26, 40], [14, 45], [0, 42], [-9, 36]
    ], '#285836', '#1a3d25');

    // Indian Subcontinent (Prominent & cleanly defined)
    drawContinent([
      [68, 24], [72, 22], [76, 15], [77.5, 8], [80, 13], [85, 20], [88, 22],
      [80, 28], [72, 30], [68, 24]
    ], '#327347', '#1f4e2d');

    // North America
    drawContinent([
      [-168, 65], [-150, 70], [-130, 70], [-100, 70], [-80, 75], [-60, 60],
      [-65, 45], [-75, 35], [-80, 25], [-97, 26], [-90, 30], [-105, 20],
      [-115, 30], [-124, 48], [-140, 60], [-168, 65]
    ], '#255034', '#183623');

    // South America
    drawContinent([
      [-77, 8], [-60, 10], [-50, 0], [-35, -5], [-38, -15], [-50, -30],
      [-65, -55], [-75, -50], [-72, -35], [-75, -15], [-81, -5], [-77, 8]
    ], '#1f522e', '#14361e');

    // Australia
    drawContinent([
      [114, -22], [125, -15], [135, -12], [142, -11], [153, -28], [150, -37],
      [140, -37], [130, -32], [115, -34], [114, -22]
    ], '#464228', '#2e2c1a');

    // Antarctica
    drawContinent([
      [-180, -70], [180, -70], [180, -90], [-180, -90]
    ], '#cbd5e1', '#94a3b8');

    // Metropolitan Night Lights
    const cityNodes = [
      [76.89, 12.52], // Mandya / Bengaluru (PESCE)
      [77.2, 28.6],   // New Delhi
      [72.8, 18.9],   // Mumbai
      [-74.0, 40.7],  // New York
      [-118.2, 34.0], // Los Angeles
      [-0.1, 51.5],   // London
      [2.3, 48.8],    // Paris
      [139.6, 35.6],  // Tokyo
      [103.8, 1.3],   // Singapore
      [151.2, -33.8]  // Sydney
    ];

    for (let i = 0; i < cityNodes.length; i++) {
      const [cx, cy] = toXY(cityNodes[i][0], cityNodes[i][1]);
      const isMandya = i === 0;
      const r = isMandya ? 3.5 : 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = isMandya ? '#facc15' : '#fbbf24';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = isMandya ? 'rgba(250, 204, 21, 0.45)' : 'rgba(251, 191, 36, 0.22)';
      ctx.fill();
    }

    return canvas;
  }

  // Realistic Procedural Cloud Texture
  function createCloudCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1024, 512);

    for (let i = 0; i < 45; i++) {
      const x = Math.random() * 1024;
      const y = 60 + Math.random() * 390;
      const rx = 35 + Math.random() * 85;
      const ry = 12 + Math.random() * 30;
      const grad = ctx.createRadialGradient(x, y, 4, x, y, rx);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
      grad.addColorStop(0.6, 'rgba(235, 248, 255, 0.18)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    return canvas;
  }

  function updateAtmosphereTexture(haloConfig) {
    if (!atmosphereCanvas) return;
    const ctx = atmosphereCanvas.getContext('2d');
    ctx.clearRect(0, 0, 128, 128);
    const grad = ctx.createRadialGradient(64, 64, 25, 64, 64, 64);
    grad.addColorStop(0, haloConfig?.inner || 'rgba(52, 211, 153, 0.65)');
    grad.addColorStop(0.5, haloConfig?.mid || 'rgba(4, 120, 87, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    if (atmosphereTexture) atmosphereTexture.needsUpdate = true;
  }

  function initScene(initialTheme) {
    const canvas = document.getElementById('scene');
    if (!canvas || typeof THREE === 'undefined') return;

    currentThemeCache = initialTheme;

    // 1. WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 2. Scene & Crisp Space Fog (Lightened & spacious)
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(initialTheme?.three?.fog || 0x06090e, 0.015);

    // 3. Camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 0, 9);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =========================================================================
    // MODEL STAGE 1: REALISTIC 3D EARTH GLOBE
    // =========================================================================
    planetGroup = new THREE.Group();
    // Real Earth axial tilt: 23.44 degrees = ~0.409 rad
    planetGroup.rotation.z = 0.409;
    planetGroup.rotation.x = 0.12;
    scene.add(planetGroup);

    // 1A. Earth Surface Mesh
    const earthCanvas = createRealisticEarthCanvas();
    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    const earthGeo = new THREE.SphereGeometry(2.6, 64, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.12,
      emissive: initialTheme?.three?.emissive || 0x047857,
      emissiveIntensity: 0.14
    });
    earthMesh = new THREE.Mesh(earthGeo, earthMat);
    planetGroup.add(earthMesh);

    // 1B. Earth Cloud Layer (Subtle, drifting)
    const cloudCanvas = createCloudCanvas();
    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    const cloudGeo = new THREE.SphereGeometry(2.64, 48, 36);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.35,
      blending: THREE.NormalBlending
    });
    earthCloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
    planetGroup.add(earthCloudsMesh);

    // 1C. Atmospheric Rayleigh Glow
    atmosphereCanvas = document.createElement('canvas');
    atmosphereCanvas.width = atmosphereCanvas.height = 128;
    atmosphereTexture = new THREE.CanvasTexture(atmosphereCanvas);
    updateAtmosphereTexture(initialTheme?.three?.halo || { inner: 'rgba(52, 211, 153, 0.65)', mid: 'rgba(4, 120, 87, 0.25)' });

    earthAtmosphere = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: atmosphereTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
      })
    );
    earthAtmosphere.scale.set(7.6, 7.6, 1);
    earthAtmosphere.position.z = -0.5;
    planetGroup.add(earthAtmosphere);

    // 1D. PESCE Mandya Coordinates Beacon
    const beaconGeo = new THREE.RingGeometry(0.06, 0.14, 24);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    mandyaBeacon = new THREE.Mesh(beaconGeo, beaconMat);
    // Mandya: ~76.9°E, 12.5°N in spherical coordinates on radius 2.61
    const phi = (90 - 12.5) * (Math.PI / 180);
    const theta = (76.9 + 180) * (Math.PI / 180);
    mandyaBeacon.position.set(
      -(2.61 * Math.sin(phi) * Math.cos(theta)),
      2.61 * Math.cos(phi),
      2.61 * Math.sin(phi) * Math.sin(theta)
    );
    mandyaBeacon.lookAt(0, 0, 0);
    planetGroup.add(mandyaBeacon);

    // 1E. Global Data Flight Arcs (Delicate, thin innovation paths)
    globalArcs = [];
    const arcPoints = [
      [[-74, 40], [76.9, 12.5]], // NYC -> Mandya
      [[0, 51.5], [76.9, 12.5]],  // London -> Mandya
      [[139, 35], [76.9, 12.5]],  // Tokyo -> Mandya
      [[151, -33], [76.9, 12.5]]  // Sydney -> Mandya
    ];

    arcPoints.forEach(pair => {
      const p1 = pair[0];
      const p2 = pair[1];
      const phi1 = (90 - p1[1]) * (Math.PI / 180);
      const th1 = (p1[0] + 180) * (Math.PI / 180);
      const v1 = new THREE.Vector3(
        -(2.62 * Math.sin(phi1) * Math.cos(th1)),
        2.62 * Math.cos(phi1),
        2.62 * Math.sin(phi1) * Math.sin(th1)
      );

      const phi2 = (90 - p2[1]) * (Math.PI / 180);
      const th2 = (p2[0] + 180) * (Math.PI / 180);
      const v2 = new THREE.Vector3(
        -(2.62 * Math.sin(phi2) * Math.cos(th2)),
        2.62 * Math.cos(phi2),
        2.62 * Math.sin(phi2) * Math.sin(th2)
      );

      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(3.2);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const curvePts = curve.getPoints(36);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
      const arcLine = new THREE.Line(
        curveGeo,
        new THREE.LineBasicMaterial({
          color: initialTheme?.three?.light1 || 0x34d399,
          transparent: true,
          opacity: 0.4
        })
      );
      planetGroup.add(arcLine);
      globalArcs.push(arcLine);
    });

    // =========================================================================
    // TRAILER FEATURE 2: ARCANE LATVERIAN FLOOR SEAL
    // =========================================================================
    arcaneSealGroup = new THREE.Group();
    arcaneSealGroup.position.set(0, -4.2, 0);
    arcaneSealGroup.rotation.x = -Math.PI / 2.05;
    scene.add(arcaneSealGroup);

    const outerRingGeo = new THREE.RingGeometry(5.2, 5.5, 72);
    const sealMatOuter = new THREE.MeshBasicMaterial({
      color: initialTheme?.three?.light1 || 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    arcaneRingOuter = new THREE.Mesh(outerRingGeo, sealMatOuter);
    arcaneSealGroup.add(arcaneRingOuter);

    const midRingGeo = new THREE.RingGeometry(4.0, 4.25, 48);
    const sealMatMid = new THREE.MeshBasicMaterial({
      color: initialTheme?.three?.ringColor || 0xfacc15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    arcaneRingMid = new THREE.Mesh(midRingGeo, sealMatMid);
    arcaneSealGroup.add(arcaneRingMid);

    const innerRingGeo = new THREE.RingGeometry(2.8, 2.95, 36);
    const sealMatInner = new THREE.MeshBasicMaterial({
      color: initialTheme?.three?.light1 || 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    arcaneRingInner = new THREE.Mesh(innerRingGeo, sealMatInner);
    arcaneSealGroup.add(arcaneRingInner);

    const starShape1 = new THREE.CircleGeometry(3.6, 8);
    const starWireMat = new THREE.MeshBasicMaterial({
      color: initialTheme?.three?.ringColor || 0xfacc15,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    arcaneStar = new THREE.Mesh(starShape1, starWireMat);
    arcaneSealGroup.add(arcaneStar);

    const wispCount = 140;
    const wispPos = new Float32Array(wispCount * 3);
    for (let i = 0; i < wispCount; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 1.0 + Math.random() * 4.2;
      wispPos[i * 3] = Math.cos(ang) * rad;
      wispPos[i * 3 + 1] = Math.sin(ang) * rad;
      wispPos[i * 3 + 2] = Math.random() * 4.5;
    }
    const wispGeo = new THREE.BufferGeometry();
    wispGeo.setAttribute('position', new THREE.BufferAttribute(wispPos, 3));
    arcaneWisps = new THREE.Points(
      wispGeo,
      new THREE.PointsMaterial({
        color: initialTheme?.three?.light1 || 0x34d399,
        size: 0.07,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    arcaneSealGroup.add(arcaneWisps);

    // =========================================================================
    // TRAILER FEATURE 3: 3D DOCTOR DOOM MASK / SENTINEL CYBER-HELM
    // =========================================================================
    doomMaskGroup = new THREE.Group();
    doomMaskGroup.position.set(3.4, 1.4, 2.5);
    scene.add(doomMaskGroup);

    const maskMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.95,
      roughness: 0.22,
      flatShading: true
    });

    const faceGeo = new THREE.CylinderGeometry(0.85, 0.65, 1.4, 10, 1, false, 0, Math.PI);
    maskFaceMesh = new THREE.Mesh(faceGeo, maskMat);
    maskFaceMesh.rotation.y = -Math.PI / 2;
    doomMaskGroup.add(maskFaceMesh);

    const browGeo = new THREE.BoxGeometry(1.2, 0.28, 0.45);
    maskBrowMesh = new THREE.Mesh(browGeo, maskMat);
    maskBrowMesh.position.set(0, 0.45, 0.42);
    doomMaskGroup.add(maskBrowMesh);

    const jawGeo = new THREE.BoxGeometry(0.9, 0.35, 0.35);
    maskJawMesh = new THREE.Mesh(jawGeo, maskMat);
    maskJawMesh.position.set(0, -0.45, 0.38);
    doomMaskGroup.add(maskJawMesh);

    const eyeMat = new THREE.MeshBasicMaterial({
      color: initialTheme?.three?.light1 || 0x34d399,
      side: THREE.DoubleSide
    });
    const eyeGeo = new THREE.BoxGeometry(0.24, 0.07, 0.1);
    eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
    eyeLeft.position.set(-0.28, 0.16, 0.52);
    eyeLeft.rotation.z = -0.15;
    doomMaskGroup.add(eyeLeft);

    eyeRight = new THREE.Mesh(eyeGeo, eyeMat);
    eyeRight.position.set(0.28, 0.16, 0.52);
    eyeRight.rotation.z = 0.15;
    doomMaskGroup.add(eyeRight);

    const hoodGeo = new THREE.ConeGeometry(1.4, 2.2, 8, 2, true);
    const hoodMat = new THREE.MeshBasicMaterial({
      color: initialTheme?.three?.wireframe || 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    maskHoodWire = new THREE.Mesh(hoodGeo, hoodMat);
    maskHoodWire.position.set(0, 0.2, -0.15);
    doomMaskGroup.add(maskHoodWire);

    // =========================================================================
    // TRAILER FEATURE 4: MULTIVERSE REALITY SHARDS & INCURSION SHOCKWAVE
    // =========================================================================
    realityShards = [];
    const shardGeom1 = new THREE.OctahedronGeometry(0.32, 0);
    const shardGeom2 = new THREE.TetrahedronGeometry(0.38, 0);

    for (let i = 0; i < 35; i++) {
      const g = i % 2 === 0 ? shardGeom1 : shardGeom2;
      const shardMat = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? (initialTheme?.three?.ringColor || 0xfacc15) : (initialTheme?.three?.light1 || 0x34d399),
        roughness: 0.15,
        metalness: 0.9,
        flatShading: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const shard = new THREE.Mesh(g, shardMat);
      
      shard.userData = {
        radius: 3.4 + Math.random() * 4.5,
        angle: Math.random() * Math.PI * 2,
        speed: 0.006 + Math.random() * 0.012,
        yOffset: (Math.random() - 0.5) * 5.5,
        rotSpeedX: (Math.random() - 0.5) * 0.04,
        rotSpeedY: (Math.random() - 0.5) * 0.04,
        blastDist: 0
      };
      
      scene.add(shard);
      realityShards.push(shard);
    }

    const shockwaveGeo = new THREE.RingGeometry(0.1, 0.35, 48);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: initialTheme?.three?.light1 || 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    shockwaveRing = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwaveRing.position.set(0, 0, 1);
    scene.add(shockwaveRing);

    // =========================================================================
    // MODEL STAGE 2: DYNAMIC TRACK RELICS
    // =========================================================================
    trackRelicGroup = new THREE.Group();
    trackRelicGroup.scale.set(0.001, 0.001, 0.001);
    trackRelicGroup.visible = false;
    scene.add(trackRelicGroup);

    // 2A. Green Relic: Gaia Bio-Helix
    bioHelixGroup = new THREE.Group();
    trackRelicGroup.add(bioHelixGroup);

    const strandCount = 60;
    const strandGeo1 = new THREE.BufferGeometry();
    const strandPos1 = new Float32Array(strandCount * 3);
    const strandPos2 = new Float32Array(strandCount * 3);

    for (let i = 0; i < strandCount; i++) {
      const t = (i / strandCount) * Math.PI * 6;
      const y = (i / strandCount - 0.5) * 4.8;
      strandPos1[i * 3] = Math.cos(t) * 1.2;
      strandPos1[i * 3 + 1] = y;
      strandPos1[i * 3 + 2] = Math.sin(t) * 1.2;

      strandPos2[i * 3] = Math.cos(t + Math.PI) * 1.2;
      strandPos2[i * 3 + 1] = y;
      strandPos2[i * 3 + 2] = Math.sin(t + Math.PI) * 1.2;
    }
    strandGeo1.setAttribute('position', new THREE.BufferAttribute(strandPos1, 3));
    bioStrand1 = new THREE.Line(strandGeo1, new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.8
    }));
    bioHelixGroup.add(bioStrand1);

    const strandGeo2 = new THREE.BufferGeometry();
    strandGeo2.setAttribute('position', new THREE.BufferAttribute(strandPos2, 3));
    bioStrand2 = new THREE.Line(strandGeo2, new THREE.LineBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.8
    }));
    bioHelixGroup.add(bioStrand2);

    const bioParticleGeo = new THREE.BufferGeometry();
    const bioParticlePos = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      bioParticlePos[i * 3] = (Math.random() - 0.5) * 2.2;
      bioParticlePos[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      bioParticlePos[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
    }
    bioParticleGeo.setAttribute('position', new THREE.BufferAttribute(bioParticlePos, 3));
    bioParticles = new THREE.Points(
      bioParticleGeo,
      new THREE.PointsMaterial({
        color: 0x6ee7b7,
        size: 0.07,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      })
    );
    bioHelixGroup.add(bioParticles);

    // 2B. Purple Relic: Sentinel Gyro-Core
    sentinelGyroGroup = new THREE.Group();
    trackRelicGroup.add(sentinelGyroGroup);

    const gMat1 = new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true, transparent: true, opacity: 0.7 });
    const gMat2 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.6 });
    gyroRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.05, 12, 48), gMat1);
    gyroRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.05, 12, 48), gMat2);
    gyroRing3 = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.05, 12, 48), gMat1);
    sentinelGyroGroup.add(gyroRing1, gyroRing2, gyroRing3);

    const eyeOpticGeo = new THREE.SphereGeometry(0.48, 16, 16);
    const eyeOpticMat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.8
    });
    sentinelScannerEye = new THREE.Mesh(eyeOpticGeo, eyeOpticMat);
    sentinelGyroGroup.add(sentinelScannerEye);

    laserNodes = [];
    for (let i = 0; i < 6; i++) {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 })
      );
      sentinelGyroGroup.add(node);
      laserNodes.push(node);
    }

    // 2C. Red Relic: Crimson Neural Matrix
    neuralMatrixGroup = new THREE.Group();
    trackRelicGroup.add(neuralMatrixGroup);

    neuralOuterBox = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 2.6, 2.6),
      new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true, transparent: true, opacity: 0.55 })
    );
    neuralMatrixGroup.add(neuralOuterBox);

    neuralInnerOcta = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.3, 0),
      new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0x991b1b,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8,
        flatShading: true
      })
    );
    neuralMatrixGroup.add(neuralInnerOcta);

    neuralNodes = [];
    const corners = [
      [-1.3, -1.3, -1.3], [1.3, -1.3, -1.3], [1.3, 1.3, -1.3], [-1.3, 1.3, -1.3],
      [-1.3, -1.3, 1.3], [1.3, -1.3, 1.3], [1.3, 1.3, 1.3], [-1.3, 1.3, 1.3]
    ];
    for (let i = 0; i < corners.length; i++) {
      const nMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.95 })
      );
      nMesh.position.set(corners[i][0], corners[i][1], corners[i][2]);
      neuralMatrixGroup.add(nMesh);
      neuralNodes.push(nMesh);
    }

    updateActiveRelicVisibility(initialTheme?.id || 'track-sustainability');

    // =========================================================================
    // MODEL STAGE 3: 4-TIER WARP PORTAL TUNNEL
    // =========================================================================
    warpTunnelGroup = new THREE.Group();
    warpTunnelGroup.scale.set(0.001, 0.001, 0.001);
    warpTunnelGroup.visible = false;
    scene.add(warpTunnelGroup);

    warpRings = [];
    const ringRadii = [2.2, 2.8, 3.4, 4.0];
    for (let i = 0; i < 4; i++) {
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(ringRadii[i], 0.05, 16, 64),
        new THREE.MeshStandardMaterial({
          color: i === 3 ? (initialTheme?.three?.ringColor || 0xfacc15) : (initialTheme?.three?.light1 || 0x34d399),
          emissive: initialTheme?.three?.emissive || 0x047857,
          emissiveIntensity: 0.55,
          roughness: 0.3,
          metalness: 0.7,
          transparent: true,
          opacity: 0.7
        })
      );
      torus.position.z = (i - 1.5) * 2.2;
      warpTunnelGroup.add(torus);
      warpRings.push(torus);
    }

    // =========================================================================
    // MODEL STAGE 4: AICTE IDEA LAB SINGULARITY REACTOR
    // =========================================================================
    singularityGroup = new THREE.Group();
    singularityGroup.scale.set(0.001, 0.001, 0.001);
    singularityGroup.visible = false;
    scene.add(singularityGroup);

    singularityCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.6, 2),
      new THREE.MeshStandardMaterial({
        color: initialTheme?.three?.light1 || 0x34d399,
        wireframe: true,
        emissive: initialTheme?.three?.emissive || 0x047857,
        emissiveIntensity: 0.85,
        transparent: true,
        opacity: 0.75
      })
    );
    singularityGroup.add(singularityCore);

    for (let i = 0; i < 3; i++) {
      const cRing = new THREE.Mesh(
        new THREE.TorusGeometry(2.5 + i * 0.4, 0.04, 16, 64),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? (initialTheme?.three?.light1 || 0x34d399) : (initialTheme?.three?.ringColor || 0xfacc15),
          transparent: true,
          opacity: 0.45
        })
      );
      cRing.rotation.x = Math.PI * (i / 3);
      singularityGroup.add(cRing);
    }

    // =========================================================================
    // LIGHTING & PARTICLES + CURSOR SORCERY LIGHT
    // =========================================================================
    ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Directional Sunlight (Realistic Day/Night on Earth)
    sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(8, 4, 6);
    scene.add(sunLight);

    pointLight2 = new THREE.PointLight(initialTheme?.three?.light2 || 0xfacc15, 0.8, 50);
    pointLight2.position.set(-7, -3, -4);
    scene.add(pointLight2);

    cursorSorceryLight = new THREE.PointLight(initialTheme?.three?.light1 || 0x34d399, 1.8, 22);
    cursorSorceryLight.position.set(0, 0, 7);
    scene.add(cursorSorceryLight);

    // Delicate Background Stars (Refined & crisp)
    function createParticleSystem(count, spread, size, color, opacity) {
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * spread;
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      return new THREE.Points(
        geom,
        new THREE.PointsMaterial({
          color,
          size,
          transparent: true,
          opacity,
          depthWrite: false
        })
      );
    }

    stars = createParticleSystem(850, 95, 0.04, 0xf1f5f9, 0.7);
    embers = createParticleSystem(180, 28, 0.06, initialTheme?.three?.embers || 0x6ee7b7, 0.8);
    scene.add(stars, embers);

    // =========================================================================
    // SCROLL, MOUSE TRACKING & PARALLAX
    // =========================================================================
    let mouseX = 0, mouseY = 0, scrollProgress = 0;
    let targetMaskRotY = 0, targetMaskRotX = 0;

    window.addEventListener('pointermove', e => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;

      if (cursorSorceryLight) {
        cursorSorceryLight.position.x = mouseX * 12;
        cursorSorceryLight.position.y = -mouseY * 8;
      }

      targetMaskRotY = mouseX * 0.8;
      targetMaskRotX = -mouseY * 0.6;
    });

    function onScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const xPos = w > 850 ? 3.0 : 0;
      planetGroup.position.x = xPos;
      trackRelicGroup.position.x = xPos;
      warpTunnelGroup.position.x = xPos;
      singularityGroup.position.x = xPos;
      arcaneSealGroup.position.x = xPos;

      if (w > 850) {
        doomMaskGroup.position.set(3.4, 1.2, 2.5);
      } else {
        doomMaskGroup.position.set(0, 2.2, 1.2);
        doomMaskGroup.scale.setScalar(0.75);
      }
    }
    window.addEventListener('resize', onResize);
    onResize();

    // =========================================================================
    // TRAILER INTERACTIVE INCURSION TRIGGER
    // =========================================================================
    function triggerIncursionShockwave() {
      incursionShockwaveActive = true;
      shockwaveTimer = 0;

      if (window.Doomsday && window.Doomsday.playIncursionExplosion) {
        window.Doomsday.playIncursionExplosion();
      }

      for (let i = 0; i < realityShards.length; i++) {
        realityShards[i].userData.blastDist = 3.5 + Math.random() * 5.0;
      }
    }
    window.Doomsday.triggerIncursionShockwave = triggerIncursionShockwave;

    function focusDoomMask() {
      if (window.Doomsday && window.Doomsday.playMetallicClank) {
        window.Doomsday.playMetallicClank();
      }
      triggerIncursionShockwave();
    }
    window.Doomsday.focusDoomMask = focusDoomMask;

    // =========================================================================
    // RENDER LOOP & DYNAMIC 3D ANIMATIONS
    // =========================================================================
    let time = 0;

    function clamp01(v) { return Math.max(0, Math.min(1, v)); }

    function animate() {
      requestAnimationFrame(animate);
      if (!prefersReducedMotion) {
        time += 0.01;
      }

      // 1. ROTATE REALISTIC EARTH & DRIFTING CLOUDS
      if (earthMesh) {
        earthMesh.rotation.y = time * 0.08;
      }
      if (earthCloudsMesh) {
        earthCloudsMesh.rotation.y = time * 0.11; // Clouds drift slightly faster
      }
      if (mandyaBeacon) {
        mandyaBeacon.scale.setScalar(1 + Math.sin(time * 4) * 0.25);
      }

      // 2. ANIMATE ARCANE LATVERIAN FLOOR SEAL
      if (arcaneSealGroup) {
        arcaneRingOuter.rotation.z = time * 0.14;
        arcaneRingMid.rotation.z = -time * 0.18;
        arcaneRingInner.rotation.z = time * 0.22;
        arcaneStar.rotation.z = -time * 0.08;
        arcaneRingOuter.material.opacity = 0.4 + Math.sin(time * 2.2) * 0.15;

        if (arcaneWisps && !prefersReducedMotion) {
          const wPos = arcaneWisps.geometry.attributes.position;
          for (let i = 0; i < wPos.count; i++) {
            let z = wPos.getZ(i) + 0.02;
            if (z > 4.5) z = 0.1;
            wPos.setZ(i, z);
          }
          wPos.needsUpdate = true;
        }
      }

      // 3. ANIMATE 3D DOCTOR DOOM MASK (GAZE TRACKING)
      if (doomMaskGroup) {
        doomMaskGroup.rotation.y += (targetMaskRotY - doomMaskGroup.rotation.y) * 0.06;
        doomMaskGroup.rotation.x += (targetMaskRotX - doomMaskGroup.rotation.x) * 0.06;
        doomMaskGroup.position.y = (window.innerWidth > 850 ? 1.2 : 2.2) + Math.sin(time * 1.8) * 0.12;

        if (eyeLeft && eyeRight) {
          const eyeGlow = 0.85 + Math.sin(time * 3.5) * 0.25;
          eyeLeft.scale.set(1, eyeGlow, 1);
          eyeRight.scale.set(1, eyeGlow, 1);
        }
      }

      // 4. ANIMATE MULTIVERSE REALITY SHARDS & INCLURSION SHOCKWAVE
      if (incursionShockwaveActive) {
        shockwaveTimer += 0.025;
        if (shockwaveRing) {
          shockwaveRing.visible = true;
          shockwaveRing.scale.setScalar(shockwaveTimer * 18);
          shockwaveRing.material.opacity = Math.max(0, 1 - shockwaveTimer);
        }
        if (shockwaveTimer >= 1.0) {
          incursionShockwaveActive = false;
          if (shockwaveRing) shockwaveRing.visible = false;
        }
      }

      for (let i = 0; i < realityShards.length; i++) {
        const shard = realityShards[i];
        const ud = shard.userData;
        ud.angle += ud.speed;

        if (ud.blastDist > 0.01) {
          ud.blastDist *= 0.94;
        } else {
          ud.blastDist = 0;
        }

        const curRadius = ud.radius + ud.blastDist;
        shard.position.x = Math.cos(ud.angle) * curRadius;
        shard.position.z = Math.sin(ud.angle) * curRadius;
        shard.position.y = ud.yOffset + Math.sin(time * 2 + i) * 0.35;
        shard.rotation.x += ud.rotSpeedX * (1 + ud.blastDist * 2);
        shard.rotation.y += ud.rotSpeedY * (1 + ud.blastDist * 2);
      }

      // 5. STAGE WEIGHTS FOR SCROLL MORPHING
      const w1 = clamp01(1 - (scrollProgress - 0.0) / 0.28);
      const w2 = clamp01(1 - Math.abs(scrollProgress - 0.40) / 0.16);
      const w3 = clamp01(1 - Math.abs(scrollProgress - 0.65) / 0.16);
      const w4 = clamp01((scrollProgress - 0.75) / 0.25);

      // STAGE 1: REALISTIC EARTH GLOBE
      if (w1 > 0.01) {
        planetGroup.visible = true;
        planetGroup.scale.setScalar(w1 * (1 + scrollProgress * 0.3));
        earthAtmosphere.material.opacity = (0.7 + Math.sin(time * 3) * 0.12) * w1;
      } else {
        planetGroup.visible = false;
      }

      // STAGE 2: DYNAMIC TRACK RELIC
      if (w2 > 0.01) {
        trackRelicGroup.visible = true;
        trackRelicGroup.scale.setScalar(w2 * 1.15);

        if (bioHelixGroup && bioHelixGroup.visible) {
          bioHelixGroup.rotation.y = time * 0.6;
          bioParticles.rotation.y = -time * 0.4;
        }

        if (sentinelGyroGroup && sentinelGyroGroup.visible) {
          gyroRing1.rotation.x = time * 0.8;
          gyroRing1.rotation.y = time * 0.5;
          gyroRing2.rotation.y = -time * 0.9;
          gyroRing2.rotation.z = time * 0.6;
          gyroRing3.rotation.x = -time * 0.7;

          if (sentinelScannerEye) {
            sentinelScannerEye.rotation.y = time * 1.6;
            sentinelScannerEye.rotation.x = Math.sin(time * 2.2) * 0.3;
          }

          for (let i = 0; i < 6; i++) {
            const angle = time * 1.3 + (i * Math.PI) / 3;
            laserNodes[i].position.set(
              Math.cos(angle) * 2.1,
              Math.sin(angle * 1.4) * 1.1,
              Math.sin(angle) * 2.1
            );
          }
        }

        if (neuralMatrixGroup && neuralMatrixGroup.visible) {
          neuralOuterBox.rotation.x = -time * 0.4;
          neuralOuterBox.rotation.y = time * 0.5;
          neuralOuterBox.rotation.z = time * 0.3;
          neuralInnerOcta.rotation.x = time * 0.9;
          neuralInnerOcta.rotation.y = time * 0.7;
        }
      } else {
        trackRelicGroup.visible = false;
      }

      // STAGE 3: 4-TIER WARP PORTAL TUNNEL
      if (w3 > 0.01) {
        warpTunnelGroup.visible = true;
        warpTunnelGroup.scale.setScalar(w3 * 1.1);
        warpTunnelGroup.rotation.z = time * 0.2;
        warpTunnelGroup.rotation.x = 0.35 + Math.sin(time) * 0.1;
        for (let i = 0; i < 4; i++) {
          warpRings[i].rotation.z = (i % 2 === 0 ? 1 : -1) * time * (0.3 + i * 0.1);
        }
      } else {
        warpTunnelGroup.visible = false;
      }

      // STAGE 4: AICTE IDEA LAB SINGULARITY REACTOR
      if (w4 > 0.01) {
        singularityGroup.visible = true;
        singularityGroup.scale.setScalar(w4 * 1.25);
        singularityCore.rotation.x = time * 0.5;
        singularityCore.rotation.y = time * 0.9;
        singularityGroup.rotation.z = time * 0.4;
      } else {
        singularityGroup.visible = false;
      }

      // Drifting subtle embers
      const emberPos = embers.geometry.attributes.position;
      for (let i = 0; i < emberPos.count && !prefersReducedMotion; i++) {
        const y = emberPos.getY(i) + 0.012 + (i % 5) * 0.002;
        emberPos.setY(i, y > 14 ? -14 : y);
      }
      emberPos.needsUpdate = true;

      // Camera Fly-Through with Dynamic Banking
      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 1.0 - camera.position.y) * 0.04;
      camera.position.z = 9 + scrollProgress * 6.5;
      camera.rotation.z = -mouseX * 0.05;
      camera.lookAt(0, 0, 0);

      stars.rotation.y = time * 0.008;

      renderer.render(scene, camera);
    }

    animate();
  }

  function updateActiveRelicVisibility(themeId) {
    if (!bioHelixGroup || !sentinelGyroGroup || !neuralMatrixGroup) return;

    if (themeId === 'track-sustainability') {
      bioHelixGroup.visible = true;
      sentinelGyroGroup.visible = false;
      neuralMatrixGroup.visible = false;
    } else if (themeId === 'track-robotics') {
      bioHelixGroup.visible = false;
      sentinelGyroGroup.visible = true;
      neuralMatrixGroup.visible = false;
    } else if (themeId === 'track-software') {
      bioHelixGroup.visible = false;
      sentinelGyroGroup.visible = false;
      neuralMatrixGroup.visible = true;
    }
  }

  function updateSceneColors(themeData) {
    if (!scene || !themeData || !themeData.three) return;
    currentThemeCache = themeData;
    const cfg = themeData.three;

    if (scene.fog) scene.fog.color.setHex(cfg.fog);

    if (pointLight2) pointLight2.color.setHex(cfg.light2);
    if (cursorSorceryLight) cursorSorceryLight.color.setHex(cfg.light1);

    // Update Doom Mask Eyes and Hood
    if (eyeLeft && eyeLeft.material) eyeLeft.material.color.setHex(cfg.light1);
    if (eyeRight && eyeRight.material) eyeRight.material.color.setHex(cfg.light1);
    if (maskHoodWire && maskHoodWire.material) maskHoodWire.material.color.setHex(cfg.wireframe);

    // Update Arcane Floor Seal
    if (arcaneRingOuter && arcaneRingOuter.material) arcaneRingOuter.material.color.setHex(cfg.light1);
    if (arcaneRingMid && arcaneRingMid.material) arcaneRingMid.material.color.setHex(cfg.ringColor || cfg.light2);
    if (arcaneRingInner && arcaneRingInner.material) arcaneRingInner.material.color.setHex(cfg.light1);
    if (arcaneStar && arcaneStar.material) arcaneStar.material.color.setHex(cfg.ringColor || cfg.light2);
    if (arcaneWisps && arcaneWisps.material) arcaneWisps.material.color.setHex(cfg.light1);

    // Update Global Arcs
    globalArcs.forEach(arc => {
      if (arc.material) arc.material.color.setHex(cfg.light1);
    });

    // Update Shockwave Ring
    if (shockwaveRing && shockwaveRing.material) shockwaveRing.material.color.setHex(cfg.light1);

    // Update Active Relic Mode
    updateActiveRelicVisibility(themeData.id);

    // Reality Shards
    realityShards.forEach((shard, idx) => {
      if (shard.material) {
        shard.material.color.setHex(idx % 3 === 0 ? (cfg.ringColor || cfg.light2) : cfg.light1);
      }
    });

    // Earth Emissive Hue
    if (earthMesh && earthMesh.material) {
      earthMesh.material.emissive.setHex(cfg.emissive);
    }

    // Warp Rings
    warpRings.forEach((r, idx) => {
      if (r.material) {
        r.material.color.setHex(idx === 3 ? (cfg.ringColor || cfg.light2) : cfg.light1);
        r.material.emissive.setHex(cfg.emissive);
      }
    });

    // Singularity Core
    if (singularityCore && singularityCore.material) {
      singularityCore.material.color.setHex(cfg.light1);
      singularityCore.material.emissive.setHex(cfg.emissive);
    }

    if (embers && embers.material) {
      embers.material.color.setHex(cfg.embers);
    }

    updateAtmosphereTexture(cfg.halo);
  }

  window.Doomsday.initScene = initScene;
  window.Doomsday.updateSceneColors = updateSceneColors;
})();
