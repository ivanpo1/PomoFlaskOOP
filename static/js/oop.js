import { setSelectedProjectId } from "./main.js";
import { StateManager } from "./managers/StateManager.js";

class UIManager {
  static updateButtonStyles(type, button, previousButton) {
    if (previousButton) {
      previousButton.style.backgroundColor = "";
      previousButton.style.borderColor = "";
    }

    if (type === "project") {
      button.style.backgroundColor = "#4b0f72";
      button.style.borderColor = "#FFF8DC";
    }

    if (type === "task") {
      button.style.backgroundColor = "#267eb1";
      button.style.borderColor = "#FFF8DC";
    }
  }

  timeToString(time) {
    let minutes = Math.floor((time / (1000 * 60)) % 60)
      .toString()
      .padStart(2, "0");
    let hours = Math.floor((time / (1000 * 60 * 60)) % 24)
      .toString()
      .padStart(2, "0");
    return `${hours}h ${minutes}m`;
  }

  updateInfoBox = function (type, data) {
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
    document.querySelector(
      elementSelectors.time
    ).innerText = `${this.timeToString()}`;
  };

  updateTaskList(data) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
  
    // Loop to add incomplete tasks
    data.tasks.forEach((task) => {
      if (!task.complete) {
        const taskItem = document.createElement("li");
        // const taskTime = timeToString(task.time);
        taskItem.innerHTML = `
          <div class="task-wrapper">
          <button class="btn btn-tasks" data-task-id="${task.id}" data-project-id="${task.project_id}">
            <img class="play-button" src="static/img/play-button-30.png" alt="Play" onclick="startCountdown()" />
            ${task.name}
            <div class="align-right-checkbox-wrapper">
              <input type="checkbox" data-task-id="${task.id}" data-project-id="${task.project_id}" value="incomplete_checkbox" class="align-right-checkbox check-task" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Mark to complete" />
              
            </div>
          </button>
          <div class="task-time-dinamic">${timeToString(task.time)}</div>
        </div>     
        `;
        taskList.appendChild(taskItem);
      }
    });
  
    // Add "Show completed Tasks" button if there are completed tasks
    if (data.completed_tasks > 0) {
      const showCompletedButton = document.createElement("div");
      showCompletedButton.innerHTML = `<button class="show-tasks">Show completed Tasks</button>`;
      taskList.appendChild(showCompletedButton);
    }
  
    // Create .show-task-div container for completed tasks
    const showTaskDiv = document.createElement("div");
    showTaskDiv.className = "show-task-div";
    if (data.completed_tasks > 0) {
      data.tasks.forEach((task) => {
        if (task.complete) {
          const taskItem = document.createElement("li");
          taskItem.innerHTML = `
            <div class="check-wrapper">
              <button class="btn btn-tasks task-completed" data-task-id="${task.id}" data-project-id="${task.project_id}">
                ${task.name}
                <div class="align-right-checkbox-wrapper">
              
              <input type="checkbox" data-task-id="${task.id}" data-project-id="${task.project_id}" value="complete_checkbox" class="align-right-checkbox uncheck-task" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Unmark to restore"/>
              </button>
              <div class="task-time-dinamic">${this.timeToString(task.time)}</div>
            </div>
          `;
          showTaskDiv.appendChild(taskItem);
        }
      });
    } else {
      const noCompleteMessage = document.createElement("div");
      noCompleteMessage.className = "no-complete";
      noCompleteMessage.innerText = "There's no completed Tasks";
      showTaskDiv.appendChild(noCompleteMessage);
    }
    taskList.appendChild(showTaskDiv);
  
    initializeEventListeners();
  }
}

class ProjectManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  async fetchProjectData(projectId) {
    try {
      const response = await fetch("/api/projects/" + projectId);
      const data = await response.json();

      if (data.error) {
        console.error("Error fetching project:", data.error);
      } else {
        console.log("fetchProjectData, data:", data);
        this.stateManager.setSelectedProjectId(projectId);
        sessionStorage.setItem("projectData", JSON.stringify(data));

        this.updateUIWithProjectData(data);
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
      // Handle the error scenario (e.g., display an error message)
    }
  }

  handleBtnProjectClick(button) {
    const projectId = button.getAttribute("data-project-id");

    UIManager.updateButtonStyles(
      "project",
      button,
      this.stateManager.state.previousClickedButton
    );

    // Update state
    this.stateManager.setSelectedProjectId(projectId);
    this.stateManager.state.previousClickedButton = button;

    this.fetchProjectData(projectId);
  }
}

class TaskManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  fetchTaskData(taskId) {
    fetch("/api/tasks/" + taskId)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching task:", data.error);
        } else {
          // Store the project data in the session storage
          sessionStorage.setItem("taskData", JSON.stringify(data));
          setSelectedTaskId(taskId);

          console.log(`fetchTaskData, data: ${data}`, data);
          document.querySelector(".title-timer").innerText = `${data.name}`;
          document.querySelector(
            ".title-timer"
          ).style.backgroundColor = `#0F4C75`;
          setTimeout(function () {
            updateTasks(data);
          }, 50);
        }
      });
  }

  handleBtnTaskClick(button) {
    // if (stateManager.state.isTimerRunning) {
    //   showWarningModal()}

    const taskId = button.getAttribute("data-task-id");
    const projectId = button.getAttribute("data-project-id");

    UIManager.updateButtonStyles(
      "task",
      button,
      this.stateManager.state.previousClickedButton
    );

    this.stateManager.setSelectedProjectId(projectId);
    this.stateManager.setSelectedTaskId(taskId);
    this.stateManager.state.previousClickedButton = button;

    // console.log(
    //   `Task ID: ${state.selectedTaskId} Project ID: ${state.selectedProjectId}`
    // );
    // toggleSidebar("task");

    this.fetchTaskData(taskId);
  }

  checkTask = function (e) {
    // const { taskId, projectId } = this.dataset;
    e.stopPropagation();
    const taskId = e.target.dataset.taskId;
    const projectId = e.target.dataset.projectId;
    console.log(`Check Task ID: ${taskId} Check Project ID: ${projectId}`);

    this.completeTask(taskId, projectId);
  };

  async completeTask(taskId, projectId) {
    try {
      const response = await fetch(`/complete/task/${taskId}`);
      const data = await response.json();

      if (data.error) {
        console.error(`Error setting task as completed: ${data.error}`);
      } else {
        projectManager.fetchProjectData(projectId);
      }
    } catch (error) {
      console.error(`Error completing task: ${error}`);
    }
  }

  uncheckTask = function (e) {
    e.stopPropagation();
    const taskId = e.target.dataset.taskId;
    const projectId = e.target.dataset.projectId;

    this.uncompleteTask(taskId, projectId);
  };

  async uncompleteTask(taskId, projectId) {
    try {
      const response = await fetch(`/uncomplete/task/${taskId}`);
      const data = await response.json();

      if (data.error) {
        console.error(`Error setting task as incomplete: ${data.error}`);
      } else {
        projectManager.fetchProjectData(projectId);
      }
    } catch (error) {
      console.error(`Error marking Task as incomplete: ${error}`);
    }
  }

  async deleteTask(taskId) {
    try {
      const response = await fetch(`/delete/${taskId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.error) {
        console.error(`Failed to delete item with Task ID: ${taskId}`);
      } else {
        projectManager.fetchProjectData();
      }
    } catch (error) {
      console.error(`Error deleting Task ID: ${taskId}`);
    }
  }
}

const stateManager = new StateManager();
const projectManager = new ProjectManager(stateManager);
const taskManager = new TaskManager(stateManager);
projectManager.print();
