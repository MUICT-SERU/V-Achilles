import { combineReducers } from "redux";
import authReducer from "./auth/reducer";

const allReducer = combineReducers({ authReducer });

export default allReducer;
