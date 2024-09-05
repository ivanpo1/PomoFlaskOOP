"use strict";

window.onload = function() {
  // Access projectId from sessionStorage
  let projectId = sessionStorage.getItem('selectedProjectId');

  // Now you can use projectId in script.js
  if (projectId) {
    // Do something with projectId
  }
};

let pomoTime = 25 * 60 * 1000;
let restTime = 5 * 1000;
let currentTime = pomoTime;
let remainingTime = 0;
let startTime = 0;
let elapsedTime = 0;

const timer = document.getElementById("timer");
const timerBox = document.getElementById("timer-box");
const amountMinutes = document.getElementById("amountMinutes");


let projectId = sessionStorage.getItem('selectedProjectId');
let taskId = sessionStorage.getItem('selectedTaskId');

let isTimerRunning = false;
let isPaused = false;
let countdownInterval;

updateCountdown(currentTime);

const startButton = document.querySelector(".btn-success");
const pauseButton = document.querySelector(".btn-warning");
const stopButton = document.querySelector(".btn-stop");
// const projectSelector = document.getElementById('project-selector');

amountMinutes.addEventListener("input", function () {
  timerBox.style.backgroundColor = "#22272e";
  currentTime = amountMinutes.value * 60 * 1000;
  updateCountdown(currentTime);
});


// START countdown
function startCountdown() {
  if (isTimerRunning) return;

  clearInterval(countdownInterval);
  isTimerRunning = true;
  amountMinutes.disabled = true;
  isPaused = false;
  timerBox.style.backgroundColor = "#687644";
  startTime = currentTime;
  projectId = projectId;
  taskId = taskId;
  console.log(`Start button: projectId ${projectId} taskId: ${taskId}`)

  // let currentProject = projectSelector.value;

  if (remainingTime > 0) {
    countdown(remainingTime);
    console.log("Remaining time triggered");
  } else {
    console.log("else triggered");
    updateCountdown(currentTime);
    countdown(currentTime);
  }
};

startButton.addEventListener("click", startCountdown);

function pauseCountdown(){
  if (isTimerRunning) {
    // Only pause if running
    //    remainingTime = currentTime; // Save remaining time
    timerBox.style.backgroundColor = "#9f7339";
    isPaused = true; // Toggle pause flag
    isTimerRunning = false;
    amountMinutes.disabled = true;
  }
};
// PAUSE countdown
pauseButton.addEventListener("click", pauseCountdown);

// STOP countdown
stopButton.addEventListener("click", function () {
  isTimerRunning = false;
  clearInterval(countdownInterval);
  elapsedTime = startTime - remainingTime;
  remainingTime = 0;
  timerBox.style.backgroundColor = "#531625";
  updateCountdown(amountMinutes.value * 60 * 1000); // Update display after stopping
  amountMinutes.disabled = false;
  console.log(elapsedTime);
  projectId = projectId;
  taskId = taskId;
  console.log(`Stop button: projectId ${projectId} taskId: ${taskId}`)
  sendDataFlask();
});

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
  } else {
    let minutes = Math.floor(pTime / 60 / 1000)
      .toString()
      .padStart(2, "0");
    let seconds = Math.floor((pTime / 1000) % 60)
      .toString()
      .padStart(2, "0");
    timer.innerText = `${minutes}:${seconds}`;
    amountMinutes.value = minutes;
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
      project_id: projectId, // Name of the project
      task_id: taskId,
    })
  );
}
