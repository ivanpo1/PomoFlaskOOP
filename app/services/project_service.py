from app.repositories import ProjectRepository
from app.models import Project

class ProjectService:
    @staticmethod
    def add_project(project_data):
        # Validation logic here
        project = Project(name=project_data['name'])
        ProjectRepository.save(project)
        return project.to_dict()