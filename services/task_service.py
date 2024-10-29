from models import Task
from utils.database_handler import DatabaseHandler
from repositories.project_repository import ProjectRepository
from repositories.task_repository import TaskRepository
from helpers import Response

class TaskService:
    @staticmethod
    def add_task(task_name, project_id):
        if not task_name:
            return Response(False, "Adding Task Failed: Task name is required", None, 400)
        
        if not project_id.isdigit():
            return Response(False, "Adding Task Failed: Invalid project ID", None, 400)
        
        project = ProjectRepository.get_by_id(project_id)
        if not project:
            return Response(False, "Adding Task Failed: Project not found", None, 404)

        task = Task(name=task_name, project_id=project.id, complete=False)
        success, error = TaskRepository.add(task)
        
        if success:
            return Response(True, None, task.to_dict(), 201)
        else:
            return Response(False, f"Adding Task Failed: {error}", None, 500)
        
    @staticmethod
    def delete_task(task_id):
        if not task_id:
            return Response(False, "Deleting Task Failed: Invalid Task ID", None, 400)
        
        task = TaskRepository.get_by_id(task_id)
        if not task:
            return Response(False, "Deleting Task Failed: Task not found", None, 404)

        success, error = TaskRepository.delete_task(task_id)

        if success:
            return Response(True, None, None, 201)
        else:
            return Response(False, f"Deleting Task Failed: {error}", None, 500)
