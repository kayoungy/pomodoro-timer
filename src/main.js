const PLAY_ICON = `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`;
const PAUSE_ICON = `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>`;

let DURATIONS = {
  work:  (parseInt(localStorage.getItem('duration-work'))  || 25) * 60,
  break: (parseInt(localStorage.getItem('duration-break')) || 5)  * 60,
};

let targetSessions = parseInt(localStorage.getItem('sessions-target')) || 4;
let completedSessions = parseInt(localStorage.getItem('sessions-completed')) || 0;

let timeRemaining = DURATIONS.work;
let isRunning = false;
let currentMode = 'work';
let intervalId = null;

const appEl              = document.getElementById('app');
const timeDisplayEl      = document.getElementById('time-display');
const modeIndicatorEl    = document.getElementById('mode-indicator');
const sessionCounterEl   = document.getElementById('session-counter');
const playPauseBtn       = document.getElementById('play-pause-btn');
const restartBtn         = document.getElementById('restart-btn');
const resetBtn           = document.getElementById('reset-btn');
const workDurationInput  = document.getElementById('work-duration-input');
const breakDurationInput = document.getElementById('break-duration-input');
const sessionsInput      = document.getElementById('sessions-input');
const applySettingsBtn   = document.getElementById('apply-settings-btn');
const openSettingsBtn    = document.getElementById('open-settings-btn');
const closeSettingsBtn   = document.getElementById('close-settings-btn');
const settingsModal      = document.getElementById('settings-modal');

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateDOM() {
  timeDisplayEl.textContent = formatTime(timeRemaining);
  modeIndicatorEl.textContent = currentMode === 'work' ? 'Work' : 'Break';
  sessionCounterEl.textContent = `${completedSessions} of ${targetSessions} sessions`;
  appEl.dataset.mode = currentMode;
  playPauseBtn.innerHTML = isRunning ? PAUSE_ICON : PLAY_ICON;
  playPauseBtn.setAttribute('aria-label', isRunning ? 'Pause' : 'Start');
}

function playChime() {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 1);
}

function switchMode(playSound = true) {
  if (playSound) playChime();
  currentMode = currentMode === 'work' ? 'break' : 'work';
  timeRemaining = DURATIONS[currentMode];
  document.body.classList.toggle('is-break', currentMode === 'break');
}

function tick() {
  timeRemaining--;
  if (timeRemaining < 0) {
    if (currentMode === 'work') {
      completedSessions++;
      localStorage.setItem('sessions-completed', completedSessions);
    }
    switchMode();
  }
  updateDOM();
}

function pauseTimer() {
  clearInterval(intervalId);
  intervalId = null;
  isRunning = false;
}

function playPause() {
  if (isRunning) {
    pauseTimer();
  } else {
    intervalId = setInterval(tick, 1000);
    isRunning = true;
  }
  updateDOM();
}

function restart() {
  pauseTimer();
  timeRemaining = DURATIONS[currentMode];
  updateDOM();
}

function reset() {
  if (completedSessions > 0 && !confirm('Reset session? Your progress will be cleared.')) {
    return;
  }
  pauseTimer();
  completedSessions = 0;
  localStorage.setItem('sessions-completed', completedSessions);
  currentMode = 'work';
  document.body.classList.remove('is-break');
  timeRemaining = DURATIONS.work;
  updateDOM();
}

function applySettings() {
  const newWork     = Math.max(1, parseInt(workDurationInput.value));
  const newBreak    = Math.max(1, parseInt(breakDurationInput.value));
  const newSessions = Math.max(1, parseInt(sessionsInput.value));
  DURATIONS.work  = newWork  * 60;
  DURATIONS.break = newBreak * 60;
  targetSessions  = newSessions;
  localStorage.setItem('duration-work',   newWork);
  localStorage.setItem('duration-break',  newBreak);
  localStorage.setItem('sessions-target', newSessions);
  if (!isRunning) {
    timeRemaining = DURATIONS[currentMode];
    updateDOM();
  }
}

workDurationInput.value  = DURATIONS.work  / 60;
breakDurationInput.value = DURATIONS.break / 60;
sessionsInput.value      = targetSessions;

playPauseBtn.addEventListener('click', playPause);
restartBtn.addEventListener('click', restart);
resetBtn.addEventListener('click', reset);

openSettingsBtn.addEventListener('click', () => settingsModal.showModal());
closeSettingsBtn.addEventListener('click', () => settingsModal.close());
settingsModal.addEventListener('click', (e) => {
  const rect = settingsModal.getBoundingClientRect();
  const inDialog =
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top && e.clientY <= rect.bottom;
  if (!inDialog) settingsModal.close();
});

applySettingsBtn.addEventListener('click', () => {
  applySettings();
  settingsModal.close();
});

updateDOM();
