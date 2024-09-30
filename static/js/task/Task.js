class Task {
    constructor(builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.time = builder.time;
        this.complete = builder.complete || false;
        this.pomodoros = builder.complete;
        this.created_at = builder.created_at;
        this.completed_at = builder.completed_at;
        this.projectId = builder.projectId;
    }

    
}