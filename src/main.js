let DURATIONS = {
  work:  (parseInt(localStorage.getItem('duration-work'))  || 25) * 60,
  break: (parseInt(localStorage.getItem('duration-break')) || 5)  * 60,
};

let timeRemaining = DURATIONS.work;
let isRunning = false;
let currentMode = 'work';
let intervalId = null;

const appEl         = document.getElementById('app');
const timeDisplayEl = document.getElementById('time-display');
const modeIndicatorEl = document.getElementById('mode-indicator');
const startPauseBtn = document.getElementById('start-pause-btn');
const resetBtn      = document.getElementById('reset-btn');
const workDurationInput  = document.getElementById('work-duration-input');
const breakDurationInput = document.getElementById('break-duration-input');
const applySettingsBtn   = document.getElementById('apply-settings-btn');

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateDOM() {
  timeDisplayEl.textContent = formatTime(timeRemaining);
  modeIndicatorEl.textContent = currentMode === 'work' ? 'Work' : 'Break';
  appEl.dataset.mode = currentMode;
  startPauseBtn.textContent = isRunning ? 'Pause' : 'Start';
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

function switchMode() {
  playChime();
  currentMode = currentMode === 'work' ? 'break' : 'work';
  timeRemaining = DURATIONS[currentMode];
  document.body.classList.toggle('is-break', currentMode === 'break');
}

function tick() {
  timeRemaining--;
  if (timeRemaining < 0) {
    switchMode();
  }
  updateDOM();
}

function startPause() {
  if (isRunning) {
    clearInterval(intervalId);
    intervalId = null;
  } else {
    intervalId = setInterval(tick, 1000);
  }
  isRunning = !isRunning;
  updateDOM();
}

function reset() {
  clearInterval(intervalId);
  intervalId = null;
  isRunning = false;
  timeRemaining = DURATIONS[currentMode];
  updateDOM();
}

function applySettings() {
  const newWork  = Math.max(1, parseInt(workDurationInput.value));
  const newBreak = Math.max(1, parseInt(breakDurationInput.value));
  DURATIONS.work  = newWork  * 60;
  DURATIONS.break = newBreak * 60;
  localStorage.setItem('duration-work',  newWork);
  localStorage.setItem('duration-break', newBreak);
}

workDurationInput.value  = DURATIONS.work  / 60;
breakDurationInput.value = DURATIONS.break / 60;

startPauseBtn.addEventListener('click', startPause);
resetBtn.addEventListener('click', reset);
applySettingsBtn.addEventListener('click', applySettings);

updateDOM();
