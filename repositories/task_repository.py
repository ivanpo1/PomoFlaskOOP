from models.task import Task
from utils.database_handler import DatabaseHandler

class TaskRepository:
    @staticmethod
    def get_by_id(task_id):
        return Task.query.filter_by(id=task_id).first()
    
    @staticmethod
    def add(task):
        return DatabaseHandler.add(task)

    @staticmethod
    def get_by_name(task_name):
        return Task.query.filter_by(name=task_name).first()
    
    @staticmethod
    def get_all():
        return Task.query.all()
    
    @staticmethod
    def get_all_in_project(project_id):
        return Task.query.filter_by(project_id=project_id).all()
