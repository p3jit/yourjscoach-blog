import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const NormalText = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <p
      className={`leading-8 font-medium text-base md:text-lg ${
        isDarkMode ? "text-gray-600" : "text-gray-300"
      }`}
    >
      {children}
    </p>
  );
};

export default NormalText;
