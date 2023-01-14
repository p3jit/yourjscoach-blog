import { useContext, useEffect } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { hybrid } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { useResponsive } from "../../hooks/useResponsive";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";

export const Code = ({ children, language }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const { isMobile } = useResponsive();

  const isTrue = window.innerWidth <= 768;

  useEffect(() => {
    SyntaxHighlighter.registerLanguage("json", json);
  }, []);

  return (
    <>
      <div>
        <SyntaxHighlighter
          language="JSON"
          style={isDarkMode ? hybrid : hybrid}
          customStyle={{
            fontSize: `${isTrue || isMobile ? "0.9rem" : "1rem"}`,
            fontWeight: `${!isDarkMode ? "" : ""}`,
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
