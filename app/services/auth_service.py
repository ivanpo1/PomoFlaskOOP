from app.repositories import UserRepository
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
from app.utils.helpers import Response

class AuthService:
    @staticmethod
    def register_user(username, password):
        existing_user = UserRepository.find_by_username(username)
        if existing_user:
            return Response(False, "Username already exist", None, 409)
        
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password_hash=hashed_password)
        UserRepository.save(new_user)
        return Response(True, None, new_user, 201)
    
    @staticmethod
    def change_password(user, current_password, new_password):
        if not check_password_hash(user.password_hash, current_password):
            return Response(False, "Current password incorrect", None, 401)

        user.password_hash = generate_password_hash(new_password)
        UserRepository.save(user)
        return Response(True, "Password changed successfully", None, 200)


    @staticmethod
    def generate_token(user):
        pass

    @staticmethod
    def verify_token(token):
        pass
        
    @staticmethod
    def reset_password_request(email):
        pass

    @staticmethod
    def reset_password(token, new_password):
        pass   