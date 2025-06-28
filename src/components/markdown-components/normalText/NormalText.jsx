import React, { useContext } from "react";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";
import { useLocation } from "react-router-dom";

const NormalText = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const location = useLocation();
  return (
    <p
      className={`${location.pathname.includes("/practice") ? "leading-5 md:leading-6 text-md" : "leading-7 md:leading-8 text-lg"} tracking-normal ${
        isDarkMode ? "text-zinc-600" : "text-zinc-400"
      }`}
    >
      {children}
    </p>
  );
};

export default NormalText;
