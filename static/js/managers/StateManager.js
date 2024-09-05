export const state = {
  selectedTaskId: sessionStorage.getItem("selectedTaskId") || null,
  selectedProjectId: sessionStorage.getItem("selectedProjectId") || null,
  isTaskDivVisible: sessionStorage.getItem("taskDivDisplay") === "block",
  previousClickedButton: null,
  previousTaskClickedButton: null,
  isTimerRunning: false,
};

export default class StateManager {
  constructor() {
    this.state = {
      selectedTaskId: null,
      selectedProjectId: null,
      isTimerRunning: false,
      previousClickedButton: null,
      previousTaskClickedButton: null,
      isTaskDivVisible: false,
    };
    this.projectData = {};
  }

  getProjectData(projectId) {
    return this.projectData[projectId];
  }

  setProjectData(projectId, data) {
    this.projectData[projectId] = data;
  }

  setSelectedTaskId(taskId) {
    this.state.selectedTaskId = taskId;
    sessionStorage.setItem("selectedTaskId", taskId);
  }

  setSelectedProjectId(projectId) {
    this.state.selectedProjectId = projectId;
    sessionStorage.setItem("selectedProjectId", projectId);
  }

  // Additional methods to manage the state can go here
}

export const updateUI = function (type, data) {
  const elements = {
    project: {
      name: ".project-name",
      id: ".project-id",
      complete: ".project-complete",
      createdAt: ".project-created-at",
      pomodoros: ".project-pomodoros",
      time: ".project-time",
    },
    task: {
      name: ".task-name",
      id: ".task-id",
      complete: ".task-complete",
      createdAt: ".task-created-at",
      pomodoros: ".task-pomodoros",
      time: ".task-time",
    },
  };

  const elementSelectors = elements[type];

  document.querySelector(
    elementSelectors.name
  ).innerText = `Name: ${data.name}`;
  document.querySelector(elementSelectors.id).innerText = `ID: ${data.id}`;
  document.querySelector(
    elementSelectors.complete
  ).innerText = `Completed: ${data.complete}`;
  document.querySelector(
    elementSelectors.createdAt
  ).innerText = `Created at: ${data.created_at}`;
  document.querySelector(
    elementSelectors.pomodoros
  ).innerText = `Pomodoro Quantity: ${data.pomodoros}`;

  let minutes = Math.floor((data.time / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  let hours = Math.floor((data.time / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, "0");
  document.querySelector(
    elementSelectors.time
  ).innerText = `Elapsed time: ${hours}h ${minutes}m`;
};
