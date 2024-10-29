from flask import Blueprint, request, jsonify
from app.models import Task
from app.services import TaskService
from app.utils import create_response

tasks_bp = Blueprint('tasks', __name__, url_prefix='/tasks')

@tasks_bp.route("/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.json
    response = TaskService.update_task(task_id, data)
    return create_response(response)

@tasks_bp.route("/add/<task_name>/<project_id>", methods=["POST"])
def add_task(task_name, project_id):
    response = TaskService.add_task(task_name, project_id)
    return create_response(response)

@tasks_bp.route("/delete/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    response = TaskService.delete_task(task_id)
    return create_response(response)