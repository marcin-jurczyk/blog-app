import bcrypt
from flask import Response, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash

from model.user import User

#snyk.io
#https na awsie, flaga secure
def get_user_id(email):
    user = User.objects(email=email).first()
    if user is not None:
        return user.id
    else:
        return Response(f'No user found with email: {email}', status=404)


# system logow
# rate limiting
# def login_service(email, password):
#     user = User.objects(email=email).first()
#
#     if user is not None:
#         if bcrypt.checkpw(password.encode('utf8'), user.password.encode('utf8')):
#         # if check_password_hash(user.password, str(password)):
#             access_token = create_access_token(identity=email)
#             return jsonify({
#                 # http only
#                 'Bearer token': access_token
#             })
#         else:
#             return Response("Password is incorrect", status=401)
#     else:
#         return Response("No user found with email: " + email, status=404)

def login_service(email, password):
    import datetime
    user = User.objects(email=email).first()

    if user is not None:
        if bcrypt.checkpw(password.encode('utf8'), user.password.encode('utf8')):
            # if check_password_hash(user.password, str(password)):
            access_token = create_access_token(identity=email)
            res = jsonify({
                # http only
                'Bearer token': access_token
            })
            expire_date = datetime.datetime.now()
            expire_date = expire_date + datetime.timedelta(days=90)
            res.set_cookie("login_hash", value=access_token, httponly=True, expires=expire_date)
            res.set_cookie("isLogged", value="True", httponly=False, expires=expire_date)

            return res
        else:
            return Response("Password is incorrect", status=401)
    else:
        return Response("No user found with email: " + email, status=404)

# walidacja danych DTO
# def sign_up_service(email, username, password):
#     user_email = User.objects(email=email).first()
#     user_username = User.objects(username=username).first()
#     if user_email or user_username:
#         return Response("User already exist...", status=409)
#     else:
#         # bcrypt, argon2
#         hash_pass = generate_password_hash(password, method='sha256')
#         new_user = User(email=email, username=username, password=hash_pass)
#         new_user.save()
#         return jsonify(new_user.get_user_info())

# pobrac plik z haslami i sprawdzac
def sign_up_service(email, username, password):
    user_email = User.objects(email=email).first()
    user_username = User.objects(username=username).first()
    if user_email is None and user_username is None:
        # bcrypt, argon2
        password_validation: dict = password_check(password)
        if password_validation["password_ok"]:
            salt = bcrypt.gensalt()
            pw_hash = bcrypt.hashpw(password.encode('utf-8'), salt)
            print(pw_hash)
            # hash_pass = generate_password_hash(password, method='sha256')
            new_user = User(email=email, username=username, password=pw_hash)
            new_user.save()
            return jsonify(new_user.get_user_info())
        else:
            password_validation.pop("password_ok")
            for key, value in password_validation.items():
                if value:
                    return Response("Password is not valid. Please check {}.".format(key), status=422)
    else:
        return Response("User already exist...", status=409)


def get_user_info_service(value, option):
    if option == 'USERNAME':
        user = User.objects(username=value).first()
    elif option == 'EMAIL':
        user = User.objects(email=value).first()
    else:
        user = None

    if user is not None:
        return user.get_user_info()
    else:
        return Response("User not found...", status=404)


def change_password_service(current_password, new_password):
    # get currently logged user
    user = User.objects(email=get_jwt_identity()).first()

    if bcrypt.checkpw(current_password.encode('utf8'), user.password.encode('utf8')):
        if current_password != new_password:
            salt = bcrypt.gensalt()
            pw_hash = bcrypt.hashpw(new_password.encode('utf-8'), salt)
            user.set_password_hash(pw_hash.decode())
            user.save()
            return Response("Password changed successfully!", status=200)
        else:
            return Response("Password cannot match!", status=403)
    else:
        return Response("Wrong password!", status=403)


def change_username_service(current_username, new_username):
    # get currently logged user
    user = User.objects(email=get_jwt_identity()).first()

    # check if user is logged in
    if user.username != current_username:
        return Response("Username does not match!", status=403)
    else:
        if current_username == new_username:
            return Response("Your new username must not match current!", status=409)
        elif User.objects(username=new_username).first() is None:
            user.username = new_username
            user.save()
            return jsonify(user)
        else:
            return Response(f"User with username: \"{new_username}\" already exists", status=409)


def change_email_service(old_email, new_email):
    # get currently logged user
    user = User.objects(email=get_jwt_identity()).first()

    # check if user is logged in
    if old_email != user.email:
        return Response("E-mail does not match!", status=403)
    else:
        if old_email == new_email:
            Response("Your new username must not match current", status=409)
        elif User.objects(email=new_email).first() is None:
            user.email = new_email
            user.save()
            return jsonify(user)
        else:
            return Response(f"User with email: \"{new_email}\" already exists", status=409)


def password_check(password):
    """
    Verify the strength of 'password'
    Returns a dict indicating the wrong criteria
    A password is considered strong if:
        8 characters length or more
        1 digit or more
        1 symbol or more
        1 uppercase letter or more
        1 lowercase letter or more
    """

    import re

    # calculating the length
    length_error = len(password) < 8

    # searching for digits
    digit_error = re.search(r"\d", password) is None

    # searching for uppercase
    uppercase_error = re.search(r"[A-Z]", password) is None

    # searching for lowercase
    lowercase_error = re.search(r"[a-z]", password) is None

    # searching for symbols
    symbol_error = re.search(r"[ !#$%&'()*+,-./[\\\]^_`{|}~;" + r'"]', password) is None

    # overall result
    password_ok = not (length_error or digit_error or uppercase_error or lowercase_error or symbol_error)

    return {
        'password_ok': password_ok,
        'length': length_error,
        'digit': digit_error,
        'uppercase': uppercase_error,
        'lowercase': lowercase_error,
        'symbol': symbol_error,
    }
