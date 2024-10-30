from flask import Flask
from app.auth import auth_bp
from app.tasks import tasks_bp
from app.projects import projects_bp
from app.models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(projects_bp)

    return app