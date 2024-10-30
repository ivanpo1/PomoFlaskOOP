from app.models import db

class DatabaseHandler:
    @staticmethod
    def commit():
        try:
            db.session.commit()
            return True, None
        except Exception as e:
            db.session.rollback()
            return False, str(e)

    @staticmethod
    def add(item):
        try:
            db.session.add(item)
            db.session.commit()
            return True, None
        except Exception as e:
            db.session.rollback()
            return False, str(e)

    @staticmethod
    def delete(item):
        try:
            db.session.delete(item)
            db.session.commit()
            return True, None
        except Exception as e:
            db.session.rollback()
            return False, str(e)
    
    @staticmethod
    def rollback():
        db.session.rollback()