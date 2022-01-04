from flask import Flask
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager
from flask_avatars import Avatars
import logging
from flask_limiter import Limiter, HEADERS
from flask_limiter.util import get_remote_address

db = MongoEngine()
jwt = JWTManager()
avatars = Avatars()
limiter = Limiter(key_func=get_remote_address, default_limits=["200 per day", "50 per hour"])
limiter.header_mapping = {
    HEADERS.LIMIT: "X-My-Limit",
    HEADERS.RESET: "X-My-Reset",
    HEADERS.REMAINING: "X-My-Remaining"
}


def create_app():
    app = Flask(__name__)
    app.config.update(
        MONGODB_SETTINGS={
            'db': 'blog',
            'host': 'localhost',
            'port': 27017
        },
        SECRET_KEY='90a3c5d6adad54fde2b0f37d72d82cc739184e42f1c78cad'
    )
    # app.config['CORS_EXPOSE_HEADERS'] = 'hash'

    file_handler = logging.FileHandler('output.log')
    file_handler.setLevel(logging.WARNING)
    app.logger.setLevel(logging.DEBUG)
    app.logger.addHandler(file_handler)

    logging.basicConfig(filename='error.log', level=logging.ERROR)

    db.init_app(app)
    jwt.init_app(app)
    avatars.init_app(app)
    limiter.init_app(app)

    from controller.post import post
    from controller.auth import auth

    app.register_blueprint(post, url_prefix='/api/blog/post')
    app.register_blueprint(auth, url_prefix='/api/blog/auth')

    return app

#
# def configure_logging(app):
#
#     file_handler = logging.FileHandler('error_logs.txt')
#     file_handler.setLevel(logging.WARNING)
#     app.logger.addHandler(file_handler)

    # LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    # handler = logging.FileHandler('out.log')
    # handler.setFormatter(logging.Formatter(LOG_FORMAT))
    # logger = logging.getLogger(__name__)
    # logger.setLevel(logging.INFO)
    # del logger.handlers[:]
    # logger.addHandler(handler)

    # logging.basicConfig(filename='error.log', level=logging.DEBUG)
    #
    # from logging import FileHandler, Formatter
    #
    # file_handler = FileHandler('output.log')
    # handler = logging.StreamHandler()
    # file_handler.setLevel(logging.DEBUG)
    # handler.setLevel(logging.DEBUG)
    # file_handler.setFormatter(Formatter(
    #     '%(asctime)s %(levelname)s: %(message)s '
    #     '[in %(pathname)s:%(lineno)d]'
    # ))
    # handler.setFormatter(Formatter(
    #     '%(asctime)s %(levelname)s: %(message)s '
    #     '[in %(pathname)s:%(lineno)d]'
    # ))
    # app.logger.addHandler(handler)
    # app.logger.addHandler(file_handler)
    # app.logger.error('first test message...')
    #
    # file_handler = FileHandler('error_logs.txt')
    # file_handler.setLevel(logging.WARNING)
    # app.logger.addHandler(file_handler)
