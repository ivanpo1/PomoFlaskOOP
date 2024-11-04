import { projectManager, taskManager, uiManager } from '/static/js/app.js';
import { state } from '/static/js/managers/StateManager.js'

const initializeEventListeners = () => {}
//   // const btnUncheckTasks = document.querySelectorAll(".uncheck-task");
//   // btnUncheckTasks.forEach((btn) => {
//   //   btn.removeEventListener("click", taskManager.uncheckTask.bind(taskManager)); 
//   //   btn.addEventListener("click", taskManager.uncheckTask.bind(taskManager));    
//   // });

//   // const btnCheckTasks = document.querySelectorAll(".check-task");
//   // btnCheckTasks.forEach((btn) => {
//   //   btn.removeEventListener("click", taskManager.checkTask.bind(taskManager)); 
//   //   btn.addEventListener("click", taskManager.checkTask.bind(taskManager));    
//   // });

//   // const btnsTasks = document.querySelectorAll(".btn-tasks");
//   // btnsTasks.forEach((btn) => {
//   //   btn.removeEventListener("click", taskManager.handleBtnTaskClick.bind(taskManager)); 
//   //   btn.addEventListener("click", taskManager.handleBtnTaskClick.bind(taskManager));    
//   // });

//   const tasksContainer = document.querySelector(".task-container");


//   // Event delegation: handle clicks on task buttons
//   tasksContainer.addEventListener("click", (event) => {
//     if (event.target.classList.contains("btn-tasks")) {
//       console.log("target")
//       taskManager.handleBtnTaskClick(event.target);
//     }

//     if (event.target.classList.contains("check-task")) {
//       taskManager.checkTask(event.target);
//     } 
    
//     if (event.target.classList.contains("uncheck-task")) {
//       taskManager.uncheckTask(event.target);
//     }
    
//     if (event.target.classList.contains("show-tasks")) {
//       uiManager.toggleTaskDiv(event.target);
//     }



// });

// //   const btnsProjects = document.querySelectorAll(".btn-projects");

// //   // Define the event handler function
// //   const handleProjectButtonClick = (event) => {
// //       projectManager.handleBtnProjectClick(event.currentTarget);
// //   };
  
// //   // Remove existing event listeners and add the new one
// //   btnsProjects.forEach((btn) => {
// //       btn.removeEventListener("click", handleProjectButtonClick); // Remove existing listener
// //       btn.addEventListener("click", handleProjectButtonClick); // Add new listener
// //   });

//     // const projectsContainer = document.querySelector('.projects-container');

//     // // Event delegation for project buttons
//     // projectsContainer.addEventListener('click', (event) => {
//     //     // Check if the clicked element is a project button
//     //     if (event.target.classList.contains('btn-projects')) {
//     //         projectManager.handleBtnProjectClick(event.target);
//     //     }
//     // });

//   // const taskDiv = document.querySelector(".show-task-div");
//   // const showTasks = document.querySelector(".show-tasks");

//   // const setTaskDivDisplay = (isVisible) => {
//   //   if (taskDiv && showTasks) {
//   //     taskDiv.style.display = isVisible ? "block" : "none";
//   //     showTasks.innerText = isVisible
//   //       ? "Hide completed Tasks"
//   //       : "Show completed Tasks";
//   //     sessionStorage.setItem("taskDivDisplay", isVisible ? "block" : "none");
//   //     sessionStorage.setItem(
//   //       "showTaskInner",
//   //       isVisible ? "Hide completed Tasks" : "Show completed Tasks"
//   //     );
//   //   } 
//   // };

//   // if (sessionStorage.getItem("taskDivDisplay")) {
//   //   setTaskDivDisplay(state.isTaskDivVisible);
//   // } else {
//   //   setTaskDivDisplay(false);
//   // }

//   // function toggleTaskDiv() {
//   //   console.log("toggleTaskDiv pressed");
//   //   state.isTaskDivVisible = !state.isTaskDivVisible;
//   //   setTaskDivDisplay(state.isTaskDivVisible);
//   // }

//   // if (showTasks) {
//   //   console.log("added showTask eventlistener ")
//   //   showTasks.addEventListener("click", toggleTaskDiv);
//   // }
// };



// const projectsContainer = document.querySelector('.projects-container');

//     // Event delegation for project buttons
//     projectsContainer.addEventListener('click', (event) => {
//         // Check if the clicked element is a project button
//         if (event.target.classList.contains('btn-projects')) {
//             projectManager.handleBtnProjectClick(event.target);
//         }
//     });
    
export default initializeEventListeners;
