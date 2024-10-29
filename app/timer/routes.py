from flask import Blueprint, render_template, session
from app.models import Task, Project

timer_bp = Blueprint('timer', __name__, url_prefix='/timer')

@timer_bp.route("/", methods=["GET", "POST"])
def timer():
    # Timer page logic here
    pass

@timer_bp.route("/set_current_task/<string:task_name>", methods=["GET"])
def set_current_task(task_name):
    # Set current task logic here
    pass