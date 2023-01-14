import { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

export const Heading = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <>
      <div
        className={`text-2xl font-bold ${
          isDarkMode ? "text-gray-800" : "text-white"
        }`}
      >
        {children}
      </div>
    </>
  );
};
