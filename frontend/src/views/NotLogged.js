import React from 'react'
import {Layout} from "antd";
import {NavBarNotLogged} from "../components/NavBar/NavBarNotLogged";

import './layout.css'

const {Header, Content, Footer} = Layout

export const NotLogged = ({children}) => {

    return (
        <Layout style={{ minHeight:"100vh" }} >
            <Header className="header">
                <NavBarNotLogged/>
            </Header>
            <Layout>
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