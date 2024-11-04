from app.models import User
from app.repositories import UserRepository
from app.utils.helpers import Response

class UserService:
    @staticmethod
    # def add_user(user_data):
    #     user = User(name=user_data['name'])
    #     UserRepository.save(user)
    #     return user.to_dict()
    
    @staticmethod
    def get_user_by_id(user_id):
        if not user_id:
            return Response(False, "Invalid User ID", None, 400)
        
        user = UserRepository.get_by_id(user_id)
        if not user:
            return Response(False, "User not found", None, 404)
        
        return Response(True, None, user.to_dict(), 200)
    
    @staticmethod
    def find_user_by_username(username):
        if not username:
            return Response(False, "Username is required", None, 400)
        
        user = UserRepository.find_by_username(username)
        if not user:
            return Response(False, "User not found", None, 404)
        
        return Response(True, None, user.to_dict(), 200)
    
    @staticmethod
    def get_all_users(filters=None):
        users = UserRepository.get_all(filters)
        user_list = [user.to_dict() for user in users]
        return Response(True, None, user_list, 200)
    
    @staticmethod
    def update_user(user_id, data):
        user = UserRepository.get_by_id(user_id)
        if not user:
            return Response(False, "User not found", None, 404)
        
        success, error  = UserRepository.update_user(user, data)
        if success:
            return Response(True, None, user.to_dict(), 200)
        else:
            Response(False, f"Error updating User: {error}", None, 500)