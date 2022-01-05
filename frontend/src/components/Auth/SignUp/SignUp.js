import React from "react";
import {API} from "../../../services/api";
import {useHistory} from "react-router-dom";
import {Button, Form, Input, message} from "antd";
import {NotLogged} from "../../../views/NotLogged";

import './layout.css'
import {registerFormLayout} from "./layout";
import {login} from "../../../services/user";
import {wave} from "../../../services/wave";

const color1 = '#d719ec'
const color2 = '#6200a8'

export const SignUp = () => {
    const history = useHistory();

    const onFinish = values => {
        API.post('/auth/sign-up', values)
            .then((_response => {
                API.post('/auth/login', {
                    email: values.email,
                    password: values.password,
                }).then((response => {
                        login(response.data['Bearer token']);
                        message.success(`User ${_response.data.username} created successfully!`)
                        history.push('/home');
                    }))
            }))
            .catch(() => {
                message.error(`Cannot register the user: ` + values.email.toString());
            })
    };

    return (
        <NotLogged>
            <div className="register-container" >
                <div className="form-title">
                    Sign-up
                </div>
                <Form
                    name="sign-up"
                    onFinish={onFinish}
                    {...registerFormLayout}
                >
                    <Form.Item
                        className='form-item'
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                required: true,
                                type: "email",
                                message: 'The input is not valid e-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your e-mail!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        className='form-item'
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        className="form-item"
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({getFieldValue}) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The two passwords that you entered do not match!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item
                        className='form-item'
                        name="username"
                        label="Username"
                        rules={[
                            {
                                required: true,
                                message: 'The input is not valid Username!',
                            },
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item className='button-item'>
                        <Button type="primary" htmlType="submit" className="sign-up-form-button">
                            Sign-up
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            {wave(color1, color2, "35%")}
        </NotLogged>
    )
}