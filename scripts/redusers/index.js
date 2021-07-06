import { combineReducers } from "redux";

import users from "./users";
import countries from "./countries.js";

const rootReducer = combineReducers({ users, countries });

export default rootReducer;
