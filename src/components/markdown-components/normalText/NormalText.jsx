import React, { useContext } from "react";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";

const NormalText = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <p
      className={`leading-7 md:leading-8 font-medium text-lg md:text-xl ${
        isDarkMode ? "text-zinc-600" : "text-zinc-300"
      }`}
    >
      {children}
    </p>
  );
};

export default NormalText;
