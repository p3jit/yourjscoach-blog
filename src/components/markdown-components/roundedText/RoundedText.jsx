import { useContext } from "react";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";

const RoundedText = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <>
      <span
        className={`w-fit px-2 py-1 mx-1 rounded-md h-fit ${
          isDarkMode ? "bg-zinc-200" : "bg-zinc-700 text-white"
        }`}
      >
        {children}
      </span>
    </>
  );
};

export default RoundedText;
