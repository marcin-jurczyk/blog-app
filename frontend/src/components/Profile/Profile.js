import React, {useContext, useEffect, useState} from 'react'
import {Logged} from "../../views/Logged";
import {displayGrvatar, UserContext} from "../../services/user";

import {Card, Collapse, Descriptions, List, Tabs} from 'antd';
import './layout.css'
import {API} from "../../services/api";
import {PostShort} from "../Home/PostShort/PostShort";
import {EditTwoTone} from "@ant-design/icons";
import {ChangePassword} from "../Auth/ChangePassword/ChangePassword";
import {ChangeUsername} from "../Auth/ChangeUsername/ChangeUsername";
import {ChangeEmail} from "../Auth/ChangeEmail/ChangeEmail";
import {useLocation} from "react-router";

export const Profile = () => {

    const {Panel} = Collapse;
    const {TabPane} = Tabs;

    const {user} = useContext(UserContext);
    const location = useLocation()
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        if (user.username !== null) {
            API.get(`/post/user/${user.username}`)
                .then((response) => {
                    setPosts(response.data)
                }).catch((errInfo) => {
                console.log(errInfo)
            })
        }
    }, [user])

    return (
        <Logged>
            <div className="tab">
                <Tabs
                    defaultActiveKey={location.state.activeKey}
                    centered={true}
                >
                    <TabPane tab="User info" key="1">
                        <div className="tab1">
                            <Card className="profile-card">
                                <div className="profile-avatar">
                                    {displayGrvatar(user.avatar_url, 250)}
                                </div>
                                <div className="profile-description">
                                    <Descriptions
                                        title="User Info"
                                        column={1}
                                        labelStyle={{fontSize: "15px"}}
                                        contentStyle={{fontWeight: "bold", fontSize: "15px"}}>
                                        <Descriptions.Item label="Username"> {user.username} </Descriptions.Item>
                                        <Descriptions.Item label="E-mail"> {user.email} </Descriptions.Item>
                                        {posts !== null &&
                                        <Descriptions.Item
                                            label="Posts amount"> {Object.keys(posts).length} </Descriptions.Item>
                                        }
                                    </Descriptions>
                                </div>
                            </Card>
                            <Collapse
                                bordered={false}
                                ghost
                                className="profile-collapse"
                            >
                                <Panel header={<><EditTwoTone /> Change password</>} key="1" className="custom-panel"
                                       showArrow={false}>
                                    <ChangePassword/>
                                </Panel>
                                <Panel header={<><EditTwoTone /> Change username</>} key="2" className="custom-panel"
                                       showArrow={false}>
                                    <ChangeUsername/>
                                </Panel>
                                <Panel header={<><EditTwoTone /> Change email</>} key="3" className="custom-panel"
                                       showArrow={false}>
                                    <ChangeEmail/>
                                </Panel>
                                <Panel header="" key="4" className="custom-panel-2"
                                       showArrow={false}>
                                </Panel>
                            </Collapse>
                        </div>
                    </TabPane>
                    <TabPane tab="Manage posts" key="2">
                        {posts !== null ?
                            <List
                                pagination={true}
                                style={{marginBottom: "1rem"}}
                                dataSource={posts}
                                renderItem={post => (
                                    <PostShort
                                        id={post._id}
                                        title={post.title}
                                        date={post.createdAt.$date}
                                        body={post.body}
                                        author={user}
                                        comments={post.comments}
                                        tags={post.tags}
                                        modified={post.modified}
                                        lastModifiedAt={post.lastModifiedAt.$date}
                                        type={"user"}
                                    />
                                )}
                            /> :
                            <div>
                                No post added yet
                            </div>
                        }
                    </TabPane>
                </Tabs>
            </div>
            {/*{textColorFromImage(user.username, user.avatar_url)}*/}
        </Logged>
    )
}