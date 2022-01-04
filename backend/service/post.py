import json
from datetime import datetime
from bson import json_util
from flask import Response, jsonify
from flask_jwt_extended import get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash

from model.comment import Comment
from model.post import Post
from model.user import User
from service.auth import get_user_id
from service.utils import get_post_comments_pipeline, load_post_with_offset_pipeline, load_posts_for_user


def add_new_post_service(title, body, tags=None):
    # cannot add two posts with the same title
    if Post.objects(title=title).first() is None:
        current_user = get_jwt_identity()
        new_post = Post(title=title, body=body, tags=tags, author=get_user_id(current_user))
        new_post.save()
        return jsonify(new_post)
    else:
        return Response("Post with that title already exist!", status=409)


def get_post_service(post_id):
    # get post by id
    post = Post.objects(id=post_id).first()
    if post is not None:
        return post
    else:
        return Response("Post not found!", status=404)


def edit_post_service(post_id, new_title, new_body, new_tags):
    # Find logged user
    current_user = get_user_id(get_jwt_identity())

    # Find a post
    post = Post.objects(id=post_id).first()

    # Find post author
    author = json.loads(json_util.dumps(post.to_mongo()))["author"]["$oid"]

    # Check if new title is repeated
    duplicated_post = Post.objects(title=new_title).first()
    if duplicated_post == post:
        duplicated_post = None

    if current_user is None:
        return Response("You have to log in first!", status=401)
    elif post is None:
        return Response("Cannot find post in database!", status=403)
    elif duplicated_post is not None:
        return Response(f"Post with title {new_title} already exists!", status=403)
    elif str(author) == str(current_user):
        post.title = new_title
        post.body = new_body
        post.tags = new_tags
        post.modified = True
        post.lastModifiedAt = datetime.utcnow
        post.save()
        return jsonify(post)
    else:
        return Response("Post cannot be updated!", status=409)


def get_user_posts_service(username):
    user = User.objects(username=username).first()
    if user:
        posts = Post.objects.order_by('-createdAt').aggregate(
            load_posts_for_user(user.id)
        )
        return posts
    else:
        return Response("User does not exist", 404)


def get_all_posts_service():
    posts = Post.objects().all()
    return posts


def get_post_author_service(author_id):
    author = Post.objects(author=author_id).first()
    return author


def get_posts_by_tags_service(tags):
    return Post.objects(tags__all=tags)


# to handle on_scroll function
def load_posts_with_offset_service(number, offset, search_type, search=None):
    start = int(offset)
    stop = int(number) + int(offset)

    # sort posts by created_at field from newest and
    # get posts depending on parameters:
    #   offset - how many post to skip from beginning
    #   number - how many post to return

    if search_type == "by_tags":
        posts = Post.objects(tags__all=search).order_by('-createdAt')[start:stop].aggregate(
            load_post_with_offset_pipeline()
        )
    else:
        posts = Post.objects.order_by('-createdAt')[start:stop].aggregate(
            load_post_with_offset_pipeline()
        )

    return posts


def add_new_comment_service(post_id, body):
    # Find logged user
    current_user = get_user_id(get_jwt_identity())

    # Find a post
    post = Post.objects(id=post_id).first()

    if post and current_user is not None:

        # Create a new comment
        comment = Comment(body=body, user=current_user)

        # Add to comments list and save
        post.comments.append(comment)
        post.save()

        return jsonify(comment)

    else:
        if post is None:
            return Response("Post does not exist", 404)
        if current_user is None:
            return Response("User does not exist", 404)


def get_post_comments_service(post_id):
    # check if post exists
    post_exist = Post.objects(id=post_id).first()

    if post_exist is None:
        return Response("Post _id is not valid", status=409)
    else:
        # perform aggregation
        post = Post.objects().aggregate(
            get_post_comments_pipeline(post_id)
        )

        # convert to json
        response = json.loads(json_util.dumps(post))

        if not response:
            # if response is empty then return empty array
            return jsonify([])
        else:
            # if response is not then return data (first element of array)
            return response[0]


def delete_post_service(title):
    # get currently logged user
    user = User.objects(email=get_jwt_identity()).first()

    # get post to delete
    post_to_delete = Post.objects(title=title).first()

    # check if post author matches logged user
    if post_to_delete.author == user:
        if post_to_delete:
            post_to_delete.delete()
            return Response("Post deleted successfully.", status=200)
        else:
            return Response(f"Post with title: \"{title}\" doesn't exist!", status=200)
    else:
        return Response(f"You cannot delete someone else's post", status=200)
