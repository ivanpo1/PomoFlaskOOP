from flask import Flask
from .auth import auth_bp
from .tasks import tasks_bp
from .projects import projects_bp
from .models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(projects_bp)

    return app