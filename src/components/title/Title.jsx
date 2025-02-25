import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const Title = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div
      className={`font-medium ${
        isDarkMode ? "text-zinc-800" : "text-white"
      } text-2xl md:text-3xl break-words`}
    >
      {data}
    </div>
  );
};

export default Title;
