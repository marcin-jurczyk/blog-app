from datetime import datetime
from mongoengine import EmbeddedDocument
from model.user import User
from app import db


class Comment(EmbeddedDocument):
    """Comment object embedded in Post collection"""
    body = db.StringField(required=True)
    user = db.ReferenceField(User)
    createAt = db.DateTimeField(default=datetime.utcnow)
    modified = db.BooleanField(default=False)
    lastModifiedAt = db.DateTimeField(default=datetime.utcnow)


    # def edit(self, new_body):
    #     if not self.modified:
    #         self.modified = True
    #     self.lastModifiedAt = datetime.utcnow
    #     self.body = new_body
