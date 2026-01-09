import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { legacy_createStore, combineReducers } from "redux";
import customerReducer from "./redux/customerReducer.js";
import dataReducer from "./redux/dataReducer.js";
import adminReducer from "./redux/adminReducer.js";

import { Provider } from "react-redux";

const rootReducer = combineReducers({
  customer: customerReducer,
  data: dataReducer,
  admin: adminReducer,
});
const store = legacy_createStore(rootReducer);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </Provider>
);
