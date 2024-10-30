from functools import wraps
from flask import redirect, session, jsonify
from collections import namedtuple


# def convert_millis_to_min_sec(milliseconds):
#     seconds = milliseconds // 1000
#     minutes, seconds = divmod(seconds, 60)
#     return f"{minutes} minutes and {seconds} seconds"

# def get_current_project():
#     selected_project = request.form.get('project_selection')
#     current_project = Project.query.filter_by(name=selected_project).first()
#     return current_project


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


Response = namedtuple('Response', ['success', 'error', 'data', 'code'])
"""
Attributes:
    success (bool): Indicates if the operation was successful.
    error (str or None): Error message if the operation failed.
    data (any or None): Data payload if the operation was successful.
    code (int): HTTP status code of the response.
"""

def create_response(response):
    response_dict = {
        "success": response.success,
        "error": response.error,
        "data": response.data,
    }
    return jsonify(response_dict), response.code