import initializeEventListeners from "./EventListenerManager.js";

export default class UIManager {
  constructor(stateManager) {
    this.isEventListenersInitialized = false; // Flag to track initialization
    this.stateManager = stateManager;
    this.taskDiv = document.querySelector(".show-task-div");
    this.showTaskDiv = document.querySelector(".show-tasks");
    this.spinnerTimeouts = {};
  }

  updateButtonStyles(type, button, previousButton) {
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

  updateTitleTimer(title, backgroundColor) {
    document.querySelector(".title-timer").innerText = `${title}`;
    document.querySelector(
      ".title-timer"
    ).style.backgroundColor = `${backgroundColor}`;
  }

  async updateProjectInfoBox(projectData) {
    try {
      document.querySelector(".completed-tasks").innerText =
        projectData.completed_tasks;
      document.querySelector(".incomplete-tasks").innerText =
        projectData.incomplete_tasks;
      document.querySelector(".elapsed-time").innerText = `${this.timeToString(
        projectData.time
      )}`;
    } catch (error) {
      console.error("Failed to update ProjectInfoBox ", error);
    }
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

  // updateTaskList(data) {
  //   const taskList = document.getElementById("task-list");
  //   taskList.innerHTML = "";

  //   // Loop to add incomplete tasks
  //   data.tasks.forEach((task) => {
  //     if (!task.complete) {
  //       const taskItem = document.createElement("li");
  //       // const taskTime = timeToString(task.time);
  //       taskItem.innerHTML = `
  //         <div class="task-wrapper">
  //         <button class="btn btn-tasks" data-task-id="${task.id}" data-project-id="${task.project_id}">
  //           <img class="play-button" src="static/img/play-button-30.png" alt="Play" onclick="startCountdown()" />
  //           ${task.name}
  //           <div class="align-right-checkbox-wrapper">
  //             <input type="checkbox" data-task-id="${task.id}" data-project-id="${task.project_id}" value="incomplete_checkbox" class="align-right-checkbox check-task" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Mark to complete" />

  //           </div>
  //         </button>
  //         <div class="task-time-dinamic">${this.timeToString(task.time)}</div>
  //       </div>
  //       `;
  //       taskList.appendChild(taskItem);
  //     }
  //   });

  //   // Add "Show completed Tasks" button if there are completed tasks
  //   if (data.completed_tasks > 0) {
  //     const showCompletedButton = document.createElement("div");
  //     showCompletedButton.innerHTML = `<button class="show-tasks">Show completed Tasks</button>`;
  //     taskList.appendChild(showCompletedButton);
  //   }

  //   // Create .show-task-div container for completed tasks
  //   const showTaskDiv = document.createElement("div");
  //   showTaskDiv.className = "show-task-div";
  //   if (data.completed_tasks > 0) {
  //     data.tasks.forEach((task) => {
  //       if (task.complete) {
  //         const taskItem = document.createElement("li");
  //         taskItem.innerHTML = `
  //           <div class="check-wrapper">
  //             <button class="btn btn-tasks task-completed" data-task-id="${task.id}" data-project-id="${task.project_id}">
  //               ${task.name}
  //               <div class="align-right-checkbox-wrapper">

  //             <input type="checkbox" data-task-id="${task.id}" data-project-id="${task.project_id}" value="complete_checkbox" class="align-right-checkbox uncheck-task" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Unmark to restore"/>
  //             </button>
  //             <div class="task-time-dinamic">${this.timeToString(task.time)}</div>
  //           </div>
  //         `;
  //         showTaskDiv.appendChild(taskItem);
  //       }
  //     });

  //   } else {
  //     const noCompleteMessage = document.createElement("div");
  //     noCompleteMessage.className = "no-complete";
  //     noCompleteMessage.innerText = "There's no completed Tasks";
  //     showTaskDiv.appendChild(noCompleteMessage);
  //   }
  //   taskList.appendChild(showTaskDiv);

  //   this.taskDiv = showTaskDiv;
  //   this.showTasks = document.querySelector(".show-tasks");

  // if (!this.isEventListenersInitialized) {
  //   initializeEventListeners();
  //   this.isEventListenersInitialized = true;
  // }
  // }

  updateTaskList(projectData) {
    this.clearTaskList();
    this.updateIncompleteTasks(projectData.tasks, projectData.completed_tasks);
    this.updateCompletedTasks(projectData.tasks, projectData.completed_tasks);

    // if (!this.isEventListenersInitialized) {
    //   initializeEventListeners();
    //   this.isEventListenersInitialized = true;
    // }
  }

  clearTaskList() {
    const incompleteTaskList = document.querySelector(
      ".ul-task-list-incomplete"
    );
    const completeTaskList = document.querySelector(".ul-task-list-complete");
    incompleteTaskList.innerHTML = "";
    completeTaskList.innerHTML = "";
  }

  updateIncompleteTasks(tasks) {
    const incompleteTaskList = document.querySelector(
      ".ul-task-list-incomplete"
    );
    // console.log(completeTaskList)
    tasks.forEach((task) => {
      if (!task.complete) {
        const taskItem = this.createTaskItem(task);
        incompleteTaskList.appendChild(taskItem);
      }
    });

    if (tasks.completed_tasks > 0) {
      this.showCompletedButton(tasks.completed_tasks);
    }
  }

  updateCompletedTasks(tasks, completedTaskCount) {
    const taskList = document.querySelector(".ul-task-list-complete");

    if (completedTaskCount > 0) {
      //   const showCompletedButton = this.createShowCompletedButton();
      //   taskList.appendChild(showCompletedButton);

      // const showTaskDiv = document.createElement("div");
      // showTaskDiv.className = "show-task-div";

      tasks.forEach((task) => {
        if (task.complete) {
          const taskItem = this.createTaskItem(task, true);
          taskList.appendChild(taskItem);
        }
      });

      // taskList.appendChild(showTaskDiv);
    } else {
      const noCompleteMessage = this.createNoCompleteMessage();
      taskList.appendChild(noCompleteMessage);
    }
  }

  createTaskItem(task, isCompleted = false) {
    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
          <div class="task-wrapper">
              <button class="btn btn-tasks${
                isCompleted ? " task-completed" : ""
              }" data-task-id="${task.id}" data-project-id="${task.project_id}">
                  ${task.name}
                  <div class="spinner-border spinner-border-sm" id="loading-spinner-${task.id}" style="display:none;" role="status">
                    <span class="visually-hidden"></span>
                  </div>
                  <div class="align-right-checkbox-wrapper">
                      <input type="checkbox" data-task-id="${
                        task.id
                      }" data-project-id="${task.project_id}" value="${
      isCompleted ? "complete_checkbox" : "incomplete_checkbox"
    }" class="align-right-checkbox form-check-input ${
      isCompleted ? "uncheck-task" : "check-task"
    }" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="${
      isCompleted ? "Unmark to restore" : "Mark to complete"
    }" ${isCompleted ? "checked" : ""}/>
                  </div>
              </button>
              <div class="task-time-dinamic">${this.timeToString(
                task.time
              )}</div>
              <button class="btn-delete-task" data-task-id="${task.id}" data-project-id="${task.project_id}"> X </button>
          </div>
      `;
    return taskItem;
  }

  createShowCompletedButton() {
    const showCompletedButton = document.createElement("div");
    showCompletedButton.className = "show-hide-task";
    showCompletedButton.innerHTML = `<button class="btn show-tasks">Show completed Tasks</button>`;
    showCompletedButton.style.display = "none";
    return showCompletedButton;
  }

  createNoCompleteMessage() {
    const noCompleteMessage = document.createElement("div");
    noCompleteMessage.className = "no-complete";
    noCompleteMessage.innerText = "There's no completed Tasks";
    return noCompleteMessage;
  }

  showCompletedButton(completedTaskCount) {
    if (completedTaskCount > 0) {
      const showCompletedButton = this.createShowCompletedButton();
      taskList.appendChild(showCompletedButton);
    }
  }

  handleShowCompletedTask(isVisible) {
    console.log("setTaskDivDisplay");
    const ShowCompletedTask = document.querySelector(".complete-task-div");
    const showTask = document.querySelector(".show-tasks");
    ShowCompletedTask.style.display = isVisible ? "block" : "none";
    showTask.innerText = isVisible
      ? "Hide completed Tasks"
      : "Show completed Tasks";
    this.stateManager.state.isCompletedTaskVisible ? "block" : "none";
    this.stateManager.state.isCompletedTaskVisible
      ? "Hide completed Tasks"
      : "Show completed Tasks";
  }

  showCompletedTask() {
    console.log("showCompletedTask pressed");
    this.stateManager.state.isCompletedTaskVisible =
      !this.stateManager.state.isCompletedTaskVisible;
    this.handleShowCompletedTask(
      this.stateManager.state.isCompletedTaskVisible
    );
  }
  

  toggleSpinner(taskId, show) {
    if (show) {
      // Set a timeout to show the spinner after 1 second
      this.spinnerTimeouts[taskId] = setTimeout(() => {
        const spinner = document.getElementById(`loading-spinner-${taskId}`);
        if (spinner) {
          spinner.style.display = 'block';
        }

        const btnTask = spinner.closest('.btn-tasks');
        if (btnTask) {
          btnTask.style.transitionDuration = '2s'
          btnTask.style.backgroundColor = '#0baf60'; // Example color
        }
      }, 400);
    } else {
      // Clear the timeout if it exists
      if (this.spinnerTimeouts[taskId]) {
        clearTimeout(this.spinnerTimeouts[taskId]);
        delete this.spinnerTimeouts[taskId];
      }

      const spinner = document.getElementById(`loading-spinner-${taskId}`);
      if (spinner) {
        spinner.style.display = 'none';
      }

      const btnTask = spinner.closest('.btn-tasks');
      if (btnTask) {
        btnTask.style.transitionDuration = '';
        btnTask.style.backgroundColor = ''; // Reset color
      }
    }
  }
}
