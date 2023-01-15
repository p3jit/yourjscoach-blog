import { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const Heading = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <>
      <div
        className={`text-xl md:text-2xl font-bold ${
          isDarkMode ? "text-gray-800" : "text-white"
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default Heading;
