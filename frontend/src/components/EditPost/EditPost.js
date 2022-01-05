import React, {useContext, useMemo, useRef, useState} from 'react'
import {Logged} from "../../views/Logged";
import JoditEditor from "jodit-react";
import SuccessAnimation from 'actually-accessible-react-success-animation'

import './layout.css'
import {API} from "../../services/api";
import {Button, Divider, Form, Input, message} from "antd";
import {useHistory} from "react-router-dom";
import {useLocation} from "react-router";
import {AddTag} from "../AddPost/AddTag/AddTag";
import {TagsContext} from "../../services/tags";


export const EditPost = () => {

    const editor = useRef(null)
    const original_post = useLocation().state.post
    const {tags} = useContext(TagsContext)

    const history = useHistory();

    const [textAreaValue, setTextAreaValue] = useState(original_post.body)

    const config = {
        readonly: false, // all options from https://xdsoft.net/jodit/doc/
        minHeight: 500,
        toolbar: true,
        placeholder: ""
    }

    const editPost = values => {
        API.put('/post/edit', {
            post_id: original_post.id.$oid,
            title: values.title,
            body: textAreaValue,
            tags: tags
        })
            .then((() => {
                message.success("Post edited successfully!");
                history.push('/profile', {activeKey: "2"})
            }))
            .catch((errInfo) => {
                // if (error.response.status)
                message.error(errInfo.response.data);
            })
    }

    const handleTextAreaChange = newTextAreaValue => {
        console.log('handleTextAreaChange', newTextAreaValue)
        return (
            setTextAreaValue(() => newTextAreaValue)
        )
    }

    return (
        <Logged>
            <div className="add-new-post-container">
                <Form
                    name="add-new-post"
                    className="add-new-post"
                    initialValues={{remember: true}}
                    onFinish={editPost}
                >
                    <Divider orientation="left">Title:</Divider>
                    <Form.Item
                        name="title"
                        initialValue={original_post.title}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your title!',
                            },
                        ]}
                    >
                        <Input className="title-input" placeholder="Type in your title here..."/>
                    </Form.Item>
                    <Divider orientation="left">Content:</Divider>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Please input body!',
                            },
                        ]}
                    >
                        {useMemo(() => (
                                <JoditEditor
                                    editor={editor}
                                    config={config}
                                    onChange={handleTextAreaChange}
                                    value={textAreaValue}/>
                            ), [] )
                        }
                    </Form.Item>
                    <Divider orientation="left">Tags:</Divider>
                    <Form.Item>
                        {
                            <AddTag tags={original_post.tags}/>
                        }
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block="true" className="add-new-post-button">
                            Edit post
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Logged>
    )
}