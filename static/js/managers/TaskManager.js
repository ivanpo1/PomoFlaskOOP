

class TaskManager {
    constructor(stateManager, uiManager, projectManager) {
      this.stateManager = stateManager;
      this.uiManager = uiManager;
      this.projectManager = projectManager;
      this.tasks = [];
    }
  
    addTasks(task) {
      task.addObserver(this);
      task.addObserver(this.uiManager)
      this.tasks.push(task);    
    }

    getTaskById(taskId) {
      const task = this.tasks.find(task => task.id === Number(taskId))
      // console.log(task)
      return task
    }

    // deleteTask(taskId) {
    //   this.tasks = this.tasks.filter(task => task.id !== taskId);
    //   this.syncDeleteToDatabase(taskId);
    // }

    update(task) {
      this.syncToDatabase(task);
    }

    async syncToDatabase(task) {
      const updatedFields = {
        name: task.name,
        time: task.time,
        complete: task.complete,
        pomodoros: task.pomodoros,
        completed_at: task.completed_at,
        projectId: task.projectId,
      };
  
      try {
        const response = await fetch(`api/task/${task.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFields),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update task in the database.");
        } else {
          console.log("Task updated successfully in the database.");
        }
      } catch (error) {
        console.error(error.message);
      }
    }

    // async syncDeleteToDatabase(taskId) {
    //   // Send request to backend to delete task from database
    //   fetch(`/api/delete_task/${taskId}`, { method: 'DELETE' })
    //     .then(response => response.json())
    //     .then(data => console.log(`Task ${taskId} deleted from database.`))
    //     .catch(error => console.error('Error deleting task:', error));
    // }


    getAllTasks() {
      return this.tasks;
    }

    async fetchTaskData(taskId) {
      try {
        const response = await fetch(`/api/tasks/${taskId}`)
        const taskData = await response.json();
      
        if (taskData.error) {
         console.error("Error fetching task:", taskData.error);
         return null;
        } else {
            // console.log(`fetchTaskData successful, data:`, taskData);
            sessionStorage.setItem("taskData", JSON.stringify(taskData));
            // this.stateManager.setSelectedTaskId(taskId);
            // this.uiManager.updateInfoBox('task', data);
            // this.uiManager.updateTitleTimer(data.name, '#0F4C75')
            return taskData;
          }
        } catch (error) {
          console.error(`Error fetching Task data: `, error)
          return null;
        };
    }

    async addTaskToDatabase(taskName) {
      try {
        const encodedTaskName = encodeURIComponent(taskName);
        const response = await fetch(`/add_task/${encodedTaskName}/${this.stateManager.state.selectedProjectId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // This ensures JSON data is expected
          },
        });
    
        const responseJSON = await response.json();
    
        if (!response.ok) { // Check if the response status is OK
          throw new Error(responseJSON.error || "Failed to add task");
        }
    
        console.log("addTask successful, task:", responseJSON.data);
        return responseJSON.data;
      } catch (error) {
        console.error("Error adding task: ", error);
        return null;
      }
    }
    

  
    async handleBtnTaskClick(button) {
      try {
          const taskId = button.getAttribute("data-task-id");
          const projectId = button.getAttribute("data-project-id");
   
          this.uiManager.updateButtonStyles(
              "task",
              button,
              this.stateManager.state.previousClickedButton
          );
  
          this.stateManager.setSelectedProjectId(projectId);
          this.stateManager.setSelectedTaskId(taskId);
          this.stateManager.state.previousClickedButton = button;
  
          const taskData = await this.fetchTaskData(taskId);
          
          if (taskData) {
              // console.log('Task data fetched successfully:', taskData);
              this.stateManager.setSelectedTaskId(taskId);
              this.uiManager.updateInfoBox('task', taskData);
              this.uiManager.updateTitleTimer(taskData.name, '#0F4C75')
          } else {
              console.error('Failed to fetch task data.');
          }
  
      } catch (error) {
          console.error("Error in handleBtnTaskClick:", error);
      }
    }


    // async checkTask(e) { 
    //   const taskId = e.dataset.taskId;
    //   this.uiManager.toggleSpinner(taskId, true)

    //   try {
    //     console.log('event', e)
    //     const projectId = e.dataset.projectId;
    //     console.log(`Check Task ID: ${taskId} Check Project ID: ${projectId}`);
    
    //     await this.completeTask(taskId, projectId);

    //   } catch (error) {
    //     console.error("Failed to complete task:", error)
    //   } finally {
    //     this.uiManager.toggleSpinner(taskId, false)
    //   }
    // }

    async checkTask(e) { 
      // console.log('checkTask: whats e?', e)
      const taskId = e.dataset.taskId;
      const task = this.getTaskById(taskId); 
      // this.uiManager.toggleSpinner(taskId, true);
      
      
      task.setComplete(true);
      // const taskElement = document.querySelector(`.task-w-${taskId}`);
      // this.uiManager.moveTask("incomplete-task-div", "complete-task-div", taskElement)
      
      // // this.uiManager.toggleSpinner(taskId, false);
      // console.log(this.tasks.filter((t) => t && !t.complete && t.projectId === task.projectId).length)
      // const project = this.projectManager.getProjectById(task.projectId)
      // console.log(project.getIncompleteTasks(this).length)
      
      // const projectData = this.projectManager.getProjectById(task.projectId)
      // console.log(projectData)
      // this.uiManager.updateProjectInfoBox(projectData)
    }

    async uncheckTask(e) { 
      // console.log('uncheckTask: whats e?', e)
      const taskId = e.dataset.taskId;
      const task = this.getTaskById(taskId);    
    
      // this.uiManager.toggleSpinner(taskId, true);
        
      task.setComplete(false);
      // const taskElement = document.querySelector(`.task-w-${taskId}`);
      // this.uiManager.moveTask("complete-task-div", "incomplete-task-div", taskElement)


      // const projectData = this.projectManager.getProjectById(task.projectId)
      // console.log(projectData)
      // this.uiManager.updateProjectInfoBox(projectData)

      
      // this.uiManager.toggleSpinner(taskId, false);
    }
  
    async completeTask(taskId, projectId) {
      try { 
        const response = await fetch(`/complete/task/${taskId}`);
        const data = await response.json();
        // console.log(`ProjectID on complete task: ID: ${projectId}`)
  
        if (data.error) {
          console.error(`Error setting task as completed:`, data.error);
        } else {

          this.projectManager.updateFromProject(projectId);
        } 
      } catch (error) {
        console.error(`Error completing task:`, error);
      }
    }
  
    // async uncheckTask(e) { // MOVE TO UIManager?
    //   // e.stopPropagation();

    //   const taskId = e.dataset.taskId;
    //   this.uiManager.toggleSpinner(taskId, true)

    //   try {
    //     const projectId = e.dataset.projectId;
    
    //     await this.uncompleteTask(taskId, projectId);
    //   } catch (error) {
    //     console.error("Failed to uncomplete task: ", error)
    //   } finally {
    //     this.uiManager.toggleSpinner(taskId, false)
    //   }
    // };
  
    async uncompleteTask(taskId, projectId) {
      try {
        const response = await fetch(`/uncomplete/task/${taskId}`);
        const data = await response.json();
  
        if (data.error) {
          console.error(`Error setting task as incomplete: `, data.error);
        } else {
          this.projectManager.updateFromProject(projectId)
        }
      } catch (error) {
        console.error(`Error marking Task as incomplete: `, error);
      }
    }
  
    async deleteTask(e) {
      const taskId = e.dataset.taskId;
      const projectId = e.dataset.projectId;
      try {
        const response = await fetch(`/delete_task/${taskId}`, {
          method: "DELETE",
        });
        const data = await response.json();
  
        if (data.error) {
          console.error(`Failed to delete item with Task ID: ${taskId}`);
        } else {
          this.projectManager.updateFromProject(projectId);
        }
      } catch (error) {
        console.error(`Error deleting Task ID: ${taskId}`);
      }
    }
  }

export default TaskManager;
