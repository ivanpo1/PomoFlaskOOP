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
}

export default Task;
