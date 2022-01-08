import React, {createContext} from 'react'
import {API, setAuthHeaders} from "./api";
import jwt_decode from 'jwt-decode'
import {Image, message} from "antd";
import Avatar from "antd/es/avatar/avatar";

export const UserContext = createContext(null);

export const userModel = {
    email: null,
    username: null,
    createdAt: null,
    avatar_url: null
}

export const loginAutomatically = () => {
    const token = localStorage.getItem('token');
    if (token === 'undefined') return false;
    if(!token) return false;

    const decoded = jwt_decode(token);
    const now = Date.now()/1000;
    if(decoded.exp > now){
        setAuthHeaders(token);
        return true;
    }

    return false;
};


export const login = (token) => {
    localStorage.setItem('token', token);
    setAuthHeaders(token);
};


export const logout = () => {
    API.post(`/auth/logout`)
        .then(response => {
            if (response['logout'] === 'True') {
                message.success("Logged out successfully!")
            }
        })
    // localStorage.removeItem('token');
    // setAuthHeaders(null);
    // window.location.reload();
};

export const get_logged_user = () => {
    API.get(`/auth/get_user`)
        .then(response => {return response.data})
        .catch(errInfo => {
            if (errInfo.response.data['msg'] === "Missing cookie \"access_token_cookie\"")
                message.success("Logged out successfully!")
            else
                message.error("Token expired!")
        })
}


export const getEmail = () => {
    const token = localStorage.getItem('token');
    if (token === 'undefined') return false;
    if (!token) return false;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64)).sub;
};

export const displayGrvatar = (url, size=30, border=0, br=size/2) => {
    let url_size = url
    if (url != null) {
        if (size >= 100) {
            url_size = url.replace(/s=100/, `s=${size}`)
        }
        return (
            <Avatar
                src={
                    <Image
                        src={url_size}
                        preview={false}
                        fallback={"load failed!"}
                    /> }
                shape={"circle"}
                size={size}
            />
            // <img src={url_size} alt="avatar" className="avatar" style={{
            //     borderRadius: br,
            //     borderColor: "#000",
            //     width: size,
            //     height: sizes
            // }}/>
        )
    }
}