import { legacy_createStore, combineReducers } from "redux";
import customerReducer from "./customerReducer.js";
import dataReducer from "./dataReducer.js";
import adminReducer from "./adminReducer.js";

const rootReducer = combineReducers({
  customer: customerReducer,
  data: dataReducer,
  admin: adminReducer,
});

const resettableRootReducer = (state, action) => {
  if (action.type === "RESET_STORE") state = undefined;
  return rootReducer(state, action);
};

export const store = legacy_createStore(resettableRootReducer);
