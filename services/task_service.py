from models import Task
from utils.database_handler import DatabaseHandler
from repositories.project_repository import ProjectRepository
from repositories.task_repository import TaskRepository

class TaskService:
    @staticmethod
    def add_task(task_name, project_id):
        if not task_name:
            return False, "Adding Task Failed: Task name is required", None, 400
        
        if not project_id.isdigit():
            return False, "Adding Task Failed: Invalid project ID", None, 400
        
        project = ProjectRepository.get_by_id(project_id)
        if not project:
            return False, "Adding Task Failed: Project not found", None, 404

        task = Task(name=task_name, project_id=project.id, complete=False)
        success, error = TaskRepository.add(task)
        
        if success:
            return True, None, task.to_dict(), 201
        else:
            return False, f"Adding Task Failed: {error}", None, 500
        
    @staticmethod
    def delete_task(task_id):
        if not task_id:
            return False, "Deleting Task Failed: Invalid Task ID", None, 400
        
        task = TaskRepository.get_by_id(task_id)
        if not task:
            return False, "Deleting Task Failed: Task not found", None, 404
