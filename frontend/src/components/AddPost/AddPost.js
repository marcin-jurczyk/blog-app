import React, {useContext, useRef, useState} from 'react'
import {Logged} from "../../views/Logged";
import JoditEditor from "jodit-react";
import SuccessAnimation from 'actually-accessible-react-success-animation'

import './layout.css'
import {API} from "../../services/api";
import {Button, Divider, Form, Input, message} from "antd";
import {useHistory} from "react-router-dom";
import {AddTag} from "./AddTag/AddTag";
import {TagsContext} from "../../services/tags";



export const AddPost = () => {
    const history = useHistory();

    const {tags} = useContext(TagsContext)
    const [content] = useState('')
    const editor = useRef(null)
    const config = {
        readonly: false, // all options from https://xdsoft.net/jodit/doc/
        minHeight: 500,
        placeholder: "Type in your content here..."
    }

    console.log(tags)

    const animation = () => {
        return (
            <SuccessAnimation
                text="PostShort added successfully!"
                color="#fd74f8"
            />
        )
    }

    const addNewPost = values => {
        API.post('/post/new', {
            title: values.title,
            body: values.body,
            tags: tags
        })
            .then((() => {
                message.success("Post added successfully!");
                history.push('/home')
                animation()
            }))
            .catch((errInfo) => {
                // if (error.response.status)
                message.error(`Wrong username or password`).then();
                console.log(errInfo)
            })
    }


    return (
        <Logged>
            <div className="add-new-post-container">
                <Form
                    name="add-new-post"
                    className="add-new-post"
                    initialValues={{remember: true}}
                    onFinish={addNewPost}
                >
                    <Divider orientation="left">Title:</Divider>
                    <Form.Item
                        name="title"
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
                        name="body"
                        rules={[
                            {
                                required: true,
                                message: 'Please input body!',
                            },
                        ]}
                    >
                        <JoditEditor
                            ref={editor}
                            value={content}
                            config={config}
                            // tabIndex={1}
                            // onBlur={newContent => setContent(newContent)}
                            // onChange={newContent => {}}
                        />
                    </Form.Item>
                    <Divider orientation="left">Tags:</Divider>
                    <Form.Item>
                        <AddTag tags={[]} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block="true" className="add-new-post-button">
                            Add post
                        </Button>
                    </Form.Item>
                </Form>
                {/*<div className="perform-action">*/}
                {/*    <button className="add-post-button">*/}
                {/*        Cancel*/}
                {/*    </button>*/}
                {/*    <button className="add-post-button">*/}
                {/*        Cancel*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
        </Logged>
    )

}