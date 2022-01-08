import React, {useContext, useEffect} from 'react';
import {Button, Menu, message} from "antd";
import {Link, useHistory} from "react-router-dom";
import {getEmail, logout, UserContext} from "../../services/user";
import {HomeOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons"
import './layout.css'
import {API} from "../../services/api";
import SubMenu from "antd/es/menu/SubMenu";


export const NavBarLogged = () => {

    const history = useHistory();
    const {user, setUser} = useContext(UserContext)

    useEffect(() => {
        async function loadData() {
            const user = await API.get(`/auth/get_user`)
            setUser(user.data);
        }
        loadData().catch(errInfo => {
            if (errInfo.response.data['msg'] === "Missing cookie \"access_token_cookie\"")
                message.success("Logged out successfully!")
            else {
                message.error("Token expired!")
                history.push("/")
                window.location.reload()
            }

            console.log(errInfo.response)
        })
    }, [setUser])

    const getAvatar = () => {
        let url = user.avatar_url
        return (
            <img className="avatar-item" src={url} alt="avatar" style={{
                // border: "1px solid #999",
                borderRadius: 15,
                width: 30,
                height: 30
            }}/>
        )
    };

    const handleLogout = () => {
        logout();
        history.push('/');
    };

    const handleUserItem = () => {
        return (
            user.username ? (
                    <>
                        {user.username}
                        {' '}
                        {getAvatar()}
                    </>
                ) :
                <></>
        )
    }

    const handleProfile = () => {
        history.push('/profile', {activeKey: "1"});
    }

    const generateFakePost = () => {
        API.post("/post/fake").then(r => console.log(r))
        window.location.reload()
    }

    return (
        <Menu
            className="menu"
            theme="light"
            mode="horizontal"
        >
            <Menu.Item key={"home"} className={"home-page"} icon={<HomeOutlined />}>
                <Link to="home">Home Page</Link>
            </Menu.Item>
            <Menu.Item key={"add-post"} className={"add-post"}>
                <Link to="add_post">Add post</Link>
            </Menu.Item>
            <Menu.Item key={"add-fake-post"} className={"add-post"}>
                <Button onClick={generateFakePost}>Add fake post</Button>
            </Menu.Item>
            <SubMenu key={"submenu"} title={handleUserItem()} style={{ marginLeft: 'auto' }}>
                <Menu.Item key={"profile"} onClick={() => handleProfile()} >
                    <UserOutlined /> {"\t"} Profile
                </Menu.Item>
                <Menu.Item key={"logout"} onClick={() => handleLogout()} >
                    <LogoutOutlined /> {"\t"} Logout
                </Menu.Item>
            </SubMenu>
        </Menu>
    );
}

