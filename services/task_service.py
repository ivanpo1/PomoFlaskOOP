from models.task import Task
from utils.database_handler import DatabaseHandler
from repositories.project_repository import ProjectRepository
from repositories.task_repository import TaskRepository

class TaskService:
    @staticmethod
    def add_task(task_name, project_id):
        if not task_name:
            return None, "Adding Task Failed: Task name is required", 400
        if not project_id.isdigit():
            return None, "Adding Task Failed: Invalid project ID", 400
        
        project = ProjectRepository.get_by_id(project_id)
        if not project:
            return None, "Adding Task Failed: Project not found", 404

        task = Task(name=task_name, project_id=project.id, complete=False)
        success, error = TaskRepository.add(task)
        
        if success:
            return task.to_dict(), None, 201
        else:
            return None, f"Adding Task Failed: {error}", 500
