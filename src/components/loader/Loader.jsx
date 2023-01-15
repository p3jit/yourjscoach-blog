import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { IconLoader2 } from "@tabler/icons";

const Loader = () => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <IconLoader2
        size={"4em"}
        className={`animate-spin ${
          !isDarkMode ? "text-white" : "text-slate-400"
        }`}
      />
    </div>
  );
};

export default Loader;
