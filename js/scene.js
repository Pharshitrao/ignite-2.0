/**
 * IGNITE 2.0 — DOOMSDAY CINEMATIC 3D ENGINE (THREE.JS)
 * Features trailer-inspired 3D animations:
 *  1. Interactive 3D Doctor Doom Mask / Sentinel Cyber-Helm with smooth gaze tracking & shockwaves
 *  2. Gothic Cathedral Colonnade & Stained Glass Volumetric God Rays (from Throne Room poster)
 *  3. Arcane Latverian Summoning Circle (Concentric rotating glyph rings from Throne Room floor)
 *  4. Multiverse Incursion Colliding Realities & Exploding Reality Shards
 *  5. Dynamic 3D Track Relics:
 *     - Green: Gaia Bio-Helix & Living Spore Core (Sustainable Development)
 *     - Purple: Resurrected Cyber Sentinel Gyro-Tesseract (Robotics & IoT)
 *     - Red: Crimson Neural Ultron Matrix (Software & Agentic AI)
 *  6. 4-Stage Scroll-Driven Model Morphing (Planet -> Track Relic -> 4-Tier Warp Portal -> Singularity)
 *  7. Dynamic Camera Banking & Cursor Sorcery Lighting
 */

/* global THREE */

(function() {
  window.Doomsday = window.Doomsday || {};

  let renderer, scene, camera;
  
  // Model Stage 1: Planet & Halo
  let planetGroup, planetMesh, planetWire, incursionRing, halo, haloCtx, haloCanvas, haloTexture;
  let vertexCrackData = [];

  // Model Stage 2: Track Relics Group
  let trackRelicGroup;
  // Green Relic: Gaia Bio-Helix
  let bioHelixGroup, bioStrand1, bioStrand2, bioParticles;
  // Purple Relic: Sentinel Gyro-Core & Scanner Eye
  let sentinelGyroGroup, gyroRing1, gyroRing2, gyroRing3, sentinelScannerEye, laserNodes = [];
  // Red Relic: Crimson Neural Matrix
  let neuralMatrixGroup, neuralOuterBox, neuralInnerOcta, neuralNodes = [], neuralLines;

  // Model Stage 3: 4-Tier Incursion Warp Portal Tunnel (3+1 Evaluation Rounds)
  let warpTunnelGroup, warpRings = [];

  // Model Stage 4: Singularity Reactor (AICTE IDEA Lab / Final)
  let singularityGroup, singularityCore, singularityField;

  // Trailer Feature: 3D Doctor Doom Mask / Sentinel Cyber-Helm
  let doomMaskGroup, maskFaceMesh, maskBrowMesh, maskJawMesh, maskHoodWire, eyeLeft, eyeRight;

  // Trailer Feature: Arcane Latverian Floor Seal (From Throne Room poster)
  let arcaneSealGroup, arcaneRingOuter, arcaneRingMid, arcaneRingInner, arcaneStar, arcaneWisps;

  // Trailer Feature: Gothic Cathedral Colonnade & Volumetric God Rays
  let cathedralGroup, cathedralPillars = [], godRays = [];

  // Trailer Feature: Multiverse Incursion Reality Shards
  let realityShards = [];
  let incursionShockwaveActive = false;
  let shockwaveTimer = 0;
  let shockwaveRing;

  // Global Lighting & Particles
  let ambientLight, pointLight1, pointLight2, cursorSorceryLight;
  let belt, beltData, beltMeshGroup;
  let stars, embers;

  // Current active theme cache
  let currentThemeCache = null;

  function updateHaloTexture(haloConfig) {
    if (!haloCtx || !haloCanvas) return;
    haloCtx.clearRect(0, 0, 128, 128);
    const grad = haloCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
    grad.addColorStop(0, haloConfig.inner);
    grad.addColorStop(0.4, haloConfig.mid);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    haloCtx.fillStyle = grad;
    haloCtx.fillRect(0, 0, 128, 128);
    if (haloTexture) haloTexture.needsUpdate = true;
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

    // 2. Scene & Atmospheric Fog
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(initialTheme?.three?.fog || 0x050c07, 0.024);

    // 3. Camera
    camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 0, 9);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =========================================================================
    // TRAILER FEATURE 1: GOTHIC CATHEDRAL COLONNADE & GOD RAYS (THRONE ROOM)
    // =========================================================================
    cathedralGroup = new THREE.Group();
    scene.add(cathedralGroup);

    // Flanking Gothic Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.24, 0.32, 28, 12);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x141816,
      roughness: 0.9,
      metalness: 0.3,
      flatShading: true
    });

    cathedralPillars = [];
    const pillarZ = [-2, -6, -10, -14, -18];
    for (let i = 0; i < pillarZ.length; i++) {
      // Left pillar
      const pLeft = new THREE.Mesh(pillarGeo, pillarMat);
      pLeft.position.set(-6.5, 3, pillarZ[i]);
      cathedralGroup.add(pLeft);
      cathedralPillars.push(pLeft);

      // Right pillar
      const pRight = new THREE.Mesh(pillarGeo, pillarMat);
      pRight.position.set(6.5, 3, pillarZ[i]);
      cathedralGroup.add(pRight);
      cathedralPillars.push(pRight);

      // Gothic Pointed Arch connecting top
      const archGeo = new THREE.TorusGeometry(3.2, 0.1, 8, 16, Math.PI);
      const archMesh = new THREE.Mesh(archGeo, pillarMat);
      archMesh.position.set(0, 10, pillarZ[i]);
      archMesh.rotation.z = Math.PI;
      cathedralGroup.add(archMesh);
    }

    // Volumetric Stained Glass God Rays (Angled Light Beams streaming down)
    godRays = [];
    const rayGeo = new THREE.CylinderGeometry(0.1, 1.8, 24, 16, 1, true);
    for (let i = 0; i < 4; i++) {
      const rayMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? (initialTheme?.three?.light1 || 0x34d399) : (initialTheme?.three?.ringColor || 0xfacc15),
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const ray = new THREE.Mesh(rayGeo, rayMat);
      ray.position.set((i - 1.5) * 3.2, 7, -8 - i * 2);
      ray.rotation.z = (i - 1.5) * -0.06;
      ray.rotation.x = 0.2;
      cathedralGroup.add(ray);
      godRays.push(ray);
    }

    // =========================================================================
    // TRAILER FEATURE 2: ARCANE LATVERIAN FLOOR SEAL (THRONE ROOM RUNES)
    // =========================================================================
    arcaneSealGroup = new THREE.Group();
    arcaneSealGroup.position.set(0, -4.2, 0);
    arcaneSealGroup.rotation.x = -Math.PI / 2.05;
    scene.add(arcaneSealGroup);

    // Outer Runic Ring
    const outerRingGeo = new THREE.RingGeometry(5.2, 5.5, 72);
    const sealMatOuter = new THREE.MeshBasicMaterial({
      color: initialTheme?.three?.light1 || 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    arcaneRingOuter = new THREE.Mesh(outerRingGeo, sealMatOuter);
    arcaneSealGroup.add(arcaneRingOuter);

    // Mid Spiked Rune Ring
    const midRingGeo = new THREE.RingGeometry(4.0, 4.25, 48);
    const sealMatMid = new THREE.MeshBasicMaterial({
      color: initialTheme?.three?.ringColor || 0xfacc15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    arcaneRingMid = new THREE.Mesh(midRingGeo, sealMatMid);
    arcaneSealGroup.add(arcaneRingMid);

    // Inner Concentric Glyph Ring
    const innerRingGeo = new THREE.RingGeometry(2.8, 2.95, 36);
    const sealMatInner = new THREE.MeshBasicMaterial({
      color: initialTheme?.three?.light1 || 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    arcaneRingInner = new THREE.Mesh(innerRingGeo, sealMatInner);
    arcaneSealGroup.add(arcaneRingInner);

    // 8-Pointed Arcane Star / Octagram
    const starShape1 = new THREE.CircleGeometry(3.6, 8);
    const starWireMat = new THREE.MeshBasicMaterial({
      color: initialTheme?.three?.ringColor || 0xfacc15,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    arcaneStar = new THREE.Mesh(starShape1, starWireMat);
    arcaneSealGroup.add(arcaneStar);

    // Rising Arcane Floor Wisps (Particles rising from runes)
    const wispCount = 180;
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
        size: 0.08,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    arcaneSealGroup.add(arcaneWisps);

    // =========================================================================
    // TRAILER FEATURE 3: 3D DOCTOR DOOM MASK / SENTINEL CYBER-HELM
    // =========================================================================
    doomMaskGroup = new THREE.Group();
    // Default position in upper quadrant, tracks cursor
    doomMaskGroup.position.set(3.4, 1.4, 2.5);
    scene.add(doomMaskGroup);

    // Metallic Faceplate
    const maskMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.95,
      roughness: 0.22,
      flatShading: true
    });

    // Faceplate Base
    const faceGeo = new THREE.CylinderGeometry(0.85, 0.65, 1.4, 10, 1, false, 0, Math.PI);
    maskFaceMesh = new THREE.Mesh(faceGeo, maskMat);
    maskFaceMesh.rotation.y = -Math.PI / 2;
    doomMaskGroup.add(maskFaceMesh);

    // Angled Brow Plate
    const browGeo = new THREE.BoxGeometry(1.2, 0.28, 0.45);
    maskBrowMesh = new THREE.Mesh(browGeo, maskMat);
    maskBrowMesh.position.set(0, 0.45, 0.42);
    doomMaskGroup.add(maskBrowMesh);

    // Riveted Jaw Grille
    const jawGeo = new THREE.BoxGeometry(0.9, 0.35, 0.35);
    maskJawMesh = new THREE.Mesh(jawGeo, maskMat);
    maskJawMesh.position.set(0, -0.45, 0.38);
    doomMaskGroup.add(maskJawMesh);

    // Glowing Menacing Eye Slits (Color synced to theme!)
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

    // Latverian Hood Cowl Silhouette (Wireframe emerald/purple/red)
    const hoodGeo = new THREE.ConeGeometry(1.4, 2.2, 8, 2, true);
    const hoodMat = new THREE.MeshBasicMaterial({
      color: initialTheme?.three?.wireframe || 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    maskHoodWire = new THREE.Mesh(hoodGeo, hoodMat);
    maskHoodWire.position.set(0, 0.2, -0.15);
    doomMaskGroup.add(maskHoodWire);

    // =========================================================================
    // TRAILER FEATURE 4: MULTIVERSE REALITY SHARDS & INCLURSION SHOCKWAVE
    // =========================================================================
    realityShards = [];
    const shardGeom1 = new THREE.OctahedronGeometry(0.35, 0);
    const shardGeom2 = new THREE.TetrahedronGeometry(0.42, 0);
    const shardGeom3 = new THREE.DodecahedronGeometry(0.32, 0);

    for (let i = 0; i < 45; i++) {
      let g = shardGeom1;
      if (i % 3 === 1) g = shardGeom2;
      else if (i % 3 === 2) g = shardGeom3;

      const shardMat = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? (initialTheme?.three?.ringColor || 0xfacc15) : (initialTheme?.three?.light1 || 0x34d399),
        roughness: 0.15,
        metalness: 0.9,
        flatShading: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const shard = new THREE.Mesh(g, shardMat);
      
      shard.userData = {
        radius: 3.2 + Math.random() * 4.8,
        angle: Math.random() * Math.PI * 2,
        speed: 0.007 + Math.random() * 0.014,
        yOffset: (Math.random() - 0.5) * 6.0,
        rotSpeedX: (Math.random() - 0.5) * 0.045,
        rotSpeedY: (Math.random() - 0.5) * 0.045,
        origRadius: 3.2 + Math.random() * 4.8,
        blastDist: 0
      };
      
      scene.add(shard);
      realityShards.push(shard);
    }

    // Incursion Expanding Shockwave Ring
    const shockwaveGeo = new THREE.RingGeometry(0.1, 0.4, 48);
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
    // MODEL STAGE 1: DOOMSDAY CRACKED PLANET & INCURSION RING
    // =========================================================================
    planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const geometry = new THREE.IcosahedronGeometry(2.6, 6);
    const pos = geometry.attributes.position;
    const colors = [];
    const vertex = new THREE.Vector3();
    vertexCrackData = [];

    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i);
      const n = Math.sin(vertex.x * 2.1) * Math.cos(vertex.y * 1.7) +
                Math.sin(vertex.z * 2.6 + vertex.x) * 0.6 +
                Math.sin(vertex.y * 5.3) * Math.cos(vertex.z * 4.1) * 0.35;
      const crack = Math.abs(Math.sin(vertex.x * 3.2 + vertex.y * 2.4) * Math.cos(vertex.z * 3.0 + vertex.y * 1.3));
      const isLava = crack < 0.07;
      const displacement = 1 + n * 0.045 - (isLava ? 0.05 : 0);

      vertex.multiplyScalar(displacement);
      pos.setXYZ(i, vertex.x, vertex.y, vertex.z);
      vertexCrackData.push({ isLava, n });

      if (isLava) {
        const lava = initialTheme?.three?.lava || { r: 0.22, g: 1.0, b: 0.5 };
        colors.push(lava.r, lava.g, lava.b);
      } else {
        const baseHsl = initialTheme?.three?.crustBaseHsl || { h: 0.38, s: 0.32, l: 0.05 };
        const c = new THREE.Color().setHSL(baseHsl.h, baseHsl.s, baseHsl.l + Math.max(n, 0) * 0.06);
        colors.push(c.r, c.g, c.b);
      }
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    planetMesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.9,
        metalness: 0.1,
        emissive: initialTheme?.three?.emissive || 0x047857,
        emissiveIntensity: initialTheme?.three?.emissiveIntensity || 0.24,
        flatShading: true,
        transparent: true,
        opacity: 1
      })
    );
    planetGroup.add(planetMesh);

    planetWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.85, 2),
      new THREE.MeshBasicMaterial({
        color: initialTheme?.three?.wireframe || 0x34d399,
        wireframe: true,
        transparent: true,
        opacity: initialTheme?.three?.wireOpacity || 0.16
      })
    );
    planetGroup.add(planetWire);

    const ringGeo = new THREE.RingGeometry(3.2, 3.48, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: initialTheme?.three?.ringColor || 0xfacc15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    incursionRing = new THREE.Mesh(ringGeo, ringMat);
    incursionRing.rotation.x = Math.PI / 2.3;
    planetGroup.add(incursionRing);

    // Glow Halo Sprite
    haloCanvas = document.createElement('canvas');
    haloCanvas.width = haloCanvas.height = 128;
    haloCtx = haloCanvas.getContext('2d');
    updateHaloTexture(initialTheme?.three?.halo || { inner: 'rgba(52,211,153,0.85)', mid: 'rgba(4,120,87,0.35)' });

    haloTexture = new THREE.CanvasTexture(haloCanvas);
    halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: haloTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
      })
    );
    halo.scale.set(11, 11, 1);
    halo.position.z = -1;
    planetGroup.add(halo);

    // =========================================================================
    // MODEL STAGE 2: DYNAMIC TRACK RELICS (GREEN / PURPLE / RED)
    // =========================================================================
    trackRelicGroup = new THREE.Group();
    trackRelicGroup.scale.set(0.001, 0.001, 0.001);
    trackRelicGroup.visible = false;
    scene.add(trackRelicGroup);

    // --- 2A. GREEN RELIC: GAIA BIO-HELIX (SUSTAINABLE DEVELOPMENT) ---
    bioHelixGroup = new THREE.Group();
    trackRelicGroup.add(bioHelixGroup);

    // Double Helix Strands
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

    // Living Spores in Helix
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
        size: 0.08,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      })
    );
    bioHelixGroup.add(bioParticles);

    // --- 2B. PURPLE RELIC: RESURRECTED SENTINEL GYRO-CORE (ROBOTICS & IoT) ---
    sentinelGyroGroup = new THREE.Group();
    trackRelicGroup.add(sentinelGyroGroup);

    // 3 Nested Gimbal Rings
    const gMat1 = new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true, transparent: true, opacity: 0.7 });
    const gMat2 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.6 });
    gyroRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.05, 12, 48), gMat1);
    gyroRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.05, 12, 48), gMat2);
    gyroRing3 = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.05, 12, 48), gMat1);
    sentinelGyroGroup.add(gyroRing1, gyroRing2, gyroRing3);

    // Sentinel Scanning Sensor Eye
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

    // Orbiting Sentinel Nodes
    laserNodes = [];
    for (let i = 0; i < 6; i++) {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 })
      );
      sentinelGyroGroup.add(node);
      laserNodes.push(node);
    }

    // --- 2C. RED RELIC: CRIMSON NEURAL ULTRON MATRIX (SOFTWARE & AI) ---
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

    // Synaptic Neural Vertex Nodes (8 corners)
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

    // Set initial active relic
    updateActiveRelicVisibility(initialTheme?.id || 'track-sustainability');

    // =========================================================================
    // MODEL STAGE 3: 4-TIER WARP PORTAL TUNNEL (3+1 EVALUATION ROUNDS)
    // =========================================================================
    warpTunnelGroup = new THREE.Group();
    warpTunnelGroup.scale.set(0.001, 0.001, 0.001);
    warpTunnelGroup.visible = false;
    scene.add(warpTunnelGroup);

    warpRings = [];
    const ringRadii = [2.2, 2.8, 3.4, 4.0];
    for (let i = 0; i < 4; i++) {
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(ringRadii[i], 0.06, 16, 64),
        new THREE.MeshStandardMaterial({
          color: i === 3 ? (initialTheme?.three?.ringColor || 0xfacc15) : (initialTheme?.three?.light1 || 0x34d399),
          emissive: initialTheme?.three?.emissive || 0x047857,
          emissiveIntensity: 0.6,
          roughness: 0.3,
          metalness: 0.7,
          transparent: true,
          opacity: 0.75
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
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.8
      })
    );
    singularityGroup.add(singularityCore);

    for (let i = 0; i < 3; i++) {
      const cRing = new THREE.Mesh(
        new THREE.TorusGeometry(2.5 + i * 0.4, 0.04, 16, 64),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? (initialTheme?.three?.light1 || 0x34d399) : (initialTheme?.three?.ringColor || 0xfacc15),
          transparent: true,
          opacity: 0.5
        })
      );
      cRing.rotation.x = Math.PI * (i / 3);
      singularityGroup.add(cRing);
    }

    // =========================================================================
    // LIGHTING & PARTICLES + CURSOR SORCERY LIGHT
    // =========================================================================
    ambientLight = new THREE.AmbientLight(initialTheme?.three?.ambient || 0x0e2418, 0.7);
    scene.add(ambientLight);

    pointLight1 = new THREE.PointLight(initialTheme?.three?.light1 || 0x34d399, 2.5, 50);
    pointLight1.position.set(-6, 4, 6);
    scene.add(pointLight1);

    pointLight2 = new THREE.PointLight(initialTheme?.three?.light2 || 0xfacc15, 0.9, 50);
    pointLight2.position.set(7, -3, -4);
    scene.add(pointLight2);

    // CURSOR SORCERY LIGHT (Dynamic light following user mouse)
    cursorSorceryLight = new THREE.PointLight(initialTheme?.three?.light1 || 0x34d399, 2.0, 20);
    cursorSorceryLight.position.set(0, 0, 7);
    scene.add(cursorSorceryLight);

    // Instanced Asteroid Belt
    const asteroidCount = 450;
    belt = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(0.09, 0),
      new THREE.MeshStandardMaterial({
        color: initialTheme?.three?.asteroids || 0x243329,
        roughness: 1,
        flatShading: true
      }),
      asteroidCount
    );

    beltData = [];
    for (let i = 0; i < asteroidCount; i++) {
      beltData.push({
        a: Math.random() * Math.PI * 2,
        r: 4.2 + Math.random() * 2.2,
        y: (Math.random() - 0.5) * 0.9,
        s: 0.2 + Math.random() * 0.8,
        k: 0.4 + Math.random() * 1.4,
        sp: 0.1 + Math.random() * 0.25
      });
    }

    beltMeshGroup = new THREE.Group();
    beltMeshGroup.rotation.x = 0.35;
    beltMeshGroup.rotation.z = -0.2;
    beltMeshGroup.add(belt);
    planetGroup.add(beltMeshGroup);

    // Particle Systems
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

    stars = createParticleSystem(950, 95, 0.06, 0xe6f2e9, 0.7);
    embers = createParticleSystem(240, 28, 0.08, initialTheme?.three?.embers || 0x6ee7b7, 0.9);
    scene.add(stars, embers);

    // =========================================================================
    // SCROLL, MOUSE TRACKING & PARALLAX
    // =========================================================================
    let mouseX = 0, mouseY = 0, scrollProgress = 0;
    let targetMaskRotY = 0, targetMaskRotX = 0;

    window.addEventListener('pointermove', e => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;

      // Update Cursor Sorcery Light position in 3D space
      if (cursorSorceryLight) {
        cursorSorceryLight.position.x = mouseX * 12;
        cursorSorceryLight.position.y = -mouseY * 8;
      }

      // 3D Doctor Doom Mask smooth gaze tracking
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

      const xPos = w > 850 ? 3.2 : 0;
      planetGroup.position.x = xPos;
      trackRelicGroup.position.x = xPos;
      warpTunnelGroup.position.x = xPos;
      singularityGroup.position.x = xPos;
      arcaneSealGroup.position.x = xPos;

      // Adjust Doom Mask position for mobile vs desktop
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

      // Play procedural explosion audio if enabled
      if (window.Doomsday && window.Doomsday.playIncursionExplosion) {
        window.Doomsday.playIncursionExplosion();
      }

      // Scatter reality shards violently outward
      for (let i = 0; i < realityShards.length; i++) {
        realityShards[i].userData.blastDist = 3.5 + Math.random() * 5.0;
      }
    }
    window.Doomsday.triggerIncursionShockwave = triggerIncursionShockwave;

    // Focus on Doom Mask
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
    const dummyMatrix = new THREE.Object3D();

    function clamp01(v) { return Math.max(0, Math.min(1, v)); }

    function animate() {
      requestAnimationFrame(animate);
      if (!prefersReducedMotion) {
        time += 0.01;
      }

      // 1. ANIMATE GOTHIC CATHEDRAL GOD RAYS
      if (godRays && godRays.length > 0) {
        for (let i = 0; i < godRays.length; i++) {
          godRays[i].material.opacity = 0.06 + Math.sin(time * 1.5 + i) * 0.035;
        }
      }

      // 2. ANIMATE ARCANE LATVERIAN FLOOR SEAL
      if (arcaneSealGroup) {
        arcaneRingOuter.rotation.z = time * 0.14;
        arcaneRingMid.rotation.z = -time * 0.18;
        arcaneRingInner.rotation.z = time * 0.22;
        arcaneStar.rotation.z = -time * 0.08;
        arcaneRingOuter.material.opacity = 0.4 + Math.sin(time * 2.2) * 0.15;

        // Rising arcane wisps
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

      // 3. ANIMATE 3D DOCTOR DOOM MASK (SMOOTH GAZE TRACKING)
      if (doomMaskGroup) {
        doomMaskGroup.rotation.y += (targetMaskRotY - doomMaskGroup.rotation.y) * 0.06;
        doomMaskGroup.rotation.x += (targetMaskRotX - doomMaskGroup.rotation.x) * 0.06;
        doomMaskGroup.position.y = (window.innerWidth > 850 ? 1.2 : 2.2) + Math.sin(time * 1.8) * 0.12;

        // Mask eye slit pulsation
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

        // Gravitational recovery after blast
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

      // STAGE 1: PLANET
      if (w1 > 0.01) {
        planetGroup.visible = true;
        planetGroup.scale.setScalar(w1 * (1 + scrollProgress * 0.4));
        planetMesh.rotation.y = planetWire.rotation.y = time * 0.25;
        planetWire.rotation.x = time * 0.1;
        incursionRing.rotation.z = time * 0.3;
        halo.material.opacity = (0.75 + Math.sin(time * 3) * 0.15) * w1;
      } else {
        planetGroup.visible = false;
      }

      // STAGE 2: DYNAMIC TRACK RELIC
      if (w2 > 0.01) {
        trackRelicGroup.visible = true;
        trackRelicGroup.scale.setScalar(w2 * 1.15);

        // Animate Bio-Helix (Green)
        if (bioHelixGroup && bioHelixGroup.visible) {
          bioHelixGroup.rotation.y = time * 0.6;
          bioParticles.rotation.y = -time * 0.4;
        }

        // Animate Sentinel Gyro-Core (Purple)
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

        // Animate Neural Ultron Matrix (Red)
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

      // Asteroid belt simulation
      if (planetGroup.visible) {
        for (let i = 0; i < asteroidCount; i++) {
          const d = beltData[i];
          const a = d.a + time * d.sp;
          const r = d.r * (1 + scrollProgress * 0.5);
          dummyMatrix.position.set(Math.cos(a) * r, d.y, Math.sin(a) * r);
          dummyMatrix.rotation.set(time * d.k, time * d.k * 0.7, 0);
          dummyMatrix.scale.setScalar(d.s * (1 + scrollProgress * 1.6));
          dummyMatrix.updateMatrix();
          belt.setMatrixAt(i, dummyMatrix.matrix);
        }
        belt.instanceMatrix.needsUpdate = true;
      }

      // Drifting embers
      const emberPos = embers.geometry.attributes.position;
      for (let i = 0; i < emberPos.count && !prefersReducedMotion; i++) {
        const y = emberPos.getY(i) + 0.014 + (i % 5) * 0.002;
        emberPos.setY(i, y > 14 ? -14 : y);
      }
      emberPos.needsUpdate = true;

      // Camera Fly-Through with Dynamic Banking
      camera.position.x += (mouseX * 1.6 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 1.1 - camera.position.y) * 0.04;
      camera.position.z = 9 + scrollProgress * 6.5;
      camera.rotation.z = -mouseX * 0.06; // Cinematic camera banking
      camera.lookAt(0, 0, 0);

      stars.rotation.y = time * 0.01;

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

    if (ambientLight) ambientLight.color.setHex(cfg.ambient);
    if (pointLight1) pointLight1.color.setHex(cfg.light1);
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

    // Update Cathedral God Rays
    if (godRays && godRays.length > 0) {
      godRays.forEach((ray, idx) => {
        if (ray.material) {
          ray.material.color.setHex(idx % 2 === 0 ? cfg.light1 : (cfg.ringColor || cfg.light2));
        }
      });
    }

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

    // Planet
    if (planetMesh && planetMesh.material) {
      planetMesh.material.emissive.setHex(cfg.emissive);
      planetMesh.material.emissiveIntensity = cfg.emissiveIntensity;

      const geom = planetMesh.geometry;
      const colAttr = geom.attributes.color;
      if (colAttr && vertexCrackData.length === colAttr.count) {
        for (let i = 0; i < colAttr.count; i++) {
          const { isLava, n } = vertexCrackData[i];
          if (isLava) {
            colAttr.setXYZ(i, cfg.lava.r, cfg.lava.g, cfg.lava.b);
          } else {
            const c = new THREE.Color().setHSL(cfg.crustBaseHsl.h, cfg.crustBaseHsl.s, cfg.crustBaseHsl.l + Math.max(n, 0) * 0.06);
            colAttr.setXYZ(i, c.r, c.g, c.b);
          }
        }
        colAttr.needsUpdate = true;
      }
    }

    if (planetWire && planetWire.material) {
      planetWire.material.color.setHex(cfg.wireframe);
      planetWire.material.opacity = cfg.wireOpacity;
    }

    if (incursionRing && incursionRing.material) {
      incursionRing.material.color.setHex(cfg.ringColor || cfg.light2);
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

    updateHaloTexture(cfg.halo);
  }

  window.Doomsday.initScene = initScene;
  window.Doomsday.updateSceneColors = updateSceneColors;
})();