import { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const RoundedText = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <>
      <span
        className={`rounded w-fit px-3 mx-1 ${
          isDarkMode ? "bg-slate-200" : "bg-slate-600 text-white"
        }`}
      >
        {children}
      </span>
    </>
  );
};

export default RoundedText;
