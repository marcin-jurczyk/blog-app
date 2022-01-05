import {Button, Form, Input, message} from "antd";
import {API, setAuthHeaders} from "../../../services/api";
import {useHistory} from "react-router";
import {logout} from "../../../services/user";

export const ChangeUsername= () => {

    const history = useHistory()

    const onFinish = values => {
        API.patch("/auth/change/username", {
            current_username: values.current_username,
            new_username: values.new_username
        }).then(() => {
            message.success("Username changed successfully! Please log in again.", 7)
            logout()
            history.push("/login")
        }).catch((errInfo) => {
            message.error(errInfo.response.data)
        })
    }

    return (
        <div style={{width: "500px"}}>
            <Form
                name="changeUsername"
                onFinish={onFinish}
                labelCol={{span: 8}}
                wrapperCol={{span: 20}}
            >
                <Form.Item
                    className='form-item'
                    name="current_username"
                    label="Current username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your current username!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="new_username"
                    label="New username"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input new username!',
                        },
                        ({getFieldValue}) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('current_username') !== value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Username that you entered cannot match current!');
                            },
                        }),
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item style={{textAlign: "center"}}>
                    <Button type="primary" htmlType="submit" shape="round">
                        Change Username
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )

}