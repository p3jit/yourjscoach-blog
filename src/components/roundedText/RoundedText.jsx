import { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

export const RoundedText = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <>
      <span
        className={`rounded  w-fit py-1 px-2 font-medium ${
          isDarkMode ? "bg-slate-300" : "bg-slate-500 text-white"
        }`}
      >
        {children}
      </span>
    </>
  );
};
