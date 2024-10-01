class Task {
  constructor(builder) {
    this.id = builder.id;
    this.name = builder.name;
    this.time = builder.time || 0;
    this.complete = builder.complete || false;
    this.pomodoros = builder.complete || 0;
    this.created_at = builder.created_at;
    this.completed_at = builder.completed_at;
    this.projectId = builder.projectId;
  }

    setName(name) {
      this.name = name;
    }
  
    setTime(time) {
      this.time = time;
    }
  
    setComplete(complete) {
      this.complete = complete;
    }
  
    setPomodoros(pomodoros) {
      this.pomodoros = pomodoros;
    }
  
    setProjectId(projectId) {
      this.projectId = projectId;
    }
  
    markComplete() {
      this.complete = true;
      this.completed_at = new Date(); 
    }
}

export default Task;
