from models import User

class UserRepository:
    @staticmethod
    def get_by_id(task_id):
        return User.query.filter_by(id=task_id).first()