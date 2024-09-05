import { state } from "./managers/StateManager.js";
import { Timer } from "./timer.js"


export const setSelectedTaskId = (taskId) => {
  state.selectedTaskId = taskId;
  sessionStorage.setItem("selectedTaskId", taskId);
};

export const setSelectedProjectId = (projectId) => {
  state.selectedProjectId = projectId;
  sessionStorage.setItem("selectedProjectId", projectId);
};

const timer = new Timer(1500000, 60000)

const showWarningModal = function (callback) {
  const modal = document.getElementById("warningModal");
  const closeModal = () => {
  modal.style.display = "none";
  };

  const proceedBtn = document.getElementById("proceedBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  proceedBtn.onclick = () => {
    closeModal();
    timer.resetTimer(); // Reset the timer
    callback(); // Call the function to change task/project
  };

  cancelBtn.onclick = closeModal;

  modal.style.display = "block";
};

const handleTimeIsRunning = function (buttonType, element) {
  if (state.isTimerRunning) {
    showWarningModal(() => {
      changeButtonAction(buttonType, element);
    });
  } else {
    changeButtonAction(buttonType, element);
  }
};

const changeButtonAction = (buttonType, element) => {
  if (buttonType === 'project') {
    handleBtnProjectClick(element);
  } else if (buttonType === 'task') {
    handleBtnTaskClick(element);
  }
};

// window.onload = function () {
//   // Get the stored project data
//   const projectData = JSON.parse(sessionStorage.getItem("projectData"));
//   const taskData = JSON.parse(sessionStorage.getItem("taskData"));

//   if (sessionStorage.getItem("toggleSidebarAfterReload") === "true") {
//     // Toggle the sidebar
//     if (state.selectedProjectId) {
//       toggleSidebar("project");
//     } else if (state.selectedTaskId) {
//       toggleSidebar("task");
//     }
//     // Remove the flag from session storage
//     sessionStorage.removeItem("toggleSidebarAfterReload");
//   }

//   if (projectData) {
//     // Update the sidebar with the stored project data
//     setSelectedProjectId(projectData.id);
//     document.querySelector(".title-timer").innerText = projectData.name;
//     document.querySelector(".title-tasks").innerText = projectData.name;
    // document.querySelector(".completed-tasks").innerText =
    //   projectData.completed_tasks;
    // document.querySelector(".incomplete-tasks").innerText =
    //   projectData.incomplete_tasks;
    // let minutes = Math.floor((projectData.time / (1000 * 60)) % 60)
    //   .toString()
    //   .padStart(2, "0");
    // let hours = Math.floor((projectData.time / (1000 * 60 * 60)) % 24)
    //   .toString()
    //   .padStart(2, "0");
    // document.querySelector(".elapsed-time").innerText = `${hours}h ${minutes}m`;
    // updateSidebar(projectData);
//   }

//   if (taskData) {
//     // Update the sidebar with the stored task data
//     document.querySelector(".title-timer").innerText = taskData.name;
//     setSelectedTaskId(taskData.id);
//     setSelectedProjectId(taskData.project_id);
//     setTimeout(function () {
//       updateTasks(taskData);
//     }, 50);
//   }
// };

function fetchProjectData(projectId) {
  fetch("/api/projects/" + projectId)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Error fetching project:", data.error);
        console.log("something happend here");
        // Handle error scenario (e.g., display an error message)
      } else {
        // Store the project data in the session storage
        console.log(`fetchProjectData, data:`, data);
        sessionStorage.setItem("selectedProjectId", projectId);
        sessionStorage.setItem("projectData", JSON.stringify(data));

        updateUIWithProjectData(data);
      }
    });
}

const handleBtnProjectClick = function (button) {
  const projectId = button.getAttribute("data-project-id");

  if (state.previousClickedButton) {
    state.previousClickedButton.style.backgroundColor = ''; // Set to original color
    state.previousClickedButton.style.borderColor = '';
  }

  button.style.backgroundColor = '#4b0f72'
  button.style.borderColor = '#FFF8DC';
  state.previousClickedButton = button;
  setSelectedProjectId(projectId);
  console.log(`/set_current_project/ + ${projectId}`);
  fetch("/api/projects/" + projectId)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Error fetching project:", data.error);
        console.log("something happend here");
        // Handle error scenario (e.g., display an error message)
      } else {
        // Store the project data in the session storage
        sessionStorage.setItem("projectData", JSON.stringify(data));
        // Update the sidebar or tasks with the retrieved project data
        // updateSidebar(data);
        fetchProjectData(state.selectedProjectId);
        //   updateTasks(data);
      }
    });
};

