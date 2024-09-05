export default class TaskManager {
    constructor(stateManager, uiManager, projectManager) {
      this.stateManager = stateManager;
      this.uiManager = uiManager;
      this.projectManager = projectManager;
    }
  

    async fetchTaskData(taskId) {
      try {
        const response = await fetch(`/api/tasks/${taskId}`)
        const data = await response.json();
      
        if (data.error) {
         console.error("Error fetching task:", data.error);
         return null;
        } else {
            console.log(`fetchTaskData successful, data:`, data);
            sessionStorage.setItem("taskData", JSON.stringify(data));
            // this.stateManager.setSelectedTaskId(taskId);
            // this.uiManager.updateInfoBox('task', data);
            // this.uiManager.updateTitleTimer(data.name, '#0F4C75')
            return data;
          }
        } catch (error) {
          console.error(`Error fetching Task data: `, error)
          return null;
        };
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
  
    async uncheckTask(e) {
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
        const response = await fetch(`/delete/${taskId}`, {
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
