import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const Title = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div
      className={`font-extrabold ${
        isDarkMode ? "text-gray-800" : "text-white"
      } text-2xl md:text-4xl break-words`}
    >
      {data}
    </div>
  );
};

export default Title;
