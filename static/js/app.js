import ProjectManager from "./managers/ProjectManager.js";
import TaskManager from "./managers/TaskManager.js";
import StateManager from "./managers/StateManager.js";
import UIManager from "./managers/UIManager.js";
import { Timer } from "./timer.js";
import ProjectBuilder from "./Project/ProjectBuilder.js";
import TaskBuilder from "./task/TaskBuilder.js";

const stateManager = new StateManager();
const uiManager = new UIManager(stateManager);

const projectManager = new ProjectManager(stateManager, uiManager);
const taskManager = new TaskManager(stateManager, uiManager, projectManager);
const timer = new Timer(stateManager);

export { projectManager, taskManager, uiManager, timer };

document.addEventListener("DOMContentLoaded", () => {
  const timerSettings = document.querySelector(".settings-timer");

  timerSettings.addEventListener("input", (event) => {
    const { name, value } = event.target;

    if (name && value) {
      const numericValue = parseInt(value, 10);
      timer.setTimerMode(name, numericValue);
      console.log(`Setting ${name} to ${numericValue}`);
    }
  });

  const tasksContainer = document.querySelector(".task-container");

  tasksContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-tasks")) {
      console.log("target");
      taskManager.handleBtnTaskClick(event.target);
    }

    if (event.target.classList.contains("check-task")) {
      taskManager.checkTask(event.target);
    }

    if (event.target.classList.contains("uncheck-task")) {
      taskManager.uncheckTask(event.target);
    }

    if (event.target.classList.contains("show-tasks")) {
      uiManager.showCompletedTask(event.target);
    }

    if (event.target.classList.contains("btn-delete-task")) {
      stateManager.taskToDelete = event.target;
      uiManager.showDeleteModal("Task");
      // taskManager.deleteTask(event.target);
    }
  });

  const projectsContainer = document.querySelector(".projects-container");

  projectsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-projects")) {
      projectManager.handleBtnProjectClick(event.target);
    }

    if (event.target.classList.contains("btn-delete-project")) {
      // projectManager.deleteProject(event.target);
      stateManager.projectToDelete = event.target;
      uiManager.showDeleteModal("Project");
    }
  });

  const confirmDeleteBtn = document.getElementById("confirmDelete");
  confirmDeleteBtn.addEventListener("click", () => {
    if (stateManager.projectToDelete) {
      console.log("Delete confirmed", stateManager.projectToDelete);
      projectManager.deleteProject(stateManager.projectToDelete);
      uiManager.hideDeleteModal();
      stateManager.projectToDelete = null;
    }

    if (stateManager.taskToDelete) {
      console.log("Delete confirmed", stateManager.taskToDelete);
      taskManager.deleteTask(stateManager.taskToDelete);
      uiManager.hideDeleteModal();
      stateManager.taskToDelete = null;
    }
  });

  const cancelDeleteBtn = document.getElementById("cancelDelete");
  cancelDeleteBtn.addEventListener("click", () => {
    uiManager.hideDeleteModal();
  });
});

const addTaskForm = document.querySelector("#addTaskForm");
addTaskForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  let taskName = addTaskForm.elements["name_task"].value;
  const task = await taskManager.addTaskToDatabase(taskName);
  addTaskForm.reset();
  if (task) {
    const taskItem = uiManager.createTaskElement(task, false);
    taskItem.classList.add("fade-in");
    document.querySelector(".ul-task-list-incomplete").prepend(taskItem);

    setTimeout(() => {
      taskItem.classList.add("visible");
    }, 10);
  }
});

async function databaseAllProjectsFetch() {
  const response = await fetch('/api/project_data'); 
  const projectData = await response.json(); 
  console.log(`projectData`, projectData)

  const projectList = projectData.map(data => 
    new ProjectBuilder(data.name)
      .setId(data.id)
      .setTime(data.time)
      .setPomodoros(data.pomodoros)
      .setCreatedAt(data.created_at)
      .setCompletedAt(data.completed_at)
      .setTaskId(data.taskIds)
      .build()
  );
  
  projectList.forEach(project => projectManager.addProject(project));
}

databaseAllProjectsFetch();

// console.log("Project List: ", projectManager.getAllProjects())

async function databaseAllTasksFetch() {
  const response = await fetch('/api/task_data'); 
  const taskData = await response.json(); 

  const taskList = taskData.map(data => 
    new TaskBuilder(data.name)
      .setId(data.id)
      .setTime(data.time)
      .setComplete(data.complete)
      .setPomodoros(data.pomodoros)
      .setCreatedAt(data.created_at)
      .setCompletedAt(data.completed_at)
      .setProjectId(data.project_id)
      .build()
  );
  
  taskList.forEach(task => {
    taskManager.addTasks(task);
  });
}

databaseAllTasksFetch();

console.log("Task list", taskManager.getAllTasks())

// console.log(projectManager.fetchProjectData(sessionStorage.getItem("selectedProjectId")))

//   async function initPage() {
//     const selectedProjectId = sessionStorage.getItem("selectedProjectId");
//     if (selectedProjectId) {
//         const projectData = await projectManager.fetchProjectData(selectedProjectId);
//         await uiManager.updateProjectInfoBox(projectData);
//     }
// }

// document.addEventListener("DOMContentLoaded", initPage);
