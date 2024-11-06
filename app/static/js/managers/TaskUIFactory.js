class TaskUIFactory {
  static createTaskElement(task) {
    return new TaskElementBuilder(task)
      .createContainer()
      .addMainContent()
      .addHoverOptions()
      .addTimeDisplay()
      .build();
  }
}

class TaskElementBuilder {
  constructor(task) {
    this.task = task;
    this.element = null;
    this.mainContent = null;
    this.optionsContainer = null;
  }

  createContainer() {
    this.element = document.createElement("div");
    this.element.className = "task-item";
    this.element.dataset.taskId = this.task.id;
    this.element.dataset.projectId = this.task.projectId;
    return this;
  }

  addMainContent() {
    this.mainContent = document.createElement("div");
    this.mainContent.className = "task-main-content d-flex align-items-center";

    // Checkbox
    // const checkbox = document.createElement("input");
    // checkbox.type = "checkbox";
    // checkbox.className = "task-checkbox me-2";
    // checkbox.checked = this.task.complete;

    // Task name
    const taskName = document.createElement("span");
    taskName.className = "task-text flex-grow-1";
    taskName.contentEditable = "true";
    taskName.textContent = this.task.name;

    // this.mainContent.appendChild(checkbox);
    this.mainContent.appendChild(taskName);
    this.element.appendChild(this.mainContent);

    return this;
  }

  addHoverOptions() {
    this.optionsContainer = document.createElement("div");
    this.optionsContainer.className = "task-options";

    const buttons = [
      { class: "btn-timer", text: "", icon: "⏱️" },
      { class: "btn-settings", text: "", icon: "⚙️" },
      { class: "btn-complete", text: "", icon: "✓" },
    ];

    buttons.forEach((btn) => {
      const button = document.createElement("button");
      button.className = `btn ${btn.class}`;
      button.innerHTML = `${btn.icon} ${btn.text}`;
      this.optionsContainer.appendChild(button);
    });

    this.element.appendChild(this.optionsContainer);
    return this;
  }

  addTimeDisplay() {
    const timeDisplay = document.createElement("div");
    timeDisplay.className = "task-time-display";
    timeDisplay.textContent = this.formatTime(this.task.time);
    this.mainContent.appendChild(timeDisplay);
    return this;
  }

  formatTime(time) {
    // Implement your time formatting logic here
    return time || "0:00";
  }

  build() {
    return new TaskElementController(this.element, this.task);
  }
}

class TaskElementController {
  constructor(element, task) {
    this.element = element;
    this.task = task;
    this.setupEventListeners();
    this.setupHoverBehavior();
  }

  setupEventListeners() {
    // Checkbox handler
    const checkbox = this.element.querySelector(".task-checkbox");
    checkbox?.addEventListener("change", (e) => {
      this.handleTaskComplete(e.target.checked);
    });

    // Timer button handler
    const timerBtn = this.element.querySelector(".btn-timer");
    timerBtn?.addEventListener("click", () => {
      this.handleTimerStart();
    });

    // Settings button handler
    const settingsBtn = this.element.querySelector(".btn-settings");
    settingsBtn?.addEventListener("click", () => {
      this.handleSettings();
    });

    // Task name edit handler
    const taskText = this.element.querySelector(".task-text");
    taskText?.addEventListener("blur", (e) => {
      this.handleTaskNameUpdate(e.target.textContent);
    });
  }

  setupHoverBehavior() {
    const options = this.element.querySelector(".task-options");
    const timeDisplay = this.element.querySelector(".task-time-display");

    this.element.addEventListener("mouseenter", () => {
      options.style.display = "flex";
      timeDisplay.style.display = "none";
    });

    this.element.addEventListener("mouseleave", () => {
      options.style.display = "none";
      timeDisplay.style.display = "block";
    });
  }

  handleTaskComplete(isComplete) {
    this.task.complete = isComplete;
    // Implement your completion logic here
  }

  handleTimerStart() {
    // Implement your timer logic here
  }

  handleSettings() {
    // Implement your settings logic here
  }

  handleTaskNameUpdate(newName) {
    this.task.name = newName;
    // Implement your update logic here
  }
}

export default TaskUIFactory;