function fetchTaskData(taskId) {
  fetch("/api/tasks/" + taskId)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Error fetching task:", data.error);
        // Handle error scenario (e.g., display an error message)
      } else {
        // Store the project data in the session storage
        sessionStorage.setItem("taskData", JSON.stringify(data));
        setSelectedTaskId(taskId);
        // Update the sidebar or tasks with the retrieved project data
        // updateSidebar(data);
        console.log(`fetchTaskData, data: ${data}`, data);
        document.querySelector(".title-timer").innerText = `${data.name}`;
        document.querySelector(".title-timer").style.backgroundColor = `#0F4C75`
        setTimeout(function () {
          updateTasks(data);
        }, 50);
        // updateTasks(data);
      }
    });
}

function deleteTask(task_id) {
  fetch("/delete/" + task_id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Failed to delete item with task.id: ", task_id);
        // window.location.href = "/timer";
        // projectSelect = projectSelect;
      } else {
        window.location.href = "/timer";
        console.log(data.message);
      }
    })
    .catch((error) => {
      console.error("Error during fetching: ", error);
    });
}

function updateSidebar(projectData) {
  // Use project data to update the sidebar elements (e.g., name, description)
  document.querySelector(
    ".project-name"
  ).innerText = `Project Name: ${projectData.name}`;
  document.querySelector(".project-id").innerText = `ID: ${projectData.id}`;
  document.querySelector(
    ".project-complete"
  ).innerText = `Completed: ${projectData.complete}`;
  document.querySelector(
    ".project-created-at"
  ).innerText = `Created at: ${projectData.created_at}`;
  document.querySelector(
    ".project-pomodoros"
  ).innerText = `Pomodoro Quantity: ${projectData.pomodoros}`;

  let minutes = Math.floor((projectData.time / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  let hours = Math.floor((projectData.time / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, "0");
  document.querySelector(
    ".project-time"
  ).innerText = `Elapsed time: ${hours}h ${minutes}m`;
}

function updateTasks(taskData) {
  // Use project data to update tasks associated with the project (if applicable)
  document.querySelector(
    ".task-name"
  ).innerText = `Task Name: ${taskData.name}`;
  document.querySelector(".task-id").innerText = `ID: ${taskData.id}`;
  document.querySelector(
    ".task-complete"
  ).innerText = `Completed: ${taskData.complete}`;
  document.querySelector(
    ".task-created-at"
  ).innerText = `Created at: ${taskData.created_at}`;

  document.querySelector(
    ".task-pomodoros"
  ).innerText = `Pomodoro Quantity: ${taskData.pomodoros}`;

  let minutes = Math.floor((taskData.time / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  let hours = Math.floor((taskData.time / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, "0");
  document.querySelector(
    ".task-time"
  ).innerText = `Elapsed time: ${hours}h ${minutes}m`;

  const sidebar = document.getElementById("task-sidebar");
  let deleteButton = sidebar.querySelector(".btn-delete");
  if (deleteButton) {
    deleteButton.remove();
  }

  createDeleteButton(taskData.id);
}

function createDeleteButton(taskId) {
  let buttonId = "delete-button-" + taskId;
  let existingButton = document.getElementById(buttonId);

  if (existingButton) {
    existingButton.remove();
  }

  let deleteButton = document.createElement("button");
  deleteButton.id = buttonId;

  deleteButton.className = "btn btn-delete";
  deleteButton.setAttribute("onclick", `deleteTask(${taskId})`);
  deleteButton.innerText = "Delete";
  document.getElementById("task-sidebar").appendChild(deleteButton);
}

const handleBtnTaskClick = function (button) {
  console.log(button)
  if (state.isTimerRunning) {
    showWarningModal()}
  const taskId = button.getAttribute("data-task-id"); // Use getAttribute
  const projectId = button.getAttribute("data-project-id");

  if (state.previousTaskClickedButton) {
    state.previousTaskClickedButton.style.backgroundColor = ''; // Set to original color
    state.previousTaskClickedButton.style.borderColor = '';
  }

  button.style.backgroundColor = '#267eb1'
  button.style.borderColor = '#FFF8DC';
  state.previousTaskClickedButton = button;
  setSelectedTaskId(taskId);
  setSelectedProjectId(projectId);
  console.log(
    `Task ID: ${state.selectedTaskId} Project ID: ${state.selectedProjectId}`
  );
  toggleSidebar("task");
  fetchTaskData(state.selectedTaskId);
};

const checkTask = function (e) {
  // const { taskId, projectId } = this.dataset;
  e.stopPropagation();
  const taskId = e.target.dataset.taskId;
  const projectId = e.target.dataset.projectId;
  console.log(`Check Task ID: ${taskId} Check Project ID: ${projectId}`);

  fetch(`/complete/task/` + taskId)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Error setting task as completed:", data.error);
      } else {
        fetchProjectData(projectId);
      }
    });
};

const uncheckTask = function (e) {
  // const { taskId, projectId } = this.dataset;
  e.stopPropagation();
  const taskId = e.target.dataset.taskId;
  const projectId = e.target.dataset.projectId;
  console.log(taskId, projectId)
  fetch("/uncomplete/task/" + taskId)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Error setting task as incomplete:", data.error);
      } else {
        fetchProjectData(projectId);
      }
    });
};

