import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App.jsx";
import { store } from "./redux/store.js";
import { BACKEND_TYPE, BACKEND_CONFIG } from "./config/backend";

console.log(`backend type: ${BACKEND_TYPE}`);
if (BACKEND_TYPE === "firebase") {
  // Try to get projectId from firebase config
  let projectId = undefined;
  try {
    // firebaseConfig is not exported, so fallback to known projectId
    projectId =
      import.meta.env.VITE_USE_TEST_DB === "true"
        ? "e-commerc-test"
        : "react55-final-project-ran";
  } catch (e) {
    projectId = "unknown";
  }
  // eslint-disable-next-line no-console
  console.log(`[BACKEND] Using Firebase backend. Project: ${projectId}`);
} else {
  // eslint-disable-next-line no-console
  console.log(
    `[BACKEND] Using REST backend. Mongo URL: ${BACKEND_CONFIG.rest.baseUrl}`,
  );
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </Provider>,
);
