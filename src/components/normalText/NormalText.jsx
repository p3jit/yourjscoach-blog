import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const NormalText = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <p
      className={`leading-7 font-medium ${
        isDarkMode ? "text-gray-600" : "text-gray-200"
      }`}
    >
      {children}
    </p>
  );
};

export default NormalText;
