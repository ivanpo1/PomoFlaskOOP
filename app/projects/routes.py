from flask import Blueprint, request, jsonify, session
from app.models import Project
from app.services import ProjectService
from sqlalchemy.orm import joinedload

projects_bp = Blueprint('projects', __name__, url_prefix='/projects')

@projects_bp.route("/add", methods=["POST"])
def add_project():
    # Add project logic here
    pass

@projects_bp.route("/delete/<project_id>", methods=["DELETE"])
def delete_project(project_id):
    # Delete project logic here
    pass

@projects_bp.route("/<int:project_id>", methods=["GET"])
def get_project(project_id):
    projectData = ProjectService.get_project_by_id(project_id)
    return projectData.data

@projects_bp.route('/api/project_data')
def get_project_data():
    # projects = Project.query.all()
    projects = Project.query.options(joinedload(Project.tasks)).all()
    return jsonify([project.to_dict() for project in projects])

