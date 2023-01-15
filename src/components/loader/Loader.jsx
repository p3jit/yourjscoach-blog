import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { BiLoaderAlt } from "react-icons/bi";

const Loader = () => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <BiLoaderAlt
        className={`animate-spin text-4xl ${
          !isDarkMode ? "text-white" : "text-black"
        }`}
      />
    </div>
  );
};

export default Loader;
