class Project {
  constructor(builder) {
    this.id = builder.id;
    this.name = builder.name;
    this.time = builder.time || 0;
    this.complete = builder.complete || false;
    this.pomodoros = builder.pomodoros || 0;
    this.created_at = builder.created_at;
    this.completed_at = builder.completed_at;
    this.tasksIDs = builder.tasksIDs || [];
  }

  addTask(task) {
    this.tasksIDs.push(task.id);
  }

  removeTask(taskId) {
    this.taskIDs = this.tasksIDs.filter((id) => id !== taskId);
  }

  getIncompleteTasks(taskManager) {
    return this.tasksIDs
      .map((id) => taskManager.getTaskById(id))
      .filter((task) => task && !task.complete);
  }

  getCompleteTasks(taskManager) {
    return this.tasksIDs
      .map((id) => taskManager.getTaskById(id))
      .filter((task) => task && task.complete);
  }

  getTotalTimeSpent(taskManager) {
    return this.taskIDs
      .map((id) => taskManager.getTaskById(id))
      .reduce((total, task) => total + (task ? task.time : 0), 0);
  }

  updateProjectName(name) {
    this.name = name;
  }

  setComplete(status) {
    this.complete = status;
  }

  toJSON() {
    return {
        id: this.id,
        name: this.name,
        taskIds: this.tasksIDs,
        complete: this.complete,
        time: this.getTotalTimeSpent(taskManager),
    };
  }

  getTaskById(taskId, taskManager) {
    return taskManager.getTaskById(taskId);
  }
}
