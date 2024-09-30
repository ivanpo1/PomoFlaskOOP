import Task from "./TaskBuilder.js"

class TaskBuilder {
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
    
      build() {
        return new Task(this);  // Pass the builder object to the Project constructor
      }
}

export default TaskBuilder;