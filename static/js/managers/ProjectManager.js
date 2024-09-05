
export default class ProjectManager {
    constructor(stateManager, uiManager) {
      this.stateManager = stateManager;
      this.uiManager = uiManager;
    }
  
    async fetchProjectData(projectId) {
      try {
        const response = await fetch("/api/projects/" + projectId);
        const data = await response.json();
  
        if (data.error) {
          console.error("Error fetching project:", data.error);
          return null;
        } else {
          console.log("fetchProjectData, data:", data);
          // this.stateManager.setSelectedProjectId(projectId);
          this.stateManager.setProjectData(projectId, data)
          sessionStorage.setItem("projectData", JSON.stringify(data));
  
          return data;
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
}