import React, { useContext } from "react";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";
import { useLocation } from "react-router-dom";

const NormalText = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const location = useLocation();
  return (
    <p
      className={`${location.pathname === "/practice" ? "leading-6 md:leading-7" : "leading-8 md:leading-9"} tracking-normal font-medium text-lg ${
        isDarkMode ? "text-zinc-600" : "text-zinc-400"
      }`}
    >
      {children}
    </p>
  );
};

export default NormalText;
