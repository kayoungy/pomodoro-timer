const DURATIONS = {
  work:  25 * 60,
  break: 5 * 60,
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

function switchMode() {
  currentMode = currentMode === 'work' ? 'break' : 'work';
  timeRemaining = DURATIONS[currentMode];
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

startPauseBtn.addEventListener('click', startPause);
resetBtn.addEventListener('click', reset);

updateDOM();
