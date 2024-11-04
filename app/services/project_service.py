from app.repositories import ProjectRepository
from app.models import Project
from app.utils.helpers import Response

class ProjectService:
    @staticmethod
    def add_project(project_data):
        if not project_data or 'name' not in project_data:
            return Response(False, "Adding Project Failed: Project name is required", None, 400)
        
        if not project_data['name'].strip():
            return Response(False, "Adding Project Failed: Project name cannot be empty", None, 400)
        
        project = Project(name=project_data['name'])
        success, error = ProjectRepository.save(project)
        
        if success:
            return Response(True, None, project.to_dict(), 201)
        else:
            return Response(False, f"Adding Project Failed: {error}", None, 500)
    
    @staticmethod
    def get_all_projects():
        projects = ProjectRepository.get_all_projects()
        if projects is None:
            return Response(False, "Fetching Projects Failed: Database error", None, 500)
        
        return Response(True, None, [project.to_dict() for project in projects], 200)
    
    @staticmethod
    def get_project_by_id(project_id):
        if not project_id:
            return Response(False, "Fetching Project Failed: Project ID is required", None, 400)
        
        if not str(project_id).isdigit():
            return Response(False, "Fetching Project Failed: Invalid project ID", None, 400)
        
        project = ProjectRepository.get_by_id(project_id)
        if not project:
            return Response(False, "Fetching Project Failed: Project not found", None, 404)
        
        return Response(True, None, project.to_dict(), 200)
    
    @staticmethod
    def update_project(project_id, project_data):
        if not project_id:
            return Response(False, "Updating Project Failed: Project ID is required", None, 400)
        
        if not str(project_id).isdigit():
            return Response(False, "Updating Project Failed: Invalid project ID", None, 400)
        
        if not project_data or 'name' not in project_data:
            return Response(False, "Updating Project Failed: Project name is required", None, 400)
        
        if not project_data['name'].strip():
            return Response(False, "Updating Project Failed: Project name cannot be empty", None, 400)
        
        existing_project = ProjectRepository.get_by_id(project_id)
        if not existing_project:
            return Response(False, "Updating Project Failed: Project not found", None, 404)
        
        existing_project.name = project_data['name']
        success, error = ProjectRepository.save(existing_project)
        
        if success:
            return Response(True, None, existing_project.to_dict(), 200)
        else:
            return Response(False, f"Updating Project Failed: {error}", None, 500)
    
    @staticmethod
    def delete_project(project_id):
        if not project_id:
            return Response(False, "Deleting Project Failed: Project ID is required", None, 400)
        
        if not str(project_id).isdigit():
            return Response(False, "Deleting Project Failed: Invalid project ID", None, 400)
        
        project = ProjectRepository.get_by_id(project_id)
        if not project:
            return Response(False, "Deleting Project Failed: Project not found", None, 404)
        
        success, error = ProjectRepository.delete_project(project_id)
        
        if success:
            return Response(True, None, None, 200)
        else:
            return Response(False, f"Deleting Project Failed: {error}", None, 500)