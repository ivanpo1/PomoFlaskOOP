from . import db
from sqlalchemy import DateTime, func

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
    
    def to_dict(self):
        return {"id": self.id, "username": self.username, "created_at": self.created_at}