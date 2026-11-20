/**
 * IGNITE 2.0 — DOOMSDAY EDITION: PROCEDURAL AUDIO SYNTHESIZER
 * Synthesizes cinematic Doomsday sub-bass drones, sorcery pulses, incursion shockwaves,
 * metallic mask mechanical locks, and interface chirps.
 * Uses native Web Audio API with zero external audio assets.
 */

(function() {
  window.Doomsday = window.Doomsday || {};

  let audioCtx = null;
  let isSoundEnabled = false;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playChirp(freq = 880, type = 'sine', duration = 0.08) {
    if (!isSoundEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  // Cinematic Doomsday Sorcery Pulse Sound
  function playIncursionPulse() {
    if (!isSoundEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, audioCtx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}
  }

  // Explosive Multiverse Incursion Shockwave (Trailer Feature)
  function playIncursionExplosion() {
    if (!isSoundEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const t = audioCtx.currentTime;
      // Sub-bass rumble
      const subOsc = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(80, t);
      subOsc.frequency.exponentialRampToValueAtTime(28, t + 1.2);
      subGain.gain.setValueAtTime(0.18, t);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      subOsc.connect(subGain);
      subGain.connect(audioCtx.destination);
      subOsc.start(t);
      subOsc.stop(t + 1.2);

      // White noise distortion blast
      const bufferSize = audioCtx.sampleRate * 0.4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.08));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.08, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      noise.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noise.start(t);
    } catch (e) {}
  }

  // Metallic Mechanical Mask Clank / Lock Sound
  function playMetallicClank() {
    if (!isSoundEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    } catch (e) {}
  }

  function toggleSound(btnElement) {
    initAudioContext();
    isSoundEnabled = !isSoundEnabled;

    if (btnElement) {
      if (isSoundEnabled) {
        btnElement.classList.add('active');
        btnElement.setAttribute('aria-pressed', 'true');
        btnElement.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          AUDIO ON
        `;
        playIncursionPulse();
      } else {
        btnElement.classList.remove('active');
        btnElement.setAttribute('aria-pressed', 'false');
        btnElement.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
          AUDIO OFF
        `;
      }
    }
  }

  function wireAudioInteractions() {
    document.querySelectorAll('button, a.btn, .preset-chip, a.villain-track-card, .poster-tab-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        playChirp(1200, 'sine', 0.04);
      });
      el.addEventListener('click', () => {
        playIncursionPulse();
      });
    });

    const audioToggleBtn = document.getElementById('audio-toggle');
    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => toggleSound(audioToggleBtn));
    }
  }

  window.Doomsday.playChirp = playChirp;
  window.Doomsday.playIncursionPulse = playIncursionPulse;
  window.Doomsday.playIncursionExplosion = playIncursionExplosion;
  window.Doomsday.playMetallicClank = playMetallicClank;
  window.Doomsday.toggleSound = toggleSound;
  window.Doomsday.wireAudioInteractions = wireAudioInteractions;
})();

  window.Doomsday.playChirp = playChirp;
  window.Doomsday.playIncursionPulse = playIncursionPulse;
  window.Doomsday.toggleSound = toggleSound;
  window.Doomsday.wireAudioInteractions = wireAudioInteractions;
})();
