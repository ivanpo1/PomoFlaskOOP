import { state } from './main.js';

"use strict";
let projectId;
let taskId;
// selectedTaskId;
// selectedProjectId = state.selectedProjectId

let pomoTime = 25 * 60 * 1000;
let restTime = 5 * 60 * 1000;
let currentTime = pomoTime;
let remainingTime = 0;
let startTime = 0;
let elapsedTime = 0;

const timer = document.getElementById("timer");
const timerBox = document.getElementById("timer-box");
const sliderMinutes = document.getElementById("sliderMinutes");

// let projectId = sessionStorage.getItem("selectedProjectId");
// let taskId = sessionStorage.getItem("selectedTaskId");

let isTimerRunning = false;
let isPaused = false;
let countdownInterval;

updateCountdown(currentTime);

const startButton = document.querySelector(".btn-success");
const pauseButton = document.querySelector(".btn-warning");
const stopButton = document.querySelector(".btn-stop");
// const projectSelector = document.getElementById('project-selector');

sliderMinutes.addEventListener("input", function () {
  timerBox.style.backgroundColor = "#22272e";
  currentTime = sliderMinutes.value * 60 * 1000;
  updateCountdown(currentTime);
});

// START countdown
function startCountdown() {
  if (isTimerRunning) return;

  clearInterval(countdownInterval);
  isTimerRunning = true;
  sliderMinutes.disabled = true;
  isPaused = false;
  timerBox.style.backgroundColor = "#687644";
  startTime = currentTime;
  taskId = state.selectedTaskId;
  projectId = state.selectedProjectId;
  console.log(`Start button: projectId ${projectId} taskId: ${taskId}`);

  // let currentProject = projectSelector.value;

  if (remainingTime > 0) {
    countdown(remainingTime);
    console.log("Remaining time triggered");
  } else {
    console.log("else triggered");
    updateCountdown(currentTime);
    countdown(currentTime);
  }
}
startButton.addEventListener("click", startCountdown);

// PAUSE countdown

function pauseCountdown() {
  if (isTimerRunning) {
    // Only pause if running
    //    remainingTime = currentTime; // Save remaining time
    timerBox.style.backgroundColor = "#9f7339";
    isPaused = true; // Toggle pause flag
    isTimerRunning = false;
    sliderMinutes.disabled = true;
  }
}
pauseButton.addEventListener("click", pauseCountdown);

// STOP countdown

function stopCountdown() {
  isTimerRunning = false;
  clearInterval(countdownInterval);
  elapsedTime = startTime - remainingTime;
  remainingTime = 0;
  timerBox.style.backgroundColor = "#531625";
  updateCountdown(sliderMinutes.value * 60 * 1000); // Update display after stopping
  sliderMinutes.disabled = false;
  console.log(elapsedTime);
  taskId = state.selectedTaskId;
  projectId = state.selectedProjectId;
  console.log(`Stop button: projectId ${projectId} taskId: ${taskId}`);
  sendDataFlask();
}
stopButton.addEventListener("click", stopCountdown);

function countdown(pTime) {
  countdownInterval = setInterval(() => {
    if (!isPaused) {
      console.log("1");
      pTime -= 1000;
      remainingTime = pTime;
      if (pTime <= 0) {
        updateCountdown(0);
        clearInterval(countdownInterval);
      } else {
        updateCountdown(pTime);
      }
    }
  }, 10);
}

function updateCountdown(pTime) {
  if (pTime <= 0) {
    // change display
    timer.innerText = "00:00";
    timerBox.style.backgroundColor = "#531625";
    sendDataFlask(startTime);
    sliderMinutes.disabled = false;
    document.querySelector('.title-timer').innerText = 'Rest';
    timerBox.style.backgroundColor = "#2b405e";
    isTimerRunning = false;
    updateCountdown(restTime);

  } else {
    let minutes = Math.floor(pTime / 60 / 1000)
      .toString()
      .padStart(2, "0");
    let seconds = Math.floor((pTime / 1000) % 60)
      .toString()
      .padStart(2, "0");
    timer.innerText = `${minutes}:${seconds}`;
    sliderMinutes.value = minutes;
  }
}

//  Send data to Flask
function sendDataFlask(startTime) {
  const timeToSend = startTime || elapsedTime; // Use startTime if provided, otherwise use elapsedTime
  const projectSelect = document.getElementById("project-selector"); // Select the select element
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/save_time", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      time: timeToSend, // Amount of milliseconds
      date: new Date(), // Current date and time
      project_id: projectId,
      task_id: taskId,
    })
  );
}
