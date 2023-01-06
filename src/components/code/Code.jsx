import { useContext } from "react";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  anOldHope,
  github,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { useResponsive } from "../../hooks/useResponsive";

export const Code = ({ children, language }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const { isMobile } = useResponsive();

  const isTrue = window.innerWidth <= 768;

  console.log(isMobile);
  return (
    <>
      <div className="py-2">
        <SyntaxHighlighter
          language={language}
          style={isDarkMode ? anOldHope : github}
          customStyle={{
            fontSize: `${isTrue || isMobile ? "0.9rem" : "1rem"}`,
            fontWeight: `${!isDarkMode ? "" : ""}`,
            borderRadius: "6px",
            lineHeight: "1.7rem",
            padding: "1rem",
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </>
  );
};
