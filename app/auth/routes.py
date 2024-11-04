from flask import Blueprint, request, redirect, render_template, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User, db
from app.utils.helpers import create_response, login_required
from app.services import UserService
from app.services import AuthService


auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route("/register", methods=["GET"])
def register_form():
    return render_template("register.html")

@auth_bp.route("/register", methods=["POST"])
def register():
    session.clear()
    
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    print('register route data:username:password', data, username, password)

    response = AuthService.register_user(username, password)

    return create_response(response)

@auth_bp.route("/login", methods=["GET"])
def login_form():
    return render_template("login.html")

@auth_bp.route("/login", methods=["POST"])
def login():
    session.clear()

    data = request.get_json()
    print('@auth_bp.route: LOGIN', data)
    username = data.get("username")
    print('@auth_bp.route: username', username)
    password = data.get("password")
    print('@auth_bp.route: password', password)

    response = AuthService.login_user(username, password)
    print('AuthService.login_user(username, password)', response)

    if not response.success:
        return create_response(response)
    
    session["user_id"] = response.data["user_id"]
    session["logged_as"] = f"Logged as {response.data['username']}"
    flash("Logged in!")

    return create_response(response)

@auth_bp.route("/logout")
def logout():
    
    session.clear()

    return redirect("/")

@auth_bp.route('/change-password', methods=['POST'])
@login_required
def change_password():
    data = request.json
    user = UserService.get_user_by_id(session["user_id"])
    response = AuthService.change_password(user, data.get('current_password'), data.get('new_password'))
    return create_response(response)

