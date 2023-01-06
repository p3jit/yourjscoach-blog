import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import DarkModeContext from "./contexts/DarkModeContext";
import ModalContext from "./contexts/ModalContext";
import PostDataContext from "./contexts/PostDataContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PostDataContext>
        <DarkModeContext>
          <ModalContext>
            <App />
          </ModalContext>
        </DarkModeContext>
      </PostDataContext>
    </BrowserRouter>
  </React.StrictMode>
);
