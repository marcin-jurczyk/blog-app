from bson import ObjectId


def load_post_with_offset_pipeline():
    return [
        {
            "$lookup": {
                "from": "user",
                "localField": "author",
                "foreignField": "_id",
                "as": "author_info"
            }
        },
        {
            "$unwind": "$author_info",
        },
        {
            "$unset": ["author_info.password", "author_info.createdAt"]
        }
    ]


def load_posts_for_user(user_id):
    return [
        {
            "$match": {
                "author": user_id,
            }
        },
        {
            "$project": {
                "title": 1,
                "body": 1,
                "tags": 1,
                "createdAt": 1,
                "comments": {
                    "$cond": {
                        "if": {"$isArray": "$comments"},
                        "then": {"$size": "$comments"}, "else": "NA"
                    }
                },
                "modified": 1,
                "lastModifiedAt": 1
            }
        }
    ]


def get_post_comments_pipeline(post_id):
    return [
        {
            "$match": {
                "_id": ObjectId(post_id),
                "comments": {"$ne": []}
            }
        },
        {
            "$lookup":
                {
                    "from": "user",
                    "localField": "comments.user",
                    "foreignField": "_id",
                    "as": "user"
                }
        },
        {
            "$project": {
                "comments": 1,
                "user": {
                    "$map": {
                        "input": "$user",
                        "as": "u",
                        "in": {
                            "_id": "$$u._id",
                            "username": "$$u.username",
                            "avatar_url": "$$u.avatar_url"
                        }
                    }
                }
            }
        },
        {
            "$project": {
                "comments": {
                    "$map": {
                        "input": "$comments",
                        "as": "com",
                        "in": {
                            "user": {
                                "$arrayElemAt": [
                                    {
                                        "$filter": {
                                            "input": "$user",
                                            "as": "u",
                                            "cond": {
                                                "$eq": [
                                                    "$$u._id",
                                                    "$$com.user"
                                                ]
                                            }
                                        }
                                    },
                                    0
                                ]
                            },
                            "body": "$$com.body",
                            "createdAt": "$$com.createAt"
                        }
                    }
                }
            }
        },
        {
            "$project": {
                "comments": 1,
                "_id": 0
            }
        }
    ]
