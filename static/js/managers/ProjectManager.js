
export default class ProjectManager {
    constructor(stateManager, uiManager) {
      this.stateManager = stateManager;
      this.uiManager = uiManager;
    }
  
    
    async fetchProjectData(projectId) {
      try {
        const response = await fetch("/api/projects/" + projectId);
        const projectData = await response.json();
  
        if (projectData.error) {
          console.error("Error fetching project:", projectData.error);
          return null;
        } else {
          console.log("fetchProjectData, data:", projectData);
          // this.stateManager.setSelectedProjectId(projectId);
          this.stateManager.setProjectData(projectId, projectData)
          sessionStorage.setItem("projectData", JSON.stringify(projectData));
  
          return projectData;
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        return null;
      }
    }

    async updateFromProject(projectId) {
      const projectData = await this.fetchProjectData(projectId);
      this.uiManager.updateTaskList(projectData);
      this.uiManager.updateProjectInfoBox(projectData);
    }
  
    async handleBtnProjectClick(button) {

      console.log('handleBtnProjectClick pressed')

      try {   
        const projectId = button.getAttribute("data-project-id");

        this.uiManager.updateButtonStyles(
          "project",
          button,
          this.stateManager.state.previousClickedButton
        );
    
        // Update state
        this.stateManager.setSelectedProjectId(projectId);
        this.stateManager.state.previousClickedButton = button;
    
        const projectData = await this.fetchProjectData(projectId);

        if (projectData) {
          this.uiManager.updateTaskList(projectData);
          this.uiManager.updateTitleTimer(projectData.name, '#2e0947');
          this.uiManager.updateProjectInfoBox(projectData);
        } else {
          console.error("Failted to fetch project data")
        }
      } catch (error) {
        console.error("Error fetching project data:", error)
      }
    }

    async deleteProject(e) {

      const projectId = e.dataset.projectId;

      console.log(projectId)
      try {
        const response = await fetch(`/delete_project/${projectId}`, {
          method: "DELETE",
        });
        const data = await response.json();
  
        if (data.error) {
          console.error(`Failed to delete item with Project ID: ${projectId}`);
        } else {
          window.location.href = "/timer";
        }
      } catch (error) {
        console.error(`Error deleting Task ID: ${projectId}`);
      }
    }
}