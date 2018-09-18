import { LOGIN,LOGOUT } from '../constants';

const initialState = {
    authenticated: false
}

export const loginReducer = (state=false,action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...action.user,
                authenticated: action.authenticated
            };
        case LOGOUT:
            return {
                ...action.user,
                authenticated: action.authenticated
            };
    
        default:
            return state;
    }
}