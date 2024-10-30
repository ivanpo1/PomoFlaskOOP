from app.models import User
from app.repositories import UserRepository

class UserService:
    @staticmethod
    def add_user(user_data):
        # Validation logic here
        user = User(name=user_data['name'])
        UserRepository.add(user)
        return user.to_dict()