import { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

export const Heading = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <>
      <div
        className={`text-xl font-bold pb-1 ${
          isDarkMode ? "text-gray-800" : "text-white"
        }`}
      >
        {children}
      </div>
    </>
  );
};
