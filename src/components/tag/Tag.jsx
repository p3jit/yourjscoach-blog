import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const Tag = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <span
      className={`rounded text-sm font-medium  ${
        !isDarkMode ? "text-slate-500" : "text-slate-400"
      }`}
    >
      #{data}
    </span>
  );
};

export default Tag;
