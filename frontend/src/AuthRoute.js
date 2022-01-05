import React, {useContext} from 'react'
import {Redirect, Route} from "react-router";
import jwt_decode from "jwt-decode";
import {API} from "./services/api";
import {getEmail, UserContext} from "./services/user";

export const AuthRoute = ({children, ...rest}) => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined') return <Redirect to={`/login`}/>;

    // const userMail = getEmail()

    // API.get("auth/check/jwt").then(response =>{
    //     console.log('response', response)
    //     console.log('user', userMail)
    //     if (response === userMail) {
    //         localStorage.removeItem('token');
    //         return <Redirect to={`/`}/>;
    //     }
    //     return <Route {...rest}>{children}</Route>
    // } )

    const decoded = jwt_decode(token);
    const now = Date.now() / 1000;
    if (decoded.exp <= now) {
        localStorage.removeItem('token');
        // localStorage.removeItem('user');
        return <Redirect to={`/`}/>;
    }
    return <Route {...rest}>{children}</Route>
};
