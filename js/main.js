/**
 * IGNITE 2.0 — DOOMSDAY EDITION: APPLICATION ENTRY POINT
 * Orchestrates countdown, theme switcher, 3D WebGL scene, AI co-pilot, audio,
 * interactive dual-poster holographic viewer, and trailer incursion animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  const {
    initThemes,
    getActiveTheme,
    onThemeChange,
    initScene,
    updateSceneColors,
    initCountdown,
    initAITerminal,
    wireAudioInteractions,
    triggerIncursionShockwave,
    focusDoomMask,
    setTheme
  } = window.Doomsday || {};

  // 1. Initialize Faction Themes Engine
  if (initThemes) {
    initThemes();
  }

  const currentTheme = getActiveTheme ? getActiveTheme() : null;

  // 2. Initialize 3D WebGL Multiverse Scene
  if (initScene) {
    initScene(currentTheme);
  }

  // 3. Connect real-time theme shifts to the 3D WebGL canvas
  if (onThemeChange && updateSceneColors) {
    onThemeChange((newTheme) => {
      updateSceneColors(newTheme);
    });
  }

  // 4. Initialize Countdown to 11 December 2026, 09:00 AM
  if (initCountdown) {
    initCountdown(11, 11, 9, 0);
  }

  // 5. Initialize AI Co-Pilot / Brainstorming Assistant
  if (initAITerminal) {
    initAITerminal();
  }

  // 6. Initialize Audio Synthesizer interactions
  if (wireAudioInteractions) {
    wireAudioInteractions();
  }

  // =========================================================================
  // INTERACTIVE DUAL-POSTER HOLOGRAPHIC SWITCHER & 3D TILT
  // =========================================================================
  const posterTabs = document.querySelectorAll('.poster-tab-btn');
  const posterFrames = document.querySelectorAll('.hero-poster-frame');

  posterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-poster');
      
      posterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      posterFrames.forEach(f => {
        if (f.id === `poster-${target}`) {
          f.classList.add('active');
        } else {
          f.classList.remove('active');
        }
      });
    });
  });

  // 3D Holographic Perspective Tilt on Hover
  const tiltContainer = document.getElementById('poster-tilt-container');
  if (tiltContainer) {
    tiltContainer.addEventListener('mousemove', (e) => {
      const rect = tiltContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const activeFrame = tiltContainer.querySelector('.hero-poster-frame.active');
      if (activeFrame) {
        activeFrame.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale3d(1.02, 1.02, 1.02)`;
      }
    });

    tiltContainer.addEventListener('mouseleave', () => {
      const activeFrame = tiltContainer.querySelector('.hero-poster-frame.active');
      if (activeFrame) {
        activeFrame.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
      }
    });
  }

  // =========================================================================
  // TRAILER 3D CONTROLS: TRIGGER INCURSION SHOCKWAVE & DOOM MASK FOCUS
  // =========================================================================
  const incursionBtn = document.getElementById('btn-trigger-incursion');
  if (incursionBtn) {
    incursionBtn.addEventListener('click', () => {
      // Trigger 3D explosion
      if (triggerIncursionShockwave) {
        triggerIncursionShockwave();
      }

      // Add screen tremor
      document.body.classList.add('incursion-tremor');
      setTimeout(() => {
        document.body.classList.remove('incursion-tremor');
      }, 550);
    });
  }

  const maskFocusBtn = document.getElementById('btn-focus-mask');
  if (maskFocusBtn) {
    maskFocusBtn.addEventListener('click', () => {
      if (focusDoomMask) {
        focusDoomMask();
      }

      // Add brief incursion tremor
      document.body.classList.add('incursion-tremor');
      setTimeout(() => {
        document.body.classList.remove('incursion-tremor');
      }, 350);
    });
  }

  // Hovering over track cards previews its 3D relic and theme
  document.querySelectorAll('.villain-track-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const targetTheme = card.getAttribute('data-faction-target');
      if (targetTheme && setTheme) {
        setTheme(targetTheme);
      }
    });
  });
});
