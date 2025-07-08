import React, { useContext } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/vsDark";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";
import { useResponsive } from "../../../hooks/useResponsive";

export default function NewCode(props) {
  const { isDarkMode } = useContext(DarkModeProvider);
  const { isMobile } = useResponsive();
  const isTrue = window.innerWidth <= 768;

  return (
    <Highlight
      {...defaultProps}
      code={String(props.children).trim()}
      language={props.className === "lang-html" ? "html" : props.className == "lang-js" ? "javascript" : "typescript"}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div
          className={`${className} p-4 rounded-lg leading-6 overflow-auto ${
            isMobile || isTrue ? "text-sm" : "text-base"
          } ${isDarkMode ? "" : "ring-1 ring-zinc-700"}`}
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={i} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </div>
      )}
    </Highlight>
  );
}
