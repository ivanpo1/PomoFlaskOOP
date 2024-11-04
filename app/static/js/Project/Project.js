class Project {
  constructor(builder) {
    this.id = builder.id;
    this.name = builder.name;
    this.time = builder.time || 0;
    this.complete = builder.complete || false;
    this.pomodoros = builder.pomodoros || 0;
    this.created_at = builder.created_at;
    this.completed_at = builder.completed_at;
    this.tasks = builder.tasks || [];

  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.getId() !== taskId);
  }

  getIncompleteTasks() {
    return this.tasks
      .filter((task) => task.isComplete());
  }

  getCompleteTasks() {
    return this.tasks
      .filter((task) => task.isComplete());
  }

  getTotalTimeSpent() {
    return this.tasks
      .reduce((total, task) => total + (task ? task.getTime() : 0), 0);
  }

  updateProjectName(name) {
    this.name = name;
  }

  setComplete(status) {
    this.complete = status;
  }

  toJSON(taskManager) {
    return {
        id: this.id,
        name: this.name,
        taskIds: this.tasks,
        complete: this.complete,
        time: this.getTotalTimeSpent(taskManager),
    };
  }

  getTaskById(taskId, taskManager) {
    return taskManager.getTaskById(taskId);
  }
}

export default Project;