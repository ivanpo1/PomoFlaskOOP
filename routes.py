from flask import render_template, request, flash, redirect, url_for, session, jsonify
from helpers import convert_millis_to_min_sec, get_current_project, login_required
import json
from models import User, Project, Task
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy import func
from sqlalchemy.orm import joinedload



def register_routes(app, db):


    @app.route("/")
    def index():
        return render_template("index.html")
    

    @login_required
    @app.route("/timer", methods=['GET', 'POST'])
    def timer():
        try:
            current_project_id = session['current_project_id']
            current_project = Project.query.filter_by(id=current_project_id).first()
            # print(f"Current project {current_project}")
            # print(f"Current project id {current_project_id}")
            tasks = Task.query.filter_by(project_id=current_project.id).all()

            has_complete_task = False
            for task in tasks:
                if task.complete == True:
                    has_complete_task = True
                    break

            projects = [{"name": project.name, "id": project.id} for project in Project.query.all()]  # Create a list of project dictionaries
            return render_template("timer.html", tasks=tasks, projects=projects, has_complete_task=has_complete_task)
        except Exception as e:
            print(f"An error occurred: {e}")
            projects = [{"name": project.name, "id": project.id} for project in Project.query.all()]  # Create a list of project dictionaries      
            # tasks = Task.query.filter_by(project_id=current_project.id).all()
            return render_template("timer.html", projects=projects)

    @login_required
    @app.route("/add_project", methods=['GET', 'POST'])
    def add_project():

        # Take name of inputted Project

        project_added = request.form.get('add_project')
        project = Project.query.filter_by(name=project_added).first()
        
        # Check if project name already exist

        if project:
            projects = Project.query.all()
            return render_template("timer.html", projects=projects, tasks=tasks, project_exists=True)
        
        # Create project on Database

        else:
            project = Project(name=project_added, user_id=session["user_id"], complete=False)
            db.session.add(project)
            db.session.commit()
            session['current_project_id'] = project.id
            projects = Project.query.all()
            tasks = Task.query.filter(Task.project_id == project.id)
            # probamos = request.form.get('project_selection')
            return render_template("timer.html", projects=projects, tasks=tasks, project_exists=False)

    @app.route('/api/task/<int:task_id>', methods=['PUT'])
    def update_task(task_id):
        # Get the JSON data from the request
        data = request.json  
        
        # Retrieve the task by its ID
        task = Task.query.get(task_id)
        
        if task:
            task.name = data.get('name', task.name)  # Use current value if not provided
            task.time = data.get('time', task.time)
            task.complete = data.get('complete', task.complete)
            task.pomodoros = data.get('pomodoros', task.pomodoros)
            task.completed_at = data.get('completed_at', task.completed_at)
            
            # Commit the changes to the database
            db.session.commit()
            
            return jsonify({"message": "Task updated successfully."}), 200
        else:
            return jsonify({"error": "Task not found."}), 404

    @login_required
    @app.route("/add_task/<task_name>/<project_id>", methods=['POST'])
    def add_task(task_name, project_id):
        if request.method == 'POST':
            # Check if task_name is empty
            if not task_name:
                return jsonify({'error': 'Adding Task Failed: Task name is required'}), 400
            
            # Find the project by project_id
            current_project = Project.query.filter_by(id=project_id).first()
            
            # Check if the project exists
            if not current_project:
                return jsonify({'error': 'Project not found'}), 404

            # Create new task
            task = Task(name=task_name, project_id=current_project.id, complete=False)
            
            db.session.add(task)
            db.session.commit()

            task = task.to_dict()  # Convert task to dictionary

            if task:
                # Successfully created the task
                return jsonify(task), 201
            else:
                # Something went wrong when converting or committing
                return jsonify({'error': 'Adding Task Failed'}), 500


    @login_required
    @app.route("/delete_task/<task_id>", methods=["DELETE"])
    def delete_task(task_id):
        try:
            task = Task.query.get(task_id)
            if not task:
                return jsonify({'success': False, 'message': f'Task {task_id} not found'}), 404
            db.session.delete(task)
            db.session.commit()
            return jsonify({'success': True, 'message': f'Task {task_id} deleted successfully'})
        except Exception as e:
            return jsonify({'success': False, 'message': 'Error deleting task', 'error': str(e)}), 500
    

    @login_required
    @app.route("/delete_project/<project_id>", methods=["DELETE"])
    def delete_project(project_id):
        try:
            project = Project.query.get(project_id)
            if not project:
                return jsonify({'success': False, 'message': f'Project {project_id} not found'}), 404
            
            # Manually delete associated tasks
            Task.query.filter_by(project_id=project_id).delete()
            
            db.session.delete(project)
            db.session.commit()
            
            return jsonify({'success': True, 'message': f'Project {project_id} and its tasks deleted successfully'})
        except Exception as e:
            return jsonify({'success': False, 'message': 'Error deleting project', 'error': str(e)}), 500




    @login_required
    @app.route("/set_current_task/<string:task_name>", methods=['GET'])
    def set_current_task(task_name):
        session['current_task_name'] = task_name
        
        return redirect(url_for('timer'))

    
    @app.route('/set_flash')
    def set_flash():
        flash("This is a temporary flash message!")
        return redirect(url_for('index'))


    # @app.route('/set_current_project/<int:project_id>', methods=['GET'])
    # @login_required
    # def set_current_project(project_id):
    #     session['current_project_id'] = project_id
    #     return jsonify({'success': True, 'message': 'Current project set successfully'})
    
    

    @app.route('/api/projects/<int:project_id>', methods=['GET'])
    def get_project(project_id):
        project = Project.query.get(project_id)
        session['current_project_id'] = project_id

        total_task_time = db.session.query(func.sum(Task.time)).filter(Task.project_id == project_id).scalar()
        completed_tasks_count = db.session.query(func.count(Task.id)).filter(Task.project_id == project_id, Task.complete == True).scalar()
        incomplete_tasks_count = db.session.query(func.count(Task.id)).filter(Task.project_id == project_id, Task.complete == False).scalar()
        
        # print(f"finished_task: {completed_tasks_count}")       
        # print(f"unfinished_task: {incomplete_tasks_count}")

        project.time = total_task_time or 0
        db.session.commit()

        tasks = Task.query.filter_by(project_id=project_id).all()
        project = project.to_dict()
        project['completed_tasks'] = completed_tasks_count
        project['incomplete_tasks'] = incomplete_tasks_count
        project['tasks'] = [task.to_dict() for task in tasks]

        # print(f"project to dict: {project}")
        if project:
            return jsonify(project)  # Use the to_dict method
        else:
            return jsonify({'error': 'Project not found'}), 404

    @app.route('/complete/task/<int:task_id>')
    def complete_task(task_id):
        task = Task.query.get(task_id)
        if task:
            task.complete = True
            db.session.commit()

            return jsonify({'success': True, 'message': f'Task {task_id} completed successfully'})
        
        return jsonify({'error': 'Task not found'}), 404

    @app.route('/uncomplete/task/<int:task_id>')
    def uncomplete_task(task_id):
        task = Task.query.get(task_id)
        if task:
            task.complete = False
            db.session.commit()

            return jsonify({'success': True, 'message': f'Task {task_id} set as incompleted successfully'})
        
        return jsonify({'error': 'Task not found'}), 404

    @app.route('/api/tasks/<int:task_id>', methods=['GET'])
    def get_task(task_id):
        task = Task.query.get(task_id)
        # session['current_project_id'] = task_id
        # jsonifyson = task.to_dict()
        # print(f"Task jsonify: {jsonifyson}")
        if task:
            return jsonify(task.to_dict())  # Use the to_dict method
        else:
            return jsonify({'error': 'Project not found'}), 404

    
        
    @app.route("/register", methods=["GET", "POST"])
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
    

    @app.route("/login", methods=["GET", "POST"])
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
        
    
    @app.route("/logout")
    def logout():

        session.clear()

        return redirect("/")
    
    @app.route('/api/project_data')
    def get_project_data():
        # projects = Project.query.all()
        projects = Project.query.options(joinedload(Project.tasks)).all()
        return jsonify([project.to_dict() for project in projects])
    
    @app.route('/api/task_data')
    def get_task_data():
        tasks = Task.query.all()
        return jsonify([task.to_dict() for task in tasks])
    
    
    @app.route('/chart')
    def chart():
        return render_template("chart.html")

    
    @app.route('/save_time', methods=['POST'])
    def save_time():
        data_pomo = request.get_json()
        elapsed_time = data_pomo['time']
        date = data_pomo['date']
        project_id = data_pomo['project_id']
        task_id = data_pomo['task_id']

        project_to_update = Project.query.filter_by(id=project_id).first()
        task_to_update = Task.query.filter_by(id=task_id).first()
        
        if project_to_update:  # Check if a project with the name exists
            current_time = int(project_to_update.time) if project_to_update.time else 0
            additional_time = int(elapsed_time) if elapsed_time else 0
            project_to_update.time = current_time + additional_time
            db.session.commit()

        if task_to_update:
            if task_to_update.time:
                current_time = task_to_update.time
            else:
                current_time = 0
            additional_time = int(elapsed_time) if elapsed_time else 0
            # print(f"task_to_update: current_time = {current_time} - elapsed_time = {additional_time}")
            task_to_update.time = current_time + additional_time
            db.session.commit()


        else:
        # Handle the case where no project with the name is found
            print("Project not found!")  # Or raise an exception

        # print(elapsed_time, task_to_update, project_to_update)
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}