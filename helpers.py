from functools import wraps
from flask import redirect, session

def convert_millis_to_min_sec(milliseconds):
    seconds = milliseconds // 1000
    minutes, seconds = divmod(seconds, 60)
    return f"{minutes} minutes and {seconds} seconds"

def get_current_project():
    selected_project = request.form.get('project_selection')
    current_project = Project.query.filter_by(name=selected_project).first()
    return current_project


def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/latest/patterns/viewdecorators/
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function