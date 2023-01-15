import React, { useContext } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/vsDark";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { useResponsive } from "../../hooks/useResponsive";

export default function NewCode({ children, language }) {
  const { isDarkMode } = useContext(DarkModeProvider);
  const { isMobile } = useResponsive();
  const isTrue = window.innerWidth <= 768;

  return (
    <Highlight
      {...defaultProps}
      code={String(children).trim()}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} py-5 px-5 rounded-lg leading-6 overflow-auto ${
            isMobile || isTrue ? "text-sm" : "text-base"
          } ${isDarkMode ? "" : "ring-2 ring-slate-500"}`}
          style={style}
        >
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
