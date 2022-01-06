import React, {useContext, useEffect} from 'react';
import {Menu, message} from "antd";
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
            const user = await API.get(`/auth/email/${getEmail()}`)
            setUser(user.data);
        }
        loadData();
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
        history.push('/');
        logout();
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