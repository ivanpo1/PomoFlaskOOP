from app import db
from sqlalchemy import ForeignKey, DateTime, func
from datetime import datetime, timezone

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, nullable=False)
    hash = db.Column(db.Text, nullable=False)
    pomodoros = db.Column(db.Integer, default=0)
    time = db.Column(db.Integer, default=0)
    created_at = db.Column(DateTime, default=func.now())

    # Relationship with Projects: One User can have Many Projects
    projects = db.relationship('Project', backref='user', lazy='dynamic')

    def __repr__(self):
        return f'User: {self.username}'


class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    time = db.Column(db.Integer, default=0)
    complete = db.Column(db.Boolean, default=False)
    pomodoros = db.Column(db.Integer, default=0)

    # Dates
    created_at = db.Column(DateTime, default=func.now())
    completed_at = db.Column(DateTime)

    # Relationship with User: Many Projects belong to One User (Foreign Key)
    user_id = db.Column(db.Integer, ForeignKey('users.id'))

    # Relationship with Tasks: One Project can have Many Tasks
    tasks = db.relationship('Task', backref='project', lazy='dynamic')

    def __repr__(self):
        return f'Project: {self.name}'

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}




class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    time = db.Column(db.Integer, default=0)
    complete = db.Column(db.Boolean, default=False)
    pomodoros = db.Column(db.Integer, default=0)

    # Dates
    created_at = db.Column(DateTime, default=func.now())
    completed_at = db.Column(DateTime)

    # Relationship with Project: Many Tasks belong to One Project (Foreign Key)
    project_id = db.Column(db.Integer, ForeignKey('projects.id'))

    def __repr__(self):
        return f'Task: {self.name}' 
    
    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}    