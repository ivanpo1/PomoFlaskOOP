from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User  # Assuming you have user, task, and project models
from .task import Task
from .project import Project

__all__ = ["User", "Task", "Project"]