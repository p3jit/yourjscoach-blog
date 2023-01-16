import { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const RoundedText = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <>
      <span
        className={`w-fit px-2 py-1 mx-1 ${
          isDarkMode ? "bg-slate-200" : "bg-slate-600 text-white"
        }`}
      >
        {children}
      </span>
    </>
  );
};

export default RoundedText;
