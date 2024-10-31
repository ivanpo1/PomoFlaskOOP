from app.models import User
from app.repositories import UserRepository
from app.utils.helpers import Response

class UserService:
    @staticmethod
    def add_user(user_data):
        # Validation logic here
        user = User(name=user_data['name'])
        UserRepository.add(user)
        return user.to_dict()
    
    @staticmethod
    def get_user_by_id(user_id):
        if not user_id:
            return Response(False, "Retrieving User Failed: Invalid User ID", None, 400)
        
        user = UserRepository.get_by_id(user_id)
        if not user:
            return Response(False, "Retrieving User Failed: User not found", None, 404)
        
        return Response(True, None, user.to_dict(), 200)
    