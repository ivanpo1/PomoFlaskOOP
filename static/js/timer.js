export class Timer {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.timeMultiplier = 10; // Testing

    this.timerSettings = {
      pomodoro: 25, 
      shortRest: 5,
      longRest: 30,
      untilLongRest: 4, 
    };

    this.sessionCount = 0; 
    this.mode = "pomodoro";
    this.currentTime = this.timerSettings[this.mode] * 60 * 1000; 
    this.isPaused = false;
    this.countdownInterval = null;

    this.init();
  }

  init() {
    this.updateCountdown(this.currentTime);


    document.querySelector(".btn-success").addEventListener("click", this.startCountdown.bind(this));
    document.querySelector(".btn-warning").addEventListener("click", this.pauseCountdown.bind(this));
    document.querySelector(".btn-stop").addEventListener("click", this.stopCountdown.bind(this));
  }


  switchMode() {
    clearInterval(this.countdownInterval);

    if (this.mode === "pomodoro") {
      this.sessionCount++;
    }


    if (this.sessionCount >= this.timerSettings.untilLongRest) {
      this.mode = "longRest";
      this.sessionCount = 0; 
    } else if (this.mode === "pomodoro") {
      this.mode = "shortRest"; 
    } else {
      this.mode = "pomodoro";
    }


    this.currentTime = this.timerSettings[this.mode] * 60 * 1000;


    document.querySelector(".title-timer").innerText = this.mode === "pomodoro" ? "Pomodoro" : this.mode === "shortRest" ? "Short Break" : "Long Break";
    console.log(`Switched to ${this.mode} - Session: ${this.sessionCount}`);


    this.stateManager.state.isTimerRunning = false;
    this.startCountdown(); 
  }

  startCountdown() {

    if (this.stateManager.state.isTimerRunning) return;

    this.stateManager.state.isTimerRunning = true;
    this.isPaused = false;
    
    this.countdown(this.currentTime);
  }

  countdown(pTime) {
    const endTime = Date.now() + pTime / this.timeMultiplier;

    this.countdownInterval = setInterval(() => {
      if (!this.isPaused) {
        const currentTime = Date.now();
        const remainingTime = endTime - currentTime;
        

        if (remainingTime <= 0) {
          this.updateCountdown(0);
          this.switchMode(); 
        } else {
          this.updateCountdown(remainingTime * this.timeMultiplier); 
        }
      }
    }, 1000);
  }

  updateCountdown(pTime) {
    const minutes = Math.floor(pTime / 60 / 1000).toString().padStart(2, "0");
    const seconds = Math.floor((pTime / 1000) % 60).toString().padStart(2, "0");
    document.getElementById("timer").innerText = `${minutes}:${seconds}`;
  }

  pauseCountdown() {
    this.isPaused = true;
    this.stateManager.state.isTimerRunning = false;
  }

  stopCountdown() {
    clearInterval(this.countdownInterval);
    this.isPaused = false;
    this.stateManager.state.isTimerRunning = false;
  }

  setTimerMode(mode, value) {
    if (this.timerSettings.hasOwnProperty(mode)) {
      this.timerSettings[mode] = parseInt(value);
  
      
      if (this.mode === mode) {
        this.currentTime = parseInt(value) * 60 * 1000;
        this.updateCountdown(this.currentTime); 
      }
    } else {
      console.error(`${mode} is not a valid timer mode`);
    }
  }
}

