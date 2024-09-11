import ProjectManager from './managers/ProjectManager.js';
import TaskManager from './managers/TaskManager.js';
import StateManager from './managers/StateManager.js';
import UIManager from './managers/UIManager.js';
import { Timer } from "./timer.js"
import initializeEventListeners from './managers/EventListenerManager.js';

// Initialize StateManager
const stateManager = new StateManager();
const uiManager = new UIManager(stateManager);

// Pass StateManager to other managers
const projectManager = new ProjectManager(stateManager, uiManager);
const taskManager = new TaskManager(stateManager, uiManager, projectManager);
const timer = new Timer(1500000, 60000, stateManager)

export { projectManager, taskManager, uiManager, timer };

// initializeEventListeners();

document.addEventListener("DOMContentLoaded", () => {
    const tasksContainer = document.querySelector(".task-container");
  
    // Event delegation: handle clicks on task buttons
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

      // if (event.target.classList.contains("btn-delete")) {
      //   taskManager.deleteTask(event.target);
      // }

      if (event.target.classList.contains("btn-delete-task")) {
        uiManager.taskToDelete = event.target;
        uiManager.showDeleteModal("Task");
        // taskManager.deleteTask(event.target);
      }
      
      
    });
    
    const projectsContainer = document.querySelector('.projects-container');
    
    // Event delegation for project buttons
    projectsContainer.addEventListener('click', (event) => {
      // Check if the clicked element is a project button
      if (event.target.classList.contains('btn-projects')) {
        projectManager.handleBtnProjectClick(event.target);
      }
      
      if (event.target.classList.contains("btn-delete-project")) {
        // projectManager.deleteProject(event.target);
        uiManager.projectToDelete = event.target;
        uiManager.showDeleteModal("Project");
      }
    });

    const confirmDeleteBtn = document.getElementById("confirmDelete");
    confirmDeleteBtn.addEventListener("click", () => {
      if (uiManager.projectToDelete) {
        console.log("Delete confirmed", uiManager.projectToDelete);
        projectManager.deleteProject(uiManager.projectToDelete);
        uiManager.hideDeleteModal();
        uiManager.projectToDelete = null;
      }

      if (uiManager.taskToDelete) {
        console.log("Delete confirmed", uiManager.taskToDelete);
        taskManager.deleteTask(uiManager.taskToDelete);
        uiManager.hideDeleteModal();
        uiManager.taskToDelete = null;
      }
    });

    const cancelDeleteBtn = document.getElementById('cancelDelete');
    cancelDeleteBtn.addEventListener('click', () => {
      uiManager.hideDeleteModal();
    });
  });

  const addTaskForm = document.querySelector('#addTaskForm')
  addTaskForm.addEventListener("submit", async function (event) {
    // stop form submission
    event.preventDefault();
  
    // validate the form
    let taskName = addTaskForm.elements["name_task"].value;
    const task = await taskManager.addTask(taskName)
    addTaskForm.reset();
    if (task) {
      // Example of adding the task to the UI
      const taskItem = uiManager.createTaskItem(task, false); // Assuming new task is not completed
      taskItem.classList.add('fade-in');
      document.querySelector(".ul-task-list-incomplete").prepend(taskItem); // Add the task to the top of the list

      setTimeout(() => {
        taskItem.classList.add('visible');
      }, 10);
    }
  });

  // console.log(projectManager.fetchProjectData(sessionStorage.getItem("selectedProjectId")))

//   async function initPage() {
//     const selectedProjectId = sessionStorage.getItem("selectedProjectId");
//     if (selectedProjectId) {
//         const projectData = await projectManager.fetchProjectData(selectedProjectId);
//         await uiManager.updateProjectInfoBox(projectData);
//     }
// }

// document.addEventListener("DOMContentLoaded", initPage);