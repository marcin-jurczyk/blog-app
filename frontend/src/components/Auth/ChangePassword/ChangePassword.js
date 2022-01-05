import {Button, Form, Input, message} from "antd";
import {API, setAuthHeaders} from "../../../services/api";
import {useHistory} from "react-router";
import {logout} from "../../../services/user";

export const ChangePassword = () => {

    const history = useHistory()

    const onFinish = values => {
        API.patch("/auth/change/password", {
            current_password: values.current_password,
            new_password: values.new_password
        }).then(() => {
            message.success("Password changed successfully! Please log in again.", 7)
            logout()
            history.push("/login")
        }).catch(() => {
            message.error("Wrong password!")
        })
    }

    return (
        <div style={{width: "500px"}}>
            <Form
                name="changePassword"
                onFinish={onFinish}
                labelCol={{span: 8}}
                wrapperCol={{span: 20}}
            >
                <Form.Item
                    className='form-item'
                    name="current_password"
                    label="Current Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your current password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    name="new_password"
                    label="New Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input new password!',
                        },
                        ({getFieldValue}) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('current_password') !== value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item style={{textAlign: "center"}}>
                    <Button type="primary" htmlType="submit" shape="round">
                        Change password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )

}