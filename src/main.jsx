import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import DarkModeContext from "./contexts/DarkModeContext";
import ModalContext from "./contexts/ModalContext";
import BlogDataContext from "./contexts/BlogDataContext";
import SidebarContext from "./contexts/SidebarContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <BlogDataContext>
        <DarkModeContext>
          <ModalContext>
            <SidebarContext>
              <App />
            </SidebarContext>
          </ModalContext>
        </DarkModeContext>
      </BlogDataContext>
    </BrowserRouter>
  </React.StrictMode>
);
