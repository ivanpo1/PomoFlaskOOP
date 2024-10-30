from flask import Blueprint, request, redirect, render_template, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
from app.models import db

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    session.clear()

    if request.method == "POST":

        username = request.form.get("username")

        username_exist = User.query.filter_by(username=username).first()

        if username_exist:
            return f"Username already exist"

        if not username:
            return f"Must provide username"

        elif not request.form.get("password"):
            return f"Must provide password"

        elif not request.form.get("confirmation") == request.form.get("password"):
            return f"Passwords don't match each other"

        hash = generate_password_hash(request.form.get("password"), method='pbkdf2', salt_length=16)

        new_user = User(username=username, hash=hash)
        db.session.add(new_user)
        db.session.commit()

        flash("Registered!")
        return redirect("/")

    return render_template("register.html")

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    session.clear()

    if request.method == "POST":

        if not request.form.get("username"):
            return f"must provide username"

        elif not request.form.get("password"):
            return f"must provide password"

        username = request.form.get("username")
        user = User.query.filter_by(username=username).first()
        # print(user)
        # print(user.id)

        if not user or not check_password_hash(
            user.hash, request.form.get("password")
        ):
            return f"Invalid username and/or password"

        session["user_id"] = user.id
        session["logged_as"] = f"Logged as {user.username}"
        flash("Logged in!")

        return redirect("/")

    else:
        return render_template("login.html")

@auth_bp.route("/logout")
def logout():
    
    session.clear()

    return redirect("/")