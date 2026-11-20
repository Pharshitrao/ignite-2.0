/**
 * IGNITE 2.0 — DOOMSDAY EDITION: CINEMATIC AUDIO ENGINE & THEME PLAYER
 * Plays the official "Avengers: Doomsday" theme song in the background.
 * 
 * Features:
 * 1. Native HTML5 Audio streaming for "assets/audio/avengers-doomsday-theme.mp3"
 * 2. Real-time procedural Alan Silvestri "Avengers: Doomsday" Orchestral Synthesizer
 *    (Full Hollywood brass horns, driving battle ostinato strings, sub-bass drones,
 *    and tympani war drums synthesized natively via Web Audio API)
 * 3. Smooth fade-in, fade-out, volume memory, and animated equalizer indicator
 */

(function() {
  window.Doomsday = window.Doomsday || {};

  let audioCtx = null;
  let masterGain = null;
  let isSoundEnabled = false;
  let isPlayingTheme = false;
  let currentVolume = 0.7;

  // HTML5 Audio Element for external MP3
  let bgAudioEl = null;
  let isUsingAudioFile = false;

  // Official Avengers: Doomsday YouTube Audio Integration (https://youtu.be/xE2xV6m1q50)
  const YOUTUBE_TRACK_ID = 'xE2xV6m1q50';
  let ytPlayer = null;
  let isYtReady = false;
  let ytPlayerInitStarted = false;

  function loadYouTubeAPI() {
    if (ytPlayerInitStarted) return;
    ytPlayerInitStarted = true;

    let container = document.getElementById('yt-player-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'yt-player-container';
      document.body.appendChild(container);
    }

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function() {
      if (typeof prevReady === 'function') {
        try { prevReady(); } catch (e) {}
      }
      initYouTubePlayer();
    };

    if (window.YT && window.YT.Player) {
      initYouTubePlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(tag, firstScript);
      } else {
        document.head.appendChild(tag);
      }
    }
  }

  function initYouTubePlayer() {
    if (ytPlayer || !window.YT || !window.YT.Player) return;
    try {
      ytPlayer = new YT.Player('yt-player-container', {
        height: '1',
        width: '1',
        videoId: YOUTUBE_TRACK_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          loop: 1,
          playlist: YOUTUBE_TRACK_ID,
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: function(e) {
            isYtReady = true;
            try {
              e.target.setVolume(Math.round(currentVolume * 100));
            } catch (err) {}
            if (isPlayingTheme) {
              try { e.target.playVideo(); } catch (err) {}
            }
          },
          onStateChange: function(e) {
            if (e.data === YT.PlayerState.PLAYING) {
              isPlayingTheme = true;
              isSoundEnabled = true;
              stopProceduralTheme();
              if (bgAudioEl) {
                try { bgAudioEl.pause(); } catch (err) {}
              }
              updateUIState(true);
            } else if (e.data === YT.PlayerState.PAUSED) {
              isPlayingTheme = false;
              updateUIState(false);
            } else if (e.data === YT.PlayerState.ENDED) {
              try {
                e.target.seekTo(0);
                e.target.playVideo();
              } catch (err) {}
            }
          },
          onError: function() {
            if (isPlayingTheme && !isUsingAudioFile) {
              scheduleDoomsdayTheme();
            }
          }
        }
      });
    } catch (e) {
      console.warn('YouTube theme player init error', e);
    }
  }

  // Procedural Synthesizer State
  let synthLoopTimeout = null;
  let activeNodes = [];

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(currentVolume, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // =========================================================================
  // ALAN SILVESTRI "AVENGERS: DOOMSDAY" CINEMATIC ORCHESTRAL SYNTHESIZER
  // =========================================================================

  // Note frequency lookup table (Hz)
  const NOTES = {
    'E2': 82.41, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F#3': 185.00, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F#4': 369.99, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25
  };

  /**
   * Synthesize rich Hollywood French Horn / Brass voice
   */
  function playBrassNote(freq, startTime, duration, velocity = 0.28) {
    if (!audioCtx || !masterGain) return;

    // 1. Dual detuned sawtooth oscillators for warm brass chorus
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const subOsc = audioCtx.createOscillator();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    subOsc.type = 'triangle';

    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 1.004, startTime); // Subtle 7-cent detune
    subOsc.frequency.setValueAtTime(freq / 2, startTime); // Sub octave body

    // 2. Resonant 24dB Moog-style brass filter envelope
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(3.5, startTime);
    filter.frequency.setValueAtTime(freq * 1.2, startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.min(freq * 4.8, 4800), startTime + 0.12); // Brass bite attack
    filter.frequency.exponentialRampToValueAtTime(freq * 2.2, startTime + duration); // Warm decay

    // 3. Amplitude envelope
    const noteGain = audioCtx.createGain();
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(velocity, startTime + 0.08); // Swelling horn attack
    noteGain.gain.setValueAtTime(velocity * 0.9, startTime + duration - 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 0.15); // Smooth release

    // Connect voice
    osc1.connect(filter);
    osc2.connect(filter);
    subOsc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    subOsc.start(startTime);

    const stopTime = startTime + duration + 0.18;
    osc1.stop(stopTime);
    osc2.stop(stopTime);
    subOsc.stop(stopTime);

    activeNodes.push(osc1, osc2, subOsc);
  }

  /**
   * Synthesize heavy orchestral Tympani War Drum impact
   */
  function playTympaniImpact(startTime, velocity = 0.35) {
    if (!audioCtx || !masterGain) return;

    const drumOsc = audioCtx.createOscillator();
    const drumGain = audioCtx.createGain();

    drumOsc.type = 'sine';
    drumOsc.frequency.setValueAtTime(115, startTime);
    drumOsc.frequency.exponentialRampToValueAtTime(42, startTime + 0.45);

    drumGain.gain.setValueAtTime(velocity, startTime);
    drumGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65);

    drumOsc.connect(drumGain);
    drumGain.connect(masterGain);

    drumOsc.start(startTime);
    drumOsc.stop(startTime + 0.7);
    activeNodes.push(drumOsc);
  }

  /**
   * Synthesize dark rhythmic cello ostinato
   */
  function playOstinatoNote(freq, startTime, duration = 0.12) {
    if (!audioCtx || !masterGain) return;

    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, startTime);

    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
    activeNodes.push(osc);
  }

  /**
   * Play the iconic Alan Silvestri Avengers: Doomsday melodic cycle
   */
  function scheduleDoomsdayTheme(startT) {
    if (!isPlayingTheme || isUsingAudioFile) return;

    const t = startT || (audioCtx ? audioCtx.currentTime + 0.1 : 0);

    // Continuous deep sub-bass cinematic drone (Latverian incursion hum)
    const droneOsc = audioCtx.createOscillator();
    const droneGain = audioCtx.createGain();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(41.2, t); // E1 (41.2 Hz)
    droneGain.gain.setValueAtTime(0.12, t);
    droneOsc.connect(droneGain);
    droneGain.connect(masterGain);
    droneOsc.start(t);
    droneOsc.stop(t + 22.0);
    activeNodes.push(droneOsc);

    // =========================================================================
    // SECTION A: THE ICONIC DOOMSDAY BRASS THEME (Alan Silvestri Motif)
    // =========================================================================
    const melody = [
      // Phrase 1: The Gathering Threat (Dun... Dun... Dun-Dun-Dun)
      { note: 'B3', delay: 0.0, dur: 0.35, vel: 0.22 },
      { note: 'E4', delay: 0.6, dur: 1.10, vel: 0.32, tympani: true },
      { note: 'F#4', delay: 1.9, dur: 0.35, vel: 0.26 },
      { note: 'G4', delay: 2.4, dur: 1.10, vel: 0.34, tympani: true },
      { note: 'A4', delay: 3.7, dur: 0.50, vel: 0.32 },
      { note: 'G4', delay: 4.3, dur: 0.35, vel: 0.28 },
      { note: 'F#4', delay: 4.8, dur: 0.50, vel: 0.30 },
      { note: 'E4', delay: 5.4, dur: 0.50, vel: 0.28 },
      { note: 'D4', delay: 6.0, dur: 0.35, vel: 0.26 },
      { note: 'E4', delay: 6.5, dur: 1.80, vel: 0.38, tympani: true },

      // Phrase 2: The Latverian Climax (Heroic & Ominous Brass Ascent)
      { note: 'B3', delay: 8.8, dur: 0.35, vel: 0.26 },
      { note: 'E4', delay: 9.3, dur: 1.10, vel: 0.34, tympani: true },
      { note: 'G4', delay: 10.6, dur: 0.35, vel: 0.30 },
      { note: 'B4', delay: 11.1, dur: 1.30, vel: 0.40, tympani: true },
      { note: 'C5', delay: 12.6, dur: 0.55, vel: 0.36 },
      { note: 'B4', delay: 13.3, dur: 0.40, vel: 0.32 },
      { note: 'A4', delay: 13.8, dur: 0.55, vel: 0.34 },
      { note: 'G4', delay: 14.5, dur: 0.55, vel: 0.32 },
      { note: 'F#4', delay: 15.2, dur: 1.10, vel: 0.35, tympani: true },
      { note: 'D4', delay: 16.5, dur: 0.45, vel: 0.30 },
      { note: 'E4', delay: 17.1, dur: 2.80, vel: 0.45, tympani: true }
    ];

    melody.forEach(m => {
      const noteTime = t + m.delay;
      playBrassNote(NOTES[m.note], noteTime, m.dur, m.vel);
      if (m.tympani) {
        playTympaniImpact(noteTime, 0.32);
      }
    });

    // =========================================================================
    // SECTION B: RHYTHMIC TENSION OSTINATO (Driving Cellos Underneath)
    // =========================================================================
    const ostinatoInterval = 0.28;
    const totalBeats = Math.floor(20.0 / ostinatoInterval);
    for (let i = 0; i < totalBeats; i++) {
      const beatT = t + i * ostinatoInterval;
      // Pattern modulation
      let note = NOTES['E2'];
      if (i > 24 && i < 36) note = NOTES['G2'];
      if (i >= 36 && i < 48) note = NOTES['C3'];
      if (i >= 48) note = NOTES['D3'];
      playOstinatoNote(note, beatT, 0.16);
    }

    // Schedule next seamless loop (21.5 seconds per cycle)
    synthLoopTimeout = setTimeout(() => {
      if (isPlayingTheme && !isUsingAudioFile) {
        scheduleDoomsdayTheme();
      }
    }, 21500);
  }

  function stopProceduralTheme() {
    if (synthLoopTimeout) {
      clearTimeout(synthLoopTimeout);
      synthLoopTimeout = null;
    }
    activeNodes.forEach(node => {
      try { node.stop(); } catch (e) {}
    });
    activeNodes = [];
  }

  // =========================================================================
  // AUDIO CONTROLS & UI SYNCHRONIZATION
  // =========================================================================

  function playTheme() {
    initAudioContext();
    isPlayingTheme = true;
    isSoundEnabled = true;

    // 1. Prioritize official YouTube audio stream (https://youtu.be/xE2xV6m1q50)
    if (ytPlayer && isYtReady) {
      try {
        ytPlayer.setVolume(Math.round(currentVolume * 100));
        ytPlayer.playVideo();
        stopProceduralTheme();
        if (bgAudioEl) {
          try { bgAudioEl.pause(); } catch (e) {}
        }
        updateUIState(true);
        return;
      } catch (e) {}
    } else {
      loadYouTubeAPI();
    }

    // 2. Check if background audio element can play local MP3
    bgAudioEl = document.getElementById('bg-music');
    if (!bgAudioEl) {
      bgAudioEl = new Audio('assets/audio/avengers-doomsday-theme.mp3');
      bgAudioEl.id = 'bg-music';
      bgAudioEl.loop = true;
      document.body.appendChild(bgAudioEl);
    }

    bgAudioEl.volume = currentVolume;
    const playPromise = bgAudioEl.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        // MP3 File is available and playing
        isUsingAudioFile = true;
        stopProceduralTheme();
        updateUIState(true);
      }).catch(err => {
        // If MP3 file not found, fall back to procedural synthesizer until YouTube connects
        isUsingAudioFile = false;
        if (!isYtReady) {
          scheduleDoomsdayTheme();
        }
        updateUIState(true);
      });
    } else {
      isUsingAudioFile = false;
      if (!isYtReady) {
        scheduleDoomsdayTheme();
      }
      updateUIState(true);
    }
  }

  function pauseTheme() {
    isPlayingTheme = false;
    isSoundEnabled = false;

    if (ytPlayer && isYtReady) {
      try { ytPlayer.pauseVideo(); } catch (e) {}
    }
    if (bgAudioEl) {
      try { bgAudioEl.pause(); } catch (e) {}
    }
    stopProceduralTheme();
    updateUIState(false);
  }

  function toggleTheme() {
    if (isPlayingTheme) {
      pauseTheme();
    } else {
      playTheme();
    }
  }

  function setVolume(val) {
    currentVolume = Math.max(0, Math.min(1, parseFloat(val)));
    if (ytPlayer && isYtReady) {
      try { ytPlayer.setVolume(Math.round(currentVolume * 100)); } catch (e) {}
    }
    if (bgAudioEl) {
      bgAudioEl.volume = currentVolume;
    }
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(currentVolume, audioCtx.currentTime);
    }
    try {
      localStorage.setItem('doomsday_audio_volume', currentVolume.toString());
    } catch (e) {}
  }

  function updateUIState(isPlaying) {
    const audioToggleBtn = document.getElementById('audio-toggle');
    const hudPlayBtn = document.getElementById('hud-play-btn');
    const hudWidget = document.getElementById('doomsday-audio-hud');

    if (audioToggleBtn) {
      if (isPlaying) {
        audioToggleBtn.classList.add('active');
        audioToggleBtn.setAttribute('aria-pressed', 'true');
        audioToggleBtn.innerHTML = `
          <span class="equalizer-anim">
            <span class="equalizer-bar"></span>
            <span class="equalizer-bar"></span>
            <span class="equalizer-bar"></span>
            <span class="equalizer-bar"></span>
          </span>
          DOOMSDAY THEME
        `;
      } else {
        audioToggleBtn.classList.remove('active');
        audioToggleBtn.setAttribute('aria-pressed', 'false');
        audioToggleBtn.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
          THEME OFF
        `;
      }
    }

    if (hudPlayBtn) {
      hudPlayBtn.innerHTML = isPlaying ? '❚❚' : '▶';
      hudPlayBtn.setAttribute('aria-label', isPlaying ? 'Pause Theme' : 'Play Theme');
    }

    if (hudWidget) {
      if (isPlaying) {
        hudWidget.classList.add('playing');
      } else {
        hudWidget.classList.remove('playing');
      }
    }
  }

  // Tactical click / interaction sounds
  function playChirp(freq = 1200, type = 'sine', duration = 0.04) {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(masterGain || audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playIncursionPulse() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      playBrassNote(164.81, audioCtx.currentTime, 0.4, 0.15); // E3 horn blast
    } catch (e) {}
  }

  function playIncursionExplosion() {
    if (!isSoundEnabled || !audioCtx) return;
    playTympaniImpact(audioCtx.currentTime, 0.45);
  }

  function playMetallicClank() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(masterGain || audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch (e) {}
  }

  function wireAudioInteractions() {
    // Preload YouTube API for official theme audio
    loadYouTubeAPI();

    // Restore saved volume
    try {
      const savedVol = localStorage.getItem('doomsday_audio_volume');
      if (savedVol !== null) {
        currentVolume = parseFloat(savedVol);
      }
    } catch (e) {}

    // Top Header Button Toggle
    const audioToggleBtn = document.getElementById('audio-toggle');
    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        toggleTheme();
      });
    }

    // Floating HUD Music Player
    const hudPlayBtn = document.getElementById('hud-play-btn');
    if (hudPlayBtn) {
      hudPlayBtn.addEventListener('click', () => {
        toggleTheme();
      });
    }

    const volSlider = document.getElementById('hud-vol-slider');
    if (volSlider) {
      volSlider.value = currentVolume;
      volSlider.addEventListener('input', (e) => {
        setVolume(e.target.value);
      });
    }

    // Interactive button audio effects
    document.querySelectorAll('button, a.btn, .preset-chip, a.villain-track-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        playChirp(1200, 'sine', 0.03);
      });
    });

    // First user gesture unlocks audio context
    const unlockAudio = () => {
      initAudioContext();
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
  }

  window.Doomsday.playTheme = playTheme;
  window.Doomsday.pauseTheme = pauseTheme;
  window.Doomsday.toggleTheme = toggleTheme;
  window.Doomsday.setVolume = setVolume;
  window.Doomsday.playChirp = playChirp;
  window.Doomsday.playIncursionPulse = playIncursionPulse;
  window.Doomsday.playIncursionExplosion = playIncursionExplosion;
  window.Doomsday.playMetallicClank = playMetallicClank;
  window.Doomsday.wireAudioInteractions = wireAudioInteractions;
})();
