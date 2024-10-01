import Project from "./project.js";

class ProjectBuilder {
  constructor(name) {
    this.name = name;
  }

  setId(id) {
    this.id = id;
    return this;
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

  setTaskId(taskId) {
    this.taskIds = taskId;
    return this;
  }

  build() {
    return new Project(this); 
  }
}

export default ProjectBuilder;
