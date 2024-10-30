from app.models import Task
from app.repositories import ProjectRepository
from app.repositories import TaskRepository
from app.utils.helpers import Response
from datetime import datetime

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
        
    @staticmethod
    def update_task(task_id, data):
        task = TaskRepository.get_by_id(task_id)
        
        if not task:
            return Response(False, "Updating Task Failed: Task not found", None, 404)
        
        task.name = data.get('name', task.name)
        task.time = data.get('time', task.time)
        task.complete = data.get('complete', task.complete)
        task.pomodoros = data.get('pomodoros', task.pomodoros)
        
        if 'completed_at' in data:
            try:
                task.completed_at = datetime.fromisoformat(data['completed_at'])
            except ValueError:
                return Response(False, "Updating Task Failed: Invalid date format for completed_at", None, 400)
        
        success, error = TaskRepository.update(task)
        if success:
            return Response(True, "Task updated successfully", task.to_dict(), 200)
        else:
            return Response(False, f"Updating Task Failed: {error}", None, 500)
        
    @staticmethod
    def get_task_by_id(task_id):
        if not task_id:
            return Response(False, "Retrieving Task Failed: Invalid Task ID", None, 400)
        
        task = TaskRepository.get_by_id(task_id)
        if not task:
            return Response(False, "Retrieving Task Failed: Task not found", None, 404)
        
        return Response(True, None, task.to_dict(), 200)

    @staticmethod
    def get_task_by_name(task_name):
        if not task_name:
            return Response(False, "Retrieving Task Failed: Task name is required", None, 400)
        
        task = TaskRepository.get_by_name(task_name)
        if not task:
            return Response(False, "Retrieving Task Failed: Task not found", None, 404)
        
        return Response(True, None, task.to_dict(), 200)

    @staticmethod
    def get_all_tasks():
        tasks = TaskRepository.get_all()
        task_list = [task.to_dict() for task in tasks]
        
        return Response(True, None, task_list, 200)

    @staticmethod
    def get_tasks_in_project(project_id):
        if not project_id.isdigit():
            return Response(False, "Retrieving Tasks Failed: Invalid project ID", None, 400)
        
        tasks = TaskRepository.get_all_in_project(project_id)
        task_list = [task.to_dict() for task in tasks]
        
        return Response(True, None, task_list, 200)

    @staticmethod
    def get_completed_tasks():
        tasks = TaskRepository.get_completed_tasks()
        task_list = [task.to_dict() for task in tasks]
        
        return Response(True, None, task_list, 200)

    @staticmethod
    def get_tasks_by_date_range(start_date, end_date):
        if not start_date or not end_date:
            return Response(False, "Retrieving Tasks Failed: Date range is required", None, 400)
        
        tasks = TaskRepository.get_tasks_by_date_range(start_date, end_date)
        task_list = [task.to_dict() for task in tasks]
        
        return Response(True, None, task_list, 200)

    @staticmethod
    def get_uncompleted_tasks_in_project(project_id):
        if not project_id.isdigit():
            return Response(False, "Retrieving Tasks Failed: Invalid project ID", None, 400)
        
        tasks = TaskRepository.get_uncompleted_tasks_in_project(project_id)
        task_list = [task.to_dict() for task in tasks]
        
        return Response(True, None, task_list, 200)

    @staticmethod
    def mark_task_as_complete(task_id):
        if not task_id:
            return Response(False, "Marking Task as Complete Failed: Invalid Task ID", None, 400)
        
        success, error = TaskRepository.mark_task_as_complete(task_id)
        if success:
            return Response(True, None, None, 200)
        else:
            return Response(False, f"Marking Task as Complete Failed: {error}", None, 500)
