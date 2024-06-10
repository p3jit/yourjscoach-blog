import React, { useContext } from "react";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";
import { useLocation } from "react-router-dom";

const NormalText = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const location = useLocation();
  return (
    <p
      className={`${location.pathname === "/practice" ? "leading-6 md:leading-7" : "leading-8 md:leading-9"}  font-medium text-lg md:text-xl ${
        isDarkMode ? "text-zinc-600" : "text-zinc-300"
      }`}
    >
      {children}
    </p>
  );
};

export default NormalText;
