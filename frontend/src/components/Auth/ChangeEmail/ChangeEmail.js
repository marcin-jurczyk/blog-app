import {Button, Form, Input, message} from "antd";
import {API} from "../../../services/api";
import {useHistory} from "react-router";
import {logout} from "../../../services/user";

export const ChangeEmail = () => {

    const history = useHistory()

    const onFinish = values => {
        API.patch("/auth/change/email", {
            current_email: values.current_email,
            new_email: values.new_email
        }).then(() => {
            message.success("Email changed successfully! Please log in again.", 7)
            logout()
            history.push("/login")
        }).catch((errInfo) => {
            message.error(errInfo.response.data)
        })
    }

    return (
        <div style={{width: "500px"}}>
            <Form
                name="changeEmail"
                onFinish={onFinish}
                labelCol={{span: 7}}
                wrapperCol={{span: 20}}
            >
                <Form.Item
                    className='form-item'
                    name="current_email"
                    label="Current e-mail"
                    rules={[
                        {
                            required: true,
                            type: "email",
                            message: 'The input is not valid e-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your current e-mail!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="new_email"
                    label="New e-mail"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            type: "email",
                            message: 'The input is not valid e-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input new email!',
                        },
                        ({getFieldValue}) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('current_email') !== value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('New e-mail cannot match current!');
                            },
                        }),
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item style={{textAlign: "center"}}>
                    <Button type="primary" htmlType="submit" shape="round">
                        Change e-mail
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}