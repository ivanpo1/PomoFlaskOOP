from flask import Blueprint, render_template, session
from app.models import Task, Project
from app.services import ProjectService, TaskService
from app.utils import create_response

timer_bp = Blueprint('timer', __name__,) #url_prefix='/timer')

@timer_bp.route("/timer", methods=["GET", "POST"])
def timer():
    try:
        # Check if current_project_id exists in session
        current_project_id = 1
        if not current_project_id:
            # Optionally, redirect to a different page or return a custom message
            return create_response(False, "No project selected", None, 400)
        
        # Retrieve current project and its tasks
        current_project = ProjectService.get_project_by_id(current_project_id)
        tasks = TaskService.get_tasks_by_project_id(current_project_id)
        
        # Check if there are any complete tasks
        has_complete_task = any(task.complete for task in tasks)
        
        # Retrieve all projects for the dropdown
        projects = ProjectService.get_all_projects()
        
        project_list = [{"name": project.name, "id": project.id} for project in projects]
        
        return render_template("timer.html", tasks=tasks, projects=project_list, has_complete_task=has_complete_task)
    
    except Exception as e:
        print(f"An error occurred: {e}")
        # Fallback: render template with just projects if an error occurs
        projects = ProjectService.get_all_projects()
        # print(projects.data)
        # for project in projects.data:
        #     print(project)
        # project_data = projects["data"]  # Access the project list from the response dictionary
        # project_list = [{"name": project["name"], "id": project["id"]} for project in project_data]
        return render_template("timer.html", projects=projects.data)

@timer_bp.route("/set_current_task/<string:task_name>", methods=["GET"])
def set_current_task(task_name):
    # Set current task logic here
    pass