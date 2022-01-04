from datetime import timezone, timedelta
from flask import Blueprint, request
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_header, get_jwt, set_access_cookies
from app import limiter
from service.auth import *
from service.post import *

auth = Blueprint('auth', __name__)


# odpowiednie naglowki
# Xframe
@auth.after_request
def credentials(response):
    header = response.headers
    header['Access-Control-Allow-Credentials'] = 'true'
    header['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    return response


# Using an `after_request` callback, we refresh any token that is within 30
# minutes of expiring. Change the timedeltas to match the needs of your application.
@auth.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response


@auth.route('/login', methods=['POST'])
@cross_origin()
@limiter.limit("5/minute")
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    return login_service(email, password)


@auth.route('/get_cookie', methods=['GET'])
@cross_origin()
def get_cookie():
    return request.cookies.get('isLogged')



@auth.route('/test', methods=['GET'])
@cross_origin()
def test():
    return 1 / 0


@auth.route('/sign-up', methods=['POST'])
@cross_origin()
def sign_up():
    data = request.get_json()
    email = data['email']
    username = data['username']
    password = data['password']
    return sign_up_service(email, username, password)


@auth.route('/username/<username>', methods=['GET'])
@jwt_required()
@cross_origin()
def get_user_by_username(username):
    return get_user_info_service(username, 'USERNAME')


@auth.route('/email/<email>', methods=['GET'])
@jwt_required()
@cross_origin()
def get_user_by_email(email):
    return get_user_info_service(email, 'EMAIL')


@auth.route('/change/password', methods=['PATCH'])
@jwt_required()
@cross_origin()
def change_password():
    data = request.get_json()
    current_password = data['current_password']
    new_password = data['new_password']
    return change_password_service(current_password, new_password)


@auth.route('/change/username', methods=['PATCH'])
@jwt_required()
@cross_origin()
def change_username():
    data = request.get_json()
    current_username = data['current_username']
    new_username = data['new_username']
    return change_username_service(current_username, new_username)


@auth.route('/change/email', methods=['PATCH'])
@jwt_required()
@cross_origin()
def change_email():
    data = request.get_json()
    current_email = data['current_email']
    new_email = data['new_email']
    return change_email_service(current_email, new_email)


@auth.route('/check/jwt', methods=['GET'])
@jwt_required()
def check_jwt():
    jwt = get_jwt_identity()
    print(jwt)
    return jsonify(jwt)


# test method
@auth.route('/secret', methods=['GET'])
@jwt_required()
def secret():
    return {"message": "access granted"}