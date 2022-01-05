import axios from 'axios'
import {history} from "./history";

const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000/api/blog',
    withCredentials: true,
});

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response.status === 401){
            history.push('/login')
        }
        return Promise.reject(error);
    });

export const setAuthHeaders = (token) => {
    instance.defaults.headers.common['Authorization'] = 'Bearer ' + token
};

export const API = instance;