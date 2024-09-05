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
      if (event.target.classList.contains("btn-delete")) {
        taskManager.deleteTask(event.target);
      }
    });

    const projectsContainer = document.querySelector('.projects-container');

    // Event delegation for project buttons
    projectsContainer.addEventListener('click', (event) => {
        // Check if the clicked element is a project button
        if (event.target.classList.contains('btn-projects')) {
            projectManager.handleBtnProjectClick(event.target);
        }
    });
  });

  // console.log(projectManager.fetchProjectData(sessionStorage.getItem("selectedProjectId")))

  async function initPage() {
    const selectedProjectId = sessionStorage.getItem("selectedProjectId");
    if (selectedProjectId) {
        const projectData = await projectManager.fetchProjectData(selectedProjectId);
        await uiManager.updateProjectInfoBox(projectData);
    }
}

document.addEventListener("DOMContentLoaded", initPage);