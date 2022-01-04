from datetime import datetime

from mongoengine import StringField

from app import db
from model.user import User


class Post(db.Document):
    """Post collection with its comments"""
    meta = {'collection': 'post'}
    title = db.StringField(required=True)
    body = db.StringField()
    author = db.ReferenceField(User)
    comments = db.ListField()
    tags = db.ListField(StringField(), default=list)
    createdAt = db.DateTimeField(default=datetime.utcnow)
    modified = db.BooleanField(default=False)
    lastModifiedAt = db.DateTimeField(default=datetime.utcnow)

    def update_last_modified(self):
        if not self.modified:
            self.modified = True
        self.lastModifiedAt = datetime.utcnow

    def get_author(self):
        return self.author

    def to_json(self):
        data = self.to_mongo()
        data["author"] = {
            "username": self.author.username,
            "avatar_url": self.author.avatar_url
        }
        return data


