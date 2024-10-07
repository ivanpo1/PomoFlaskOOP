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

    this.observers = [];
  }

    addObserver(observer) {
      this.observers.push(observer);
    }

    notifyObservers() {
      this.observers.forEach((observer) => observer.update(this))
    }

    setName(name) {
      this.name = name;
      this.notifyObservers();
    }

    getName() {
      return this.name;
    }

    getId() {
      return this.id;
    }
  
    setTime(time) {
      this.time = time;
      this.notifyObservers();
    }

    getTime() {
      return this.time;
    }

    isComplete() {
      return this.complete;
    }
  
    setComplete(complete) {
      this.complete = complete;
      this.completed_at = complete ? new Date() : null;
      this.notifyObservers();
    }
  
    setPomodoros(pomodoros) {
      this.pomodoros = pomodoros;
      this.notifyObservers();
    }
  
    setProjectId(projectId) {
      this.projectId = projectId;
      this.notifyObservers();
    }

    getProjectId() {
      return this.projectId;
    }
  
    markComplete() {
      this.setComplete(true)
    }


}

export default Task;
