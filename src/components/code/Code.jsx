import { useContext } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
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
          style={isDarkMode ? oneDark : oneLight}
          customStyle={{
            fontSize: `${isTrue || isMobile ? "0.8rem" : "1rem"}`,
            lineHeight: "1.2em",
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </>
  );
};
