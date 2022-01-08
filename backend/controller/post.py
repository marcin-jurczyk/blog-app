from datetime import timezone, timedelta

from bson import json_util
from flask import Blueprint, request
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt, create_access_token, set_access_cookies

from app import TOKEN_TIME
from service.post import *

post = Blueprint('post', __name__)


@post.after_request
def credentials(response):
    header = response.headers
    header['Access-Control-Allow-Credentials'] = 'true'
    header['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    return response


# @post.after_request
# @jwt_required()
# def refresh_expiring_jwts_posts(response):
#     try:
#         exp_timestamp = get_jwt()["exp"]
#         now = datetime.now(timezone.utc)
#         target_timestamp = datetime.timestamp(now + timedelta(minutes=TOKEN_TIME/2))
#         if target_timestamp > exp_timestamp:
#             print("refreshing token")
#             access_token = create_access_token(identity=get_jwt_identity())
#             set_access_cookies(response, access_token)
#         return response
#     except (RuntimeError, KeyError):
#         print("error")
#         response.set_cookie("is_logged", value="False", httponly=False)
#         return response


@post.route('/new', methods=['POST'])
@jwt_required()
@cross_origin()
def new_post():
    data = request.get_json()
    title = data['title']
    body = data['body']
    tags = data['tags']
    return add_new_post_service(title, body, tags)


@post.route('/get', methods=['GET'])
@jwt_required()
@cross_origin()
def get_post():
    data = request.get_json()
    post_id = data['post_id']
    return get_post_service(post_id)


@post.route('/edit', methods=['PUT'])
@jwt_required()
@cross_origin()
def edit_post():
    data = request.get_json()
    post_id = data['post_id']
    title = data['title']
    body = data['body']
    tags = data['tags']
    return edit_post_service(post_id, title, body, tags)


@post.route('/delete', methods=['DELETE'])
@jwt_required()
@cross_origin()
def delete_post():
    data = request.get_json()
    title = data['title']
    response = delete_post_service(title)
    return response


@post.route('/all', methods=['GET'])
def all_posts():
    return jsonify(get_all_posts_service())


@post.route('/user/<username>', methods=['GET'])
@cross_origin()
def get_user_posts(username):
    return Response(
        json_util.dumps(get_user_posts_service(username)),
        mimetype='application/json'
    )


@post.route('/author', methods=['GET'])
def get_post_author():
    query_parameters = request.args
    author_id = query_parameters.get('id')
    response = jsonify(get_post_author_service(author_id))
    return response


@post.route('/tags', methods=['GET'])
def get_post_by_tags():
    data = request.get_json()
    tags = data['tags']
    response = jsonify(get_posts_by_tags_service(tags))
    return response


@post.route('/last/<number>/<offset>', methods=['GET'])
@cross_origin()
def load_posts_with_offset(number, offset):
    query_parameters = request.args
    search_type = query_parameters.get('searchType')
    search = query_parameters.get('search').split(", ")
    return Response(
        json_util.dumps(load_posts_with_offset_service(number, offset, search_type, search)),
        mimetype='application/json'
    )
    # return json_util.dumps(load_posts_with_offset_service(number, offset))
    # return jsonify(load_posts_with_offset_service(number, offset))


@post.route('/comment', methods=['POST'])
@jwt_required()
@cross_origin()
def add_new_comment():
    data = request.get_json()
    post_id = data['post_id']
    comment_body = data['body']
    response = add_new_comment_service(post_id, comment_body)
    return response


@post.route('/comment/get', methods=['GET'])
@cross_origin()
def get_post_comments():
    post_id = request.args.get('post_id')
    return get_post_comments_service(post_id)


@post.route('/fake', methods=['POST'])
@jwt_required()
@cross_origin()
def get_fake_post():
    from faker import Faker
    from mdgen import MarkdownPostProvider
    from random import randint
    import markdown as m

    fake = Faker()
    fake.add_provider(MarkdownPostProvider)
    tags_num = randint(0, 9)

    title = fake.sentence()
    body = m.markdown(fake.post(size='medium'))
    tags = fake.words(nb=tags_num, unique=True)

    return add_new_post_service(title, body, tags)
