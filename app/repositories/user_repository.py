from app.models import User
from app.utils.helpers import DatabaseHandler

class UserRepository:
    @staticmethod
    def add(user):
        return DatabaseHandler.add(user)
    
    @staticmethod
    def get_by_id(task_id):
        return User.query.filter_by(id=task_id).first()
    
    @staticmethod
    def find_by_username(username):
        return User.query.filter_by(username=username).first()