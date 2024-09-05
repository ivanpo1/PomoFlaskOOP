import { state } from "./managers/StateManager.js";

export class Timer {
  constructor(pomoTime, restTime, stateManager) {
    this.stateManager = stateManager;
    this.pomoTime = pomoTime;
    this.restTime = restTime;
    this.currentTime = pomoTime;
    this.remainingTime = 0;
    this.startTime = 0;
    this.elapsedTime = 0;
    // this.isTimerRunning = state.isTimerRunning;
    this.isPaused = false;
    this.countdownInterval = null;
    this.timerElement = document.getElementById("timer");
    this.timerBox = document.getElementById("timer-box");
    this.sliderMinutes = document.getElementById("sliderMinutes");

    this.init();
  }

  init() {
    this.updateCountdown(this.currentTime);

    const startButton = document.querySelector(".btn-success");
    const pauseButton = document.querySelector(".btn-warning");
    const stopButton = document.querySelector(".btn-stop");

    this.sliderMinutes.addEventListener(
      "input",
      this.updateSliderMinutes.bind(this)
    );
    startButton.addEventListener("click", this.startCountdown.bind(this));
    pauseButton.addEventListener("click", this.pauseCountdown.bind(this));
    stopButton.addEventListener("click", this.stopCountdown.bind(this));
  }

  updateSliderMinutes() {
    this.timerBox.style.backgroundColor = "#22272e";
    this.currentTime = Math.round(this.sliderMinutes.value * 60 * 1000);
    this.updateCountdown(this.currentTime);
  }

  startCountdown() {
    if (this.stateManager.state.isTimerRunning) return;

    clearInterval(this.countdownInterval);

    // this.isTimerRunning = true;
    this.stateManager.state.isTimerRunning = true;
    this.sliderMinutes.disable = true;
    this.isPaused = false;
    this.timerBox.style.backgroundColor = "#687644";
    this.startTime = this.currentTime;
    this.taskId = this.stateManager.state.selectedTaskId;
    this.projectId = this.stateManager.state.selectedProjectId;

    this.logCurrentState("Start Button");

    const timeForCountdown =
      this.remainingTime > 0 ? this.remainingTime : this.currentTime;
    this.countdown(timeForCountdown);
  }

  pauseCountdown() {
    if (this.stateManager.state.isTimerRunning) {
      this.timerBox.style.backgroundColor = "#9f7339";
      this.isPaused = true;
      this.isTimerRunning = false;
      this.stateManager.state.isTimerRunning = false;
      this.sliderMinutes.disabled = true;
    }

    this.logCurrentState("Pause Button");
  }

  resetTimer() {
    this.stateManager.state.isTimerRunning = false;
    this.sliderMinutes.disabled = false;
    this.remainingTime = 0;
    clearInterval(this.countdownInterval);
    this.updateCountdown(Math.round(sliderMinutes.value * 60 * 1000));
  }

  stopCountdown() {
    clearInterval(this.countdownInterval);
    this.updateCountdown(Math.round(this.currentTime));

    this.logCurrentState("Stop Button");

    this.stateManager.state.isTimerRunning = false;
    this.elapsedTime = this.startTime - this.remainingTime;
    this.remainingTime = 0;
    this.timerBox.style.backgroundColor = "#531625";
    this.sliderMinutes.disabled = false;
    this.taskId, this.projectId = this.stateManager.state.selectedTaskId;

    this.sendDataFlask(this.elapsedTime);
  }

  countdown(pTime) {
    this.countdownInterval = setInterval(() => {
      if (!this.isPaused) {
        console.log("1");
        pTime -= 1000;
        this.remainingTime = pTime;
        if (pTime <= 0) {
          this.updateCountdown(0);
          clearInterval(this.countdownInterval);
        } else {
          this.updateCountdown(pTime);
        }
      }
    }, 100);
  }

  updateCountdown(pTime) {
    if (pTime <= 0) {
      this.timerElement.innerText = "00:00";
      this.timerBox.style.backgroundColor = "#531625";
      this.sendDataFlask(this.startTime);
      this.sliderMinutes.disabled = false;
      document.querySelector('.title-timer').innerText = 'Rest';
      this.timerBox.style.backgroundColor = "#2b405e";
      this.stateManager.state.isTimerRunning = false;
      this.updateCountdown(this.restTime);
    } else {
      let minutes = Math.floor(pTime / 60 / 1000)
        .toString()
        .padStart(2, "0");
      let seconds = Math.floor((pTime / 1000) % 60)
        .toString()
        .padStart(2, "0");
      this.timerElement.innerText = `${minutes}:${seconds}`;
      this.sliderMinutes.value = minutes;
    }
  }

  logCurrentState(action) {
    console.log(
      `${action}: projectId ${this.projectId} taskId: ${this.taskId} taskName: ${this} currentTime: ${this.currentTime} remainingTime: ${this.remainingTime}`, this
    );
  }

  sendDataFlask(startTime) {
    const timeToSend = startTime || this.elapsedTime;
    const projectSelect = document.getElementById("project-selector");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/save_time", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
      JSON.stringify({
        time: timeToSend,
        date: new Date(),
        project_id: this.projectId,
        task_id: this.taskId,
      })
    );
  }
  
}

