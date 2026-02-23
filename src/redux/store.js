import { legacy_createStore, combineReducers } from "redux";
import customerReducer from "./customerReducer.js";
import dataReducer from "./dataReducer.js";
import adminReducer from "./adminReducer.js";

const rootReducer = combineReducers({
  customer: customerReducer,
  data: dataReducer,
  admin: adminReducer,
});

export const store = legacy_createStore(rootReducer);
