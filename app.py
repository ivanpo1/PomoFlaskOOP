from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///testdb.db"
    app.config["SECRET_KEY"] = "chimichurri"
    db.init_app(app)

    # @app.after_request
    # def after_request(response):
    #     """Ensure responses aren't cached"""
    #     response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    #     response.headers["Expires"] = 0
    #     response.headers["Pragma"] = "no-cache"
    #     return response

    from routes import register_routes
    register_routes(app, db)

    migrate = Migrate(app, db)

    return app