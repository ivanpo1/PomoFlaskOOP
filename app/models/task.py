from . import db
from sqlalchemy import ForeignKey, DateTime, func

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