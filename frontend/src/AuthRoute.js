import React from 'react'
import {Redirect, Route} from "react-router";
import Cookies from "js-cookie";

export const AuthRoute = ({children, ...rest}) => {

    const isLogged = Cookies.get('is_logged')
    if (!isLogged || isLogged !== 'True') return <Redirect to={`/login`}/>;

    return <Route {...rest}>{children}</Route>
};
