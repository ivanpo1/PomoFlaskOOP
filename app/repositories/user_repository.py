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
    
    @staticmethod
    def get_all(filters=None):
        query = User.query
        if filters:
            query = query.filter_by(**filters)
        return query.all()
    
    @staticmethod
    def update_user(user, data):
        for key, value in data.items():
            setattr(user, key, value)
        DatabaseHandler.commit()