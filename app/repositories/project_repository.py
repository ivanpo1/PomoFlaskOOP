from models import Project
from utils.database_handler import DatabaseHandler

class ProjectRepository:
    @staticmethod
    def get_by_id(project_id):
        return Project.query.filter_by(id=project_id).first()
    
    @staticmethod
    def save(project):
        DatabaseHandler.add(project)

    @staticmethod
    def get_by_name(project_name):
        return Project.query.filter_by(name=project_name).first()
    
    @staticmethod
    def get_all():
        return Project.query.all()

    @staticmethod
    def delete_project(project_id):
        project = Project.query.filter_by(id=project_id).first()
        if project:
            return DatabaseHandler.delete(project)
        return 'something'