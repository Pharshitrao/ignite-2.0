/**
 * DOOMSDAY HACKATHON - COUNTDOWN TIMER
 * Tracks remaining time until hackathon kickoff on 11 December
 */

(function() {
  window.Doomsday = window.Doomsday || {};

  function initCountdown(month = 11, day = 11, hour = 10, minute = 0) {
    const currentYear = new Date().getFullYear();
    // Month is 0-indexed in JS Date (11 = December)
    let target = new Date(currentYear, month, day, hour, minute, 0);

    // If already passed for this year, target next year
    if (target < new Date()) {
      target.setFullYear(target.getFullYear() + 1);
    }

    function pad(n) {
      return String(n).padStart(2, '0');
    }

    const elements = {
      d: document.getElementById('d'),
      h: document.getElementById('h'),
      m: document.getElementById('m'),
      s: document.getElementById('s')
    };

    const labels = {
      d: 'days',
      h: 'hours',
      m: 'minutes',
      s: 'seconds'
    };

    function tick() {
      const now = new Date();
      const diffSeconds = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));

      const breakdown = {
        d: Math.floor(diffSeconds / 86400),
        h: Math.floor((diffSeconds % 86400) / 3600),
        m: Math.floor((diffSeconds % 3600) / 60),
        s: diffSeconds % 60
      };

      for (const key in elements) {
        if (elements[key]) {
          elements[key].innerHTML = `${pad(breakdown[key])}<small>${labels[key]}</small>`;
        }
      }
    }

    tick();
    return setInterval(tick, 1000);
  }

  window.Doomsday.initCountdown = initCountdown;
})();
