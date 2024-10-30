from . import db
from sqlalchemy import ForeignKey, DateTime, func

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
    tasks = db.relationship('Task', backref='project')

    def __repr__(self):
        return f'Project: {self.name} {[task.id for task in self.tasks]} {self.tasks}'

    def to_dict(self):
        project_dict = {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
        project_dict['tasks'] = [task.to_dict() for task in self.tasks]

        return project_dict