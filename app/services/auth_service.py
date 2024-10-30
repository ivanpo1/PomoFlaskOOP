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