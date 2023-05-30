import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const Tag = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <span
      className={`rounded-md bg-slate-200 px-2 py-1 text-base font-bold mt-2  ${
        !isDarkMode ? "text-slate-700" : "text-slate-500"
      }`}
    >
      {data}
    </span>
  );
};

export default Tag;
