import { combineReducers } from "redux";

import { loginReducer } from "./user";
import { modalReducer } from "./modal";

export default combineReducers({
    user: loginReducer,
    modal: modalReducer
});