import React from 'react'
import {Layout} from "antd";
import {NavBarLogged} from "../components/NavBar/NavBarLogged";

import './layout.css'

const {Header, Content, Footer} = Layout

export const Logged = ({children}) => {

    return (
        <Layout style={{ minHeight:"100vh"}}>
            <Header className="header">
                <NavBarLogged/>
            </Header>
            <Layout className="layout-content">
                <Content className="content" >
                    {children}
                </Content>
            </Layout>
            <Footer className="footer">
                Blog Service @2021 - 2022 Created By Marcin Jurczyk
            </Footer>
        </Layout>
    );
};