import React, {useEffect, useRef, useState} from 'react'
import {NotLogged} from "../../views/NotLogged";
import {Logged} from "../../views/Logged";
import {PostShort} from "./PostShort/PostShort";
import {API} from "../../services/api";
import {List, Spin} from "antd";
import './layout.css'
import qs from 'qs'
import {Input} from 'antd';
import {SearchOutlined} from "@ant-design/icons";

export const Home = () => {

    const postsAmount = 10;
    const [search, setSearch] = useState(null)
    const [searchType, setSearchType] = useState("by_date")
    const [postsRequest, setPostsRequest] = useState({
        postsLoaded: 0,
        posts: []
    });
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const loader = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {threshold: 0});
        if (loader.current) {
            observer.observe(loader.current)
        }
    }, []);

    // console.log('before', 'page', page, 'loading', loading, 'searchType', searchType, 'search', search)

    useEffect(() => {
        if (page !== 0) {
            API.get(`/post/last/${postsAmount}/${postsRequest.postsLoaded}`, {
                params: {
                    searchType: searchType,
                    search: search
                },
                paramsSerializer: params => {
                    return qs.stringify(qs.parse(params), {arrayFormat: 'comma', encode: false})
                }
            })
                .then((response) => {
                    if (page !== 0) {
                        if (loading === true) {
                            let newPosts = postsRequest.posts
                            Array.prototype.push.apply(newPosts, response.data);
                            setPostsRequest({
                                postsLoaded: postsRequest.postsLoaded + Object.keys(response.data).length,
                                posts: newPosts,
                            })
                        }
                        if (Object.keys(response.data).length < 10) {
                            setLoading(false)
                        } else setLoading(true)
                    }
                })
                .catch(errInfo => console.error(errInfo))
        }
    }, [page, searchType, search])

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting) {
            setPage((page) => page + 1)
        }
    }

    const onSearch = value => {
        if (value === "") {
            setSearchType("by_date")
            setSearch(null)
            setPage(1)
        } else {
            setSearchType("by_tags")
            setSearch(value)
            setPage(0)
        }
        setPostsRequest({
                postsLoaded: 0,
                posts: []
            }
        )
        setLoading(true)
    }

    const handleTagClick = (value) => {
        searchRef.current.state.value = value
        onSearch(value)
    }

    const content = () => {
        return (
            <div>
                <div className="post-list">
                    <Input.Search
                        // value={search}
                        // onChange={e => setSearch(e.target.value)}
                        ref={searchRef}
                        placeholder="# tags..."
                        allowClear
                        bordered={false}
                        size={"large"}
                        onSearch={onSearch}
                        style={{ width: "250px", margin: "1% 3%"}}
                    />
                    <List
                        dataSource={postsRequest.posts}
                        locale={{emptyText: " "}}
                        renderItem={post => (
                            <PostShort
                                id={post._id}
                                title={post.title}
                                date={post.createdAt.$date}
                                body={post.body}
                                author={post.author_info}
                                comments={post.comments}
                                tags={post.tags}
                                type={"home"}
                                onTagClick={handleTagClick}
                            />
                        )}
                    />
                    {loading === true ?
                        <div className="loading" ref={loader}>
                            <Spin size="large" className="loader-antd"/>
                        </div>
                        :
                        postsRequest.postsLoaded === 0 ?
                            <div className="loading"> No Post found </div>
                            :
                            <div className="loading"> All posts loaded </div>
                    }
                </div>
            </div>
        )
    }

    if (localStorage.token === 'undefined' || !localStorage.token) {
        return (
            <NotLogged>
                {content()}
            </NotLogged>
        )
    } else {
        return (
            <Logged>
                {content()}
            </Logged>
        )
    }
}