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
            <Menu.Item className={"home-page"}>
                <Link to="home"><HomeOutlined />Home Page</Link>
            </Menu.Item>
            <Menu.Item className={"login"}>
                <Link to="login">Login</Link>
            </Menu.Item>
            <Menu.Item className={"sign-up"}>
                <Link to="sign-up">Sign-up</Link>
            </Menu.Item>
        </Menu>
    );
};
