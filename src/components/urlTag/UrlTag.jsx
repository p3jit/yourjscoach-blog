import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const UrlTag = ({ children, data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <a
      className={`underline underline-offset-2 italic font-medium text-lg ${
        !isDarkMode ? "text-white" : ""
      }`}
      href={data}
      target="_blank"
    >
      {children ? children : data}
    </a>
  );
};

export default UrlTag;
