from models import User
from repositories import UserRepository

class UserService:
    @staticmethod
    def add_user(user_data):
        # Validation logic here
        user = User(name=user_data['name'])
        UserRepository.save(user)
        return user.to_dict()