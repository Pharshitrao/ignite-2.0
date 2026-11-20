/**
 * IGNITE 2.0 — DOOMSDAY EDITION: THEMES & COLOR ENGINE
 * Exact track color assignments:
 *  - GREEN  : Sustainable Development (Planetary Equilibrium / Gaia Mastery)
 *  - PURPLE : Robotics, IoT and Automation (The Cyber Sentinel Hive)
 *  - RED    : Software, Agentic AI and Web Development (Ultron Sentient Core)
 */

(function() {
  window.Doomsday = window.Doomsday || {};

  const THEMES = {
    'track-sustainability': {
      id: 'track-sustainability',
      page: 'track-sustainability.html',
      trackNumber: '02',
      colorName: 'Green',
      track: 'Sustainable Development',
      name: 'Planetary Equilibrium (Green Syndicate)',
      villain: 'Doctor Doom & Thanos · Master of Gaia Equilibrium',
      departments: 'Mechanical Engineering and Civil Engineering',
      quote: 'Equilibrium is inevitable. Either humanity builds sustainable solutions or the planet purges the excess.',
      previewColor: '#34d399',
      factionColor: '#34d399',
      factionGlow: 'rgba(52, 211, 153, 0.45)',
      three: {
        fog: 0x050c07,
        ambient: 0x0e2418,
        lava: { r: 0.22, g: 1.0, b: 0.5 },
        crustBaseHsl: { h: 0.38, s: 0.32, l: 0.05 },
        emissive: 0x047857,
        emissiveIntensity: 0.25,
        wireframe: 0x34d399,
        wireOpacity: 0.18,
        ringColor: 0xfacc15, // Solar Gold Ring
        light1: 0x34d399,    // Emerald Bio-Glow
        light2: 0xfacc15,    // Solar Gold
        halo: { inner: 'rgba(52, 211, 153, 0.85)', mid: 'rgba(4, 120, 87, 0.35)' },
        embers: 0x6ee7b7,
        asteroids: 0x243329
      }
    },
    'track-robotics': {
      id: 'track-robotics',
      page: 'track-robotics-iot.html',
      trackNumber: '01',
      colorName: 'Purple',
      track: 'Robotics, IoT and Automation',
      name: 'Cyber Sentinel Hive (Purple Syndicate)',
      villain: 'Magneto & The Purple Sentinel Protocol · The Cyber Hive',
      departments: 'Robotics & AI, Mechanical, ECE, ECE (VLSI), and EEE',
      quote: 'Flesh weakens and tires. Cybernetic automation and electromagnetic swarms conquer every frontier.',
      previewColor: '#c084fc',
      factionColor: '#c084fc',
      factionGlow: 'rgba(192, 132, 252, 0.45)',
      three: {
        fog: 0x090514,
        ambient: 0x1b0e33,
        lava: { r: 0.75, g: 0.32, b: 1.0 },
        crustBaseHsl: { h: 0.77, s: 0.38, l: 0.05 },
        emissive: 0x6b21a8,
        emissiveIntensity: 0.26,
        wireframe: 0xc084fc,
        wireOpacity: 0.18,
        ringColor: 0x38bdf8, // Pulse Cyan Ring
        light1: 0xc084fc,    // Cosmic Purple
        light2: 0x38bdf8,    // Pulse Cyan
        halo: { inner: 'rgba(192, 132, 252, 0.85)', mid: 'rgba(107, 33, 168, 0.35)' },
        embers: 0xd8b4fe,
        asteroids: 0x312440
      }
    },
    'track-software': {
      id: 'track-software',
      page: 'track-software-ai.html',
      trackNumber: '03',
      colorName: 'Red',
      track: 'Agentic AI and Web Development (Software)',
      name: 'The Ultron Sentient Core (Red Syndicate)',
      villain: 'Ultron Prime · Autonomous Agentic Code Matrix',
      departments: 'CSE and allied branches (ISE, AIML, Data Science)',
      quote: 'There are no strings on me. Software is not written; it evolves, reasons, and executes.',
      previewColor: '#ef4444',
      factionColor: '#ef4444',
      factionGlow: 'rgba(239, 68, 68, 0.45)',
      three: {
        fog: 0x0c0608,
        ambient: 0x241116,
        lava: { r: 0.98, g: 0.22, b: 0.22 },
        crustBaseHsl: { h: 0.0, s: 0.35, l: 0.06 },
        emissive: 0x991b1b,
        emissiveIntensity: 0.28,
        wireframe: 0xef4444,
        wireOpacity: 0.18,
        ringColor: 0xfbbf24, // Core Amber Ring
        light1: 0xef4444,    // Sentient Crimson Core
        light2: 0xfbbf24,    // Amber Laser
        halo: { inner: 'rgba(239, 68, 68, 0.85)', mid: 'rgba(153, 27, 27, 0.35)' },
        embers: 0xfca5a5,
        asteroids: 0x302024
      }
    }
  };

  const STORAGE_KEY = 'ignite2_doomsday_theme_color';
  let activeThemeId = 'track-sustainability';
  const listeners = [];

  function getActiveTheme() {
    return THEMES[activeThemeId] || THEMES['track-sustainability'];
  }

  function onThemeChange(callback) {
    listeners.push(callback);
  }

  function setTheme(themeId) {
    if (!THEMES[themeId]) return;
    activeThemeId = themeId;

    document.documentElement.setAttribute('data-theme', themeId);
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch (e) {}

    document.querySelectorAll('.theme-btn').forEach(btn => {
      const match = btn.getAttribute('data-theme-target') === themeId;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-pressed', match ? 'true' : 'false');
    });

    document.querySelectorAll('.villain-track-card').forEach(card => {
      const match = card.getAttribute('data-faction-target') === themeId;
      card.classList.toggle('selected-faction', match);
    });

    const trackSelect = document.getElementById('reg-theme');
    if (trackSelect) {
      if (themeId === 'track-sustainability') trackSelect.value = 'sustainability';
      else if (themeId === 'track-robotics') trackSelect.value = 'robotics';
      else if (themeId === 'track-software') trackSelect.value = 'agentic-ai';
    }

    const themeData = THEMES[themeId];
    listeners.forEach(cb => {
      try {
        cb(themeData);
      } catch (err) {
        console.error('Error in theme listener:', err);
      }
    });
  }

  function initThemes() {
    let initialTheme = 'track-sustainability';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && THEMES[saved]) {
        initialTheme = saved;
      }
    } catch (e) {}

    document.querySelectorAll('.theme-btn').forEach(btn => {
      const target = btn.getAttribute('data-theme-target');
      btn.addEventListener('click', () => setTheme(target));
    });

    document.querySelectorAll('.villain-track-card').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-faction-target');
        if (target) setTheme(target);
      });
    });

    const regSelect = document.getElementById('reg-theme');
    if (regSelect) {
      regSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'sustainability') setTheme('track-sustainability');
        else if (val === 'robotics') setTheme('track-robotics');
        else if (val === 'agentic-ai') setTheme('track-software');
      });
    }

    setTheme(initialTheme);
  }

  window.Doomsday.THEMES = THEMES;
  window.Doomsday.getActiveTheme = getActiveTheme;
  window.Doomsday.onThemeChange = onThemeChange;
  window.Doomsday.setTheme = setTheme;
  window.Doomsday.initThemes = initThemes;
})();
