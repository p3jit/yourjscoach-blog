import { useContext } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { useResponsive } from "../../hooks/useResponsive";

export const Code = ({ children, language }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const { isMobile } = useResponsive();

  const isTrue = window.innerWidth <= 768;

  return (
    <>
      <div className={`rounded-lg ${isDarkMode ? "" : "ring ring-slate-400"}`}>
        <SyntaxHighlighter
          language={language}
          style={isDarkMode ? coldarkDark : coldarkDark}
          customStyle={{
            fontSize: `${isTrue || isMobile ? "0.9rem" : "1rem"}`,
            fontWeight: "200",
            borderRadius: "7px",
            lineHeight: "1.54rem",
            padding: "0px 16px",
          }}
        >
          {`${children}`}
        </SyntaxHighlighter>
      </div>
    </>
  );
};
