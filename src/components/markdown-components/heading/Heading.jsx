import { useContext } from "react";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";

const Heading = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <>
      <div
        className={`text-3xl md:text-2xl font-bold ${
          isDarkMode ? "text-zinc-800" : "text-white"
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default Heading;
