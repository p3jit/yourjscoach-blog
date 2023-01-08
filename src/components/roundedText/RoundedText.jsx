import { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

export const RoundedText = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <>
      <span
        className={`rounded  w-fit py-1 px-2 mx-1 font-medium ${
          isDarkMode ? "bg-slate-200" : "bg-slate-600 text-white"
        }`}
      >
        {children}
      </span>
    </>
  );
};
