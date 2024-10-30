import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///testdb.db")
    SECRET_KEY = os.getenv("SECRET_KEY", "chimichurri")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Optional logging or debugging options
    # SQLALCHEMY_ECHO = True