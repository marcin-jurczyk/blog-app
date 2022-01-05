import React, {useMemo, useState} from 'react'
import {Switch, Route} from 'react-router-dom'
import {Home} from "./components/Home/Home";
import {Login} from "./components/Auth/Login/Login";
import {SignUp} from "./components/Auth/SignUp/SignUp";
import {AddPost} from "./components/AddPost/AddPost";
import {UserContext, userModel} from "./services/user";
import {AuthRoute} from "./AuthRoute";
import {Profile} from "./components/Profile/Profile";
import {Post} from "./components/Post/Post";
import {EditPost} from "./components/EditPost/EditPost";
import {TagsContext} from "./services/tags";
import {AddTag} from "./components/AddPost/AddTag/AddTag";

export const Routing = () => {

    const [user, setUser] = useState(userModel)
    const value = useMemo(() => ({user, setUser}), [user, setUser])

    const [tags, setTags] = useState([])
    const tag = useMemo(() => ({tags, setTags}), [tags, setTags])

    return (
        <>
            <Switch>
                <UserContext.Provider value={value}>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <Route exact path="/home">
                        <Home/>
                    </Route>
                    <Route exact path="/post">
                        <Post/>
                    </Route>
                    <Route exact path="/sign-up">
                        <SignUp/>
                    </Route>
                    <Route exact path="/login">
                        <Login/>
                    </Route>
                    <TagsContext.Provider value={tag}>
                        <AddTag tags={[]} />
                        <AuthRoute>
                            <Route exact path="/add_post">
                                <AddPost/>
                            </Route>
                        </AuthRoute>
                        <AuthRoute>
                            <Route exact path="/edit-post">
                                <EditPost/>
                            </Route>
                        </AuthRoute>
                    </TagsContext.Provider>
                    <AuthRoute>
                        <Route exact path="/profile">
                            <Profile/>
                        </Route>
                    </AuthRoute>
                </UserContext.Provider>
            </Switch>
        </>
    )
}