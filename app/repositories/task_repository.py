from app.models import Task
from app.utils import DatabaseHandler

class TaskRepository:
    @staticmethod
    def save(task):
        return DatabaseHandler.add(task)

    @staticmethod
    def delete_task(task_id):
        task = Task.query.get(task_id)
        return DatabaseHandler.delete(task)
        
    @staticmethod
    def get_by_id(task_id):
        return Task.query.filter_by(id=task_id).first()
    
    @staticmethod
    def get_by_name(task_name):
        return Task.query.filter_by(name=task_name).first()
    
    @staticmethod
    def get_all():
        return Task.query.all()
    
    @staticmethod
    def get_all_in_project(project_id):
        return Task.query.filter_by(project_id=project_id).all()
    
    @staticmethod
    def get_completed_tasks():
        return Task.query.filter_by(complete=True).all()

    @staticmethod
    def get_tasks_by_date_range(start_date, end_date):
        return Task.query.filter(Task.created_at.between(start_date, end_date)).all()
    
    @staticmethod
    def get_uncompleted_tasks_in_project(project_id):
        return Task.query.filter_by(project_id=project_id, complete=False).all()

    @staticmethod
    def mark_task_as_complete(task_id):
        task = Task.query.get(task_id)
        if task:
            task.complete = True
            DatabaseHandler.commit()