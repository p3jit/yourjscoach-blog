import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import DarkModeContext from "./contexts/DarkModeContext";
import ModalContext from "./contexts/ModalContext";
import BlogDataContext from "./contexts/BlogDataContext";
import SidebarContext from "./contexts/SidebarContext";
import "./index.css";
import ProblemDataContext from "./contexts/ProblemDataContext";
import LocalStorageContext from "./contexts/localStorageContext";
import { StudyPlanProvider } from "./contexts/StudyPlanContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LocalStorageContext>
      <BlogDataContext>
        <ProblemDataContext>
          <StudyPlanProvider>
            <DarkModeContext>
              <ModalContext>
                <SidebarContext>
                  <App />
                </SidebarContext>
              </ModalContext>
            </DarkModeContext>
          </StudyPlanProvider>
        </ProblemDataContext>
      </BlogDataContext>
    </LocalStorageContext>
  </BrowserRouter>
);
