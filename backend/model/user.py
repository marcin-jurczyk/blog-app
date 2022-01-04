from app import db, avatars
from flask_login import UserMixin
from datetime import datetime
import hashlib


def create_avatar_hash(email):
    return avatars.gravatar(hashlib.md5(email.lower().encode('utf-8')).hexdigest())


class User(db.Document, UserMixin):
    """User collection"""
    meta = {'collection': 'user'}
    email = db.EmailField(required=True, unique=True)
    username = db.StringField(required=True)
    password = db.StringField(required=True)
    avatar_url = db.StringField(default=create_avatar_hash(str(email)))
    createdAt = db.DateTimeField(default=datetime.utcnow)

    def get_user_info(self):
        user_object = {
            'id': str(self.id),
            'email': self.email,
            'username': self.username,
            'avatar_url': self.avatar_url,
            'createdAt': self.createdAt
        }
        return user_object

    def get_password_hash(self):
        return self.password

    def set_password_hash(self, new_password):
        self.password = new_password
