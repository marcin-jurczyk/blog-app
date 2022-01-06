import React from 'react';
import {Menu} from "antd";
import {HomeOutlined} from "@ant-design/icons"

import './layout.css'
import {Link} from "react-router-dom";

export const NavBarNotLogged = () => {
    return (
        <Menu
            className="menu"
            theme="light"
            mode="horizontal"
        >
            <Menu.Item key="home" className={"home-page"} icon={<HomeOutlined />}>
                <Link to="home">Home Page</Link>
            </Menu.Item>
            <Menu.Item key="sign-up" className={"sign-up"} style={{ marginLeft: 'auto' }}>
                <Link to="sign-up">Sign-up</Link>
            </Menu.Item>
            <Menu.Item key="login" className={"login"} style={{ marginLeft: '0' }}>
                <Link to="login">Login</Link>
            </Menu.Item>
        </Menu>
    );
};
