import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import firebaseConfig from "./firebaseConfig";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./Store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
