from flask import Blueprint, request, redirect, render_template, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
from app.models import db

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    # Registration logic here
    pass

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    # Login logic here
    pass

@auth_bp.route("/logout")
def logout():
    # Logout logic here
    pass