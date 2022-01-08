import React, {createElement, useContext, useEffect, useState} from "react";
import {useLocation} from "react-router";
import moment from "moment";
import {Row, Col, Divider, Typography, List, Comment, Form, Button, message, Tooltip, Tag} from 'antd';
import {DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled} from '@ant-design/icons';
import {ClockCircleOutlined, CommentOutlined, UserOutlined} from '@ant-design/icons';
import {displayGrvatar, UserContext} from "../../services/user";
import {Logged} from "../../views/Logged";
import {NotLogged} from "../../views/NotLogged";
import TextArea from "antd/es/input/TextArea";
import {API} from "../../services/api";
import './layout.css'
import {tagColor} from "../../services/gradient";
import Cookies from "js-cookie";

const {Title, Paragraph} = Typography;

export const Post = () => {

    const {user} = useContext(UserContext)

    const post = useLocation().state.post;
    const date = moment(useLocation().state.post.date)

    // comment
    const [value, setValue] = useState('')
    const [comments, setComments] = useState()
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [action, setAction] = useState(null);

    useEffect(() => {
        async function loadData() {
            const comments = await API.get(`/post/comment/get`, {
                params: {post_id: post.id.$oid}
            })
            setComments(comments.data)
        }

        loadData().then(/* do nothing */);
    }, [post.id.$oid])

    const handleSubmit = () => {
        if (value !== "") {
            API.post(`/post/comment`, {
                post_id: post.id.$oid,
                body: value,
            }).then(() => {
                setValue("")
                window.location.reload(false)
                }
            ).catch((errInfo) => {
                message.error(errInfo);
            })
        }
    }

    const like = () => {
        setLikes(1);
        setDislikes(0);
        setAction('liked');
    };

    const dislike = () => {
        setLikes(0);
        setDislikes(1);
        setAction('disliked');
    };

    const actions = [
        <Tooltip key="comment-basic-like" title="Like">
      <span onClick={like}>
        {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
          <span className="comment-action">{likes}</span>
      </span>
        </Tooltip>,
        <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={dislike}>
        {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined)}
          <span className="comment-action">{dislikes}</span>
      </span>
        </Tooltip>,
    ];

    const content = () => {
        return (
            <div className="post-container">
                <Row justify="center" align="middle">
                    <Col span={2}>
                        {/*{displayAvatar(post.author.avatar_url, 20)}{" "}*/}
                        <UserOutlined style={{color: '#bbbbbb'}}/>{' '}
                        {post.author.username}
                    </Col>
                    <Divider type="vertical"/>
                    <Col span={2}>
                        <CommentOutlined span={2} style={{color: '#bbbbbb'}}/>{' '}
                        {Object.keys(post.comments).length}
                    </Col>
                    <Col span={4}>
                        <ClockCircleOutlined style={{color: '#bbbbbb'}}/>{' '}
                        {date.format('YYYY-MM-DD HH:mm:ss')}
                    </Col>
                </Row>
                <Divider orientation="left" style={{color: '#bbbbbb'}}>Title</Divider>
                <Title>
                    {post.title}
                </Title>
                <Divider orientation="left" style={{color: '#bbbbbb'}}>Content</Divider>
                {post.tags !== [] && post.tags !== undefined &&
                // console.log(props.tags)
                <div style={{marginTop: "30px", marginBottom: "30px"}}>
                    {post.tags.map((tag) => (
                        <Tag
                            key={tag}
                            color={tagColor({tag})}
                            // color={tagsColors[Math.floor(Math.random() * tagsColors.length)]}
                        >
                            # {tag}
                        </Tag>
                    ))}
                </div>
                }
                <Paragraph>
                    <div dangerouslySetInnerHTML={{__html: post.body}}/>
                </Paragraph>
            </div>
        )
    }

    if (Cookies.get('is_logged') !== 'True' || !Cookies.get('is_logged')) {
        return (
            <NotLogged>
                {content()}
                {comments !== undefined && comments.length !== 0 &&
                <div className="post-container">
                    {comments.comments.length > 0 &&
                    <div className="comment-section">
                        <span style={{fontWeight: "bold"}}> COMMENTS </span>
                        <CommentList comments={comments.comments} actions={actions}/>
                    </div>
                    }
                </div>
                }
            </NotLogged>
        )
    } else {
        return (
            <Logged>
                {content()}
                {comments !== undefined &&
                <div className="post-container">
                    <div className="comment-section">
                        <span style={{fontWeight: "bold"}}> COMMENTS </span>
                        {comments.length !== 0 && comments.comments.length > 0 &&
                        <CommentList comments={comments.comments} actions={actions}/>
                        }
                    </div>
                    <Comment
                        className={"new-comment"}
                        avatar={
                            displayGrvatar(user.avatar_url)
                        }
                        content={
                            <Editor
                                onChange={e => setValue(e.target.value)}
                                onSubmit={handleSubmit}
                                // submitting={submitting}
                                setState={setValue}
                                value={value}
                            />
                        }
                    />
                </div>
                }
            </Logged>
        )
    }
}

const CommentList = ({comments}) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={comment => {
            return (
                <Comment
                    // actions={actions}
                    content={comment.body}
                    author={comment.user.username}
                    avatar={comment.user.avatar_url}
                    datetime={moment(comment.createdAt.$date).fromNow()}
                />
            )
        }
        }
    />
);

const Editor = ({setState, onSubmit, submitting, value}) => (
    <>
        <Form.Item>
            <TextArea
                rows={2}
                onChange={e => setState(e.target.value)}
                value={value}
            />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </>
);