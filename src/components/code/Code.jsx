import { useContext } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  materialDark,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
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
          style={isDarkMode ? materialDark : oneLight}
          customStyle={{
            fontSize: `${isTrue || isMobile ? "0.8rem" : "1rem"}`,
            fontWeight: `${!isDarkMode ? "bold" : ""}`,
            borderRadius: "6px",
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </>
  );
};
