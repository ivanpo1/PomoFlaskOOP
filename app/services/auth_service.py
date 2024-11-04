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
        new_user = User(username=username, hash=hashed_password)
        success, error = UserRepository.save(new_user)
        if success:
            return Response(True, None, new_user, 201)
        else:
            return Response(False, f'Failed to Register: {error}', None, 500)

    
    @staticmethod
    def login_user(username, password):
        user = UserRepository.find_by_username(username)
        if not user or not check_password_hash(user.hash, password):
            return Response(False, "Invalid username and/or password", None, 401)

        return Response(True, None, {"user_id": user.id, "username": user.username}, 200)
    
    @staticmethod
    def change_password(user, current_password, new_password):
        if not check_password_hash(user.hash, current_password):
            return Response(False, "Current password incorrect", None, 401)

        user.hash = generate_password_hash(new_password)
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