

export default class TaskManager {
    constructor(stateManager, uiManager, projectManager) {
      this.stateManager = stateManager;
      this.uiManager = uiManager;
      this.projectManager = projectManager;
      this.tasks = [];
    }
  
    addTasks(task) {
      task.addObserver(this);
      this.tasks.push(task);
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
            console.log(`fetchTaskData successful, data:`, taskData);
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
          method: 'POST', // Specify that you're using POST
          headers: {
            'Content-Type': 'application/json', // This ensures JSON data is expected
          }
        });
    
        const taskData = await response.json();
    
        if (taskData.error) {
          console.error("Error adding task: ", taskData.error);
          return null;
        } else {
          console.log("addTask successful, task:", taskData)
          return taskData;
        }
      } catch (error) {
        console.error("Error adding task: ", error);
        return null;
      }
    }
    

  
    async handleBtnTaskClick(button) {
      try {
          const taskId = button.getAttribute("data-task-id");
          const projectId = button.getAttribute("data-project-id");
  
          // Update button styles based on task
          this.uiManager.updateButtonStyles(
              "task",
              button,
              this.stateManager.state.previousClickedButton
          );
  
          // Update selected project and task IDs in the state manager
          this.stateManager.setSelectedProjectId(projectId);
          this.stateManager.setSelectedTaskId(taskId);
          this.stateManager.state.previousClickedButton = button;
  
          // Fetch task data asynchronously
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


    async checkTask(e) { 
      const taskId = e.dataset.taskId;
      this.uiManager.toggleSpinner(taskId, true)

      try {
        console.log('event', e)
        const projectId = e.dataset.projectId;
        console.log(`Check Task ID: ${taskId} Check Project ID: ${projectId}`);
    
        await this.completeTask(taskId, projectId);

      } catch (error) {
        console.error("Failed to complete task:", error)
      } finally {
        this.uiManager.toggleSpinner(taskId, false)
      }
    }
  
    async completeTask(taskId, projectId) {
      try { 
        const response = await fetch(`/complete/task/${taskId}`);
        const data = await response.json();
        console.log(`ProjectID on complete task: ID: ${projectId}`)
  
        if (data.error) {
          console.error(`Error setting task as completed:`, data.error);
        } else {

          this.projectManager.updateFromProject(projectId);
        } 
      } catch (error) {
        console.error(`Error completing task:`, error);
      }
    }
  
    async uncheckTask(e) { // MOVE TO UIManager?
      // e.stopPropagation();

      const taskId = e.dataset.taskId;
      this.uiManager.toggleSpinner(taskId, true)

      try {
        const projectId = e.dataset.projectId;
    
        await this.uncompleteTask(taskId, projectId);
      } catch (error) {
        console.error("Failed to uncomplete task: ", error)
      } finally {
        this.uiManager.toggleSpinner(taskId, false)
      }
    };
  
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
