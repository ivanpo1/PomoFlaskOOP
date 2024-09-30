import Project from 'static/js/Project'

class ProjectBuilder {
    constructor(name) {
      this.name = name;  // Mandatory field
    }
  
    setId(id) {
      this.id = id;
      return this;  // Return this for chaining
    }
  
    setTime(time) {
      this.time = time;
      return this;
    }
  
    setComplete(complete) {
      this.complete = complete;
      return this;
    }
  
    setPomodoros(pomodoros) {
      this.pomodoros = pomodoros;
      return this;
    }
  
    setCreatedAt(created_at) {
      this.created_at = created_at;
      return this;
    }
  
    setCompletedAt(completed_at) {
      this.completed_at = completed_at;
      return this;
    }
  
    setTasks(tasks) {
      this.tasks = tasks;
      return this;
    }
  
    build() {
      return new Project(this);  // Pass the builder object to the Project constructor
    }
  }

export default ProjectBuilder;
