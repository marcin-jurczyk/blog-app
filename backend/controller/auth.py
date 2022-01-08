from datetime import timezone, timedelta
from flask import Blueprint, request
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_header, get_jwt, set_access_cookies
from app import limiter
from controller.post import post
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
    # header['Access-Control-Expose-Headers'] = 'Retry-After'
    # header['Access-Control-Allow-Methods'] = '*'
    # header['Access-Control-Allow-Headers'] = "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    return response


@auth.after_request
def refresh_expiring_jwts_auth(response):
    try:
        if request.path != "/api/blog/auth/login":
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now(timezone.utc)
            target_timestamp = datetime.timestamp(now + timedelta(minutes=TOKEN_TIME/2))
            if target_timestamp > exp_timestamp:
                print("refreshing token")
                access_token = create_access_token(identity=get_jwt_identity())
                set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        response.set_cookie("is_logged", value="False", httponly=False)
        return response


@auth.route('/login', methods=['POST'])
@cross_origin()
@limiter.limit("5/minute")
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    return login_service(email, password)


@auth.errorhandler(429)
def ratelimit_handler(e):
    return make_response(e.description), 429, {'Access-Control-Expose-Headers': 'Date, Retry-After'}


@auth.route('/logout', methods=['POST'])
@cross_origin()
def logout():
    return logout_service()


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


@auth.route('/get_user', methods=['GET'])
@jwt_required()
@cross_origin()
def get_user():
    # print(request.headers)
    return get_user_service()


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
    """
    jwt example:
    {
        "csrf": "41f7d7cd-83ec-42e5-87e8-05647a97d62d",
        "exp": 1641576859,
        "fresh": false,
        "iat": 1641576739,
        "jti": "1da1af3d-398f-4dff-a980-01c6eae8242c",
        "nbf": 1641576739,
        "sub": "qwertyuiop@mail.com",
        "type": "access"
    }
    """
    jwt = get_jwt()
    # jwt = get_jwt_identity()
    print(jwt)
    return jsonify(jwt)


# test method
@auth.route('/secret', methods=['GET'])
@jwt_required()
def secret():
    return {"message": "access granted"}