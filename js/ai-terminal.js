/**
 * IGNITE 2.0 — DOOMSDAY EDITION: THEME IDEATION CO-PILOT
 * Open Brainstorming Assistant for participants to explore tech stacks and architectural guidelines.
 * Respects the open problem policy: no prescribed fixed projects.
 */

(function() {
  window.Doomsday = window.Doomsday || {};

  const IDEATION_PATTERNS = {
    sustainability: {
      color: "GREEN",
      theme: "Sustainable Development",
      departments: "Mechanical Engineering and Civil Engineering",
      architectures: [
        {
          title: "Closed-Loop Environmental Monitoring & Fluid Control",
          suggestedStack: "Environmental Sensors (pH, Turbidity, TDS) · Microcontroller (ESP32/STM32) · Automated Solenoid Valves · Local Dashboard",
          guideline: "Identify a local resource constraint (water, clean energy, waste) and build a prototype that automates circular conservation."
        },
        {
          title: "Passive Climate Resilience & Micro-Infrastructure",
          suggestedStack: "Hydrological Depth Sensors · Low-Power Alert Radios · Geospatial Mapping · Fail-safe Pneumatic Actuators",
          guideline: "Target hazard prediction (flash floods, urban heat islands) with low-cost hardware and physical models."
        }
      ]
    },
    robotics: {
      color: "PURPLE",
      theme: "Robotics, IoT and Automation",
      departments: "Robotics & AI, Mech, ECE, ECE (VLSI), EEE",
      architectures: [
        {
          title: "Autonomous Mobile Robotics with Edge Computer Vision",
          suggestedStack: "Differential-Drive Rover Chassis · TinyML Camera Node · Motor Drivers · Ultrasonic Array · ROS2 / Micro-ROS",
          guideline: "Focus on perception, autonomous navigation, obstacle clearance, and payload execution in unstructured terrain."
        },
        {
          title: "Industrial Edge IoT & Vibration Telemetry Swarm",
          suggestedStack: "MEMS High-Frequency Accelerometer · Micro-Controller (ESP32) · MQTT Protocol · Local Telemetry Visualization",
          guideline: "Design an intelligent telemetry sensor node that detects machine anomalies before breakdown."
        }
      ]
    },
    software: {
      color: "RED",
      theme: "Agentic AI & Web Development (Software)",
      departments: "CSE and allied branches (ISE, AIML, Data Science)",
      architectures: [
        {
          title: "Autonomous Multi-Agent Collaborative Workflow",
          suggestedStack: "Gemini 2.5 Flash / Local Small LLMs (Ollama) · LangGraph / Custom Agent Loop · WebSockets · React / Svelte / Vanilla",
          guideline: "Design specialized autonomous agents that plan, verify, and execute complex workflows without human intervention."
        },
        {
          title: "Offline-First Peer-to-Peer Web Application (PWA)",
          suggestedStack: "PWA ServiceWorkers · WebRTC DataChannels · Conflict-free Replicated Data Types (CRDTs) · IndexedDB",
          guideline: "Build collaborative browser applications that seamlessly synchronize across devices over local networks with zero internet access."
        }
      ]
    }
  };

  let isTyping = false;

  function typeWriter(element, text, speed = 10, callback) {
    element.innerHTML = '';
    isTyping = true;
    let i = 0;

    function step() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(step, speed);
      } else {
        isTyping = false;
        if (callback) callback();
      }
    }
    step();
  }

  function generateBrainstorm(trackKey, query) {
    const outputEl = document.getElementById('ai-output');
    if (!outputEl || isTyping) return;

    let key = trackKey;
    if (key === 'agentic-ai') key = 'software';

    const info = IDEATION_PATTERNS[key] || IDEATION_PATTERNS.sustainability;
    const pattern = info.architectures[Math.floor(Math.random() * info.architectures.length)];

    const queryTag = query ? ` // FOCUS QUERY: ${query.toUpperCase()}` : '';

    const formattedLog = `
[IGNITE 2.0 // THEME IDEATION CO-PILOT: ONLINE]
[SPECTRUM: ${info.color} // THEME: ${info.theme.toUpperCase()}${queryTag}]
----------------------------------------
POLICY NOTICE: OPEN PROBLEM STATEMENT
→ No fixed problem is prescribed. You and your squad choose your problem!

SAMPLE ARCHITECTURAL PATTERN:
» ${pattern.title}

RECOMMENDED TECH / HARDWARE STACK:
→ ${pattern.suggestedStack}

8-HOUR PROTOTYPING GUIDELINE:
→ ${pattern.guideline}

REMINDER:
Bring your own development boards, sensors, and hardware.
High-speed Wi-Fi, electricity plug points, and work tables are provided at the AICTE IDEA Lab.
----------------------------------------
[STATUS: READY FOR THE 11 DECEMBER OFFLINE FINALS AT PESCE, MANDYA]
    `.trim();

    typeWriter(outputEl, formattedLog, 10);
  }

  function initAITerminal() {
    const generateBtn = document.getElementById('ai-generate-btn');
    const trackSelect = document.getElementById('ai-track-select');
    const inputField = document.getElementById('ai-query-input');
    const presetChips = document.querySelectorAll('.preset-chip');

    if (generateBtn && trackSelect) {
      generateBtn.addEventListener('click', () => {
        const track = trackSelect.value || 'sustainability';
        const query = inputField ? inputField.value.trim() : '';
        generateBrainstorm(track, query);
      });
    }

    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-query');
        const track = chip.getAttribute('data-track');
        if (inputField) inputField.value = text;
        if (trackSelect && track) trackSelect.value = track;
        generateBrainstorm(track || 'sustainability', text);
      });
    });
  }

  window.Doomsday.initAITerminal = initAITerminal;
  window.Doomsday.generateBrainstorm = generateBrainstorm;
})();