// function toggleSidebar() {
//   let sidebar = document.getElementById('sidebar');
//   sidebar.classList.toggle('active');
// }

function toggleSidebar(sidebarType) {
  let sidebarId;

  // Determine the correct sidebar ID based on the input parameter
  if (sidebarType === "project") {
    sidebarId = "project-sidebar";
  } else if (sidebarType === "task") {
    sidebarId = "task-sidebar";
  } else {
    console.error("Invalid sidebar type");
    return;
  }

  let sidebar = document.getElementById(sidebarId);

  if (!sidebar) {
    console.error("Sidebar element not found");
    return;
  }

  // Check if the sidebar is currently active (open)
  if (
    sidebar.classList.contains("active") ||
    document.getElementById("project-sidebar").classList.contains("active")
  ) {
    // If it is open, first close it by removing the 'active' class
    sidebar.classList.remove("active");
    document.getElementById("project-sidebar").classList.remove("active");
    // Then use a timeout to add the 'active' class back after a short delay
    setTimeout(function () {
      sidebar.classList.add("active");
    }, 500); // Adjust the delay as needed
  } else {
    // If it is not open, just add the 'active' class to open it
    sidebar.classList.add("active");
  }
}

function timeToString(time) {
  let minutes = Math.floor((time / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  let hours = Math.floor((time / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, "0");
  return `${hours}h ${minutes}m`;
}

function updateProjectWindow(data) {
  console.log(`updateProjectWindow ${data}`)
  document.querySelector(".title-timer").innerText = `${data.name}`;
  document.querySelector(".title-timer").style.backgroundColor = `#2e0947`
  document.querySelector(".title-tasks").innerText = data.name;
  document.querySelector(".completed-tasks").innerText =
    data.completed_tasks;
  document.querySelector(".incomplete-tasks").innerText =
    data.incomplete_tasks;

  document.querySelector(".incomplete-tasks").innerText =
    data.incomplete_tasks;
  document.querySelector(".elapsed-time").innerText = `${timeToString(data.time)}`;
  updateSidebar(data);

}

function updateUIWithProjectData(data) {
  updateProjectWindow(data);
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
            <div class="task-time-dinamic">${timeToString(task.time)}</div>
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

const handleBtnTaskClickWrapper = function() {
  handleTimeIsRunning('task', this);
};

const handleBtnProjectClickWrapper = function() {
  handleTimeIsRunning('project', this);
};

const initializeEventListeners = () => {
  const btnUncheckTasks = document.querySelectorAll(".uncheck-task");
  btnUncheckTasks.forEach((btn) => {
    btn.removeEventListener("click", uncheckTask); 
    btn.addEventListener("click", uncheckTask);    
  });

  const btnCheckTasks = document.querySelectorAll(".check-task");
  btnCheckTasks.forEach((btn) => {
    btn.removeEventListener("click", checkTask); 
    btn.addEventListener("click", checkTask);    
  });

  const btnsTasks = document.querySelectorAll(".btn-tasks");
  btnsTasks.forEach((btn) => {
    btn.removeEventListener("click", handleBtnTaskClickWrapper); 
    btn.addEventListener("click", handleBtnTaskClickWrapper);    
  });

  const btnsProjects = document.querySelectorAll(".btn-projects");
  btnsProjects.forEach((btn) => {
    btn.removeEventListener("click", handleBtnProjectClickWrapper); 
    btn.addEventListener("click", handleBtnProjectClickWrapper);    
  });

  const taskDiv = document.querySelector(".show-task-div");
  const showTasks = document.querySelector(".show-tasks");

  const setTaskDivDisplay = (isVisible) => {
    if (taskDiv && showTasks) {
      taskDiv.style.display = isVisible ? "block" : "none";
      showTasks.innerText = isVisible
        ? "Hide completed Tasks"
        : "Show completed Tasks";
      sessionStorage.setItem("taskDivDisplay", isVisible ? "block" : "none");
      sessionStorage.setItem(
        "showTaskInner",
        isVisible ? "Hide completed Tasks" : "Show completed Tasks"
      );
    } 
  };

  if (sessionStorage.getItem("taskDivDisplay")) {
    setTaskDivDisplay(state.isTaskDivVisible);
  } else {
    setTaskDivDisplay(false);
  }

  function toggleTaskDiv() {
    console.log("toggleTaskDiv pressed");
    state.isTaskDivVisible = !state.isTaskDivVisible;
    setTaskDivDisplay(state.isTaskDivVisible);
  }

  if (showTasks) {
    showTasks.addEventListener("click", toggleTaskDiv);
  }
};


// Self-invoking function to set up everything

(() => {
  initializeEventListeners();
})();
