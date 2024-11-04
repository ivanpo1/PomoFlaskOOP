from flask import Blueprint, render_template, session
from app.models import Task, Project

timer_bp = Blueprint('timer', __name__, url_prefix='/timer')

@timer_bp.route("/timer", methods=["GET", "POST"])
def timer():
    try:
        current_project_id = session['current_project_id']
        current_project = Project.query.filter_by(id=current_project_id).first()
        # print(f"Current project {current_project}")
        # print(f"Current project id {current_project_id}")
        tasks = Task.query.filter_by(project_id=current_project.id).all()

        has_complete_task = False
        for task in tasks:
            if task.complete == True:
                has_complete_task = True
                break

        projects = [{"name": project.name, "id": project.id} for project in Project.query.all()]  # Create a list of project dictionaries
        return render_template("timer.html", tasks=tasks, projects=projects, has_complete_task=has_complete_task)
    except Exception as e:
        print(f"An error occurred: {e}")
        projects = [{"name": project.name, "id": project.id} for project in Project.query.all()]  # Create a list of project dictionaries      
        # tasks = Task.query.filter_by(project_id=current_project.id).all()
        return render_template("timer.html", projects=projects)

@timer_bp.route("/set_current_task/<string:task_name>", methods=["GET"])
def set_current_task(task_name):
    # Set current task logic here
    pass