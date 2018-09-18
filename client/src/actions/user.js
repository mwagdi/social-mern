import axios from 'axios';

import { LOGIN,LOGGING_IN,LOGOUT } from '../constants';

export const login = (email,password) => {
    return dispatch => {
        axios.post('api/users/login',{ email,password })
        .then(response => {
            const { token,expires_in } = response.data;
            axios.defaults.headers["Authorization"] = `Bearer ${token}`;
            localStorage.setItem('token',token);
            if(localStorage.getItem('remember')){
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
            }
            localStorage.setItem('expires_in',expires_in);
            localStorage.setItem('expiry_time',(Date.now() + expires_in));
            dispatch({
                type: LOGGING_IN,
            });
            axios.get('api/users/current')
            .then(res => {
                dispatch({
                    type: LOGIN,
                    user: res.data,
                    authenticated: true
                })
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
}

export const autLogin = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        axios.defaults.headers["Authorization"] = `Bearer ${token}`;
        axios.get('api/users/current')
            .then(reponse => {
                dispatch({
                    type: LOGIN,
                    user: reponse.data,
                    authenticated: true
                })
            })
            .catch(err => console.log(err));
    }
}

export const logout = () => {
    return dispatch => {
        delete axios.defaults.headers["Authorization"];
        localStorage.removeItem('token');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('expiry_time');
        dispatch({
            type: LOGOUT,
            user: {},
            authenticated: false
        })
    }
}