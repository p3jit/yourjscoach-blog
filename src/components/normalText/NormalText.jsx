import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const NormalText = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <p className={`leading-7 ${isDarkMode ? "text-black" : "text-gray-200"}`}>
      {children}
    </p>
  );
};

export default NormalText;
