import React from "react";
import { IconBrandJavascript } from "@tabler/icons";

const Brand = ({ isDarkMode = false, onClick, size="1.8em", fontSize="text-2xl" }) => {
  const baseLogoClass = "transition-all duration-300 ease-in-out";
  const logoClass = isDarkMode 
    ? `${baseLogoClass} text-zinc-500 hover:text-zinc-400` 
    : `${baseLogoClass} text-zinc-400 hover:text-zinc-300`;
  
  const baseTextClass = "cursor-pointer font-bold transition-all duration-300 ease-in-out";
  const textClass = isDarkMode
    ? `${baseTextClass} ${fontSize} bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 to-zinc-600 hover:from-zinc-400 hover:to-zinc-500`
    : `${baseTextClass} ${fontSize} bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 to-zinc-400 hover:from-zinc-200 hover:to-zinc-300`;

  return (
    <div className="flex items-center gap-2 py-1">
      <div className="relative">
        <IconBrandJavascript
          size={size}
          stroke={"2"}
          className={logoClass}
          aria-hidden="true"
        />
        <div className={`absolute inset-0 blur-sm opacity-30 ${logoClass}`}>
          <IconBrandJavascript
            size={size}
            stroke={"2"}
            aria-hidden="true"
          />
        </div>
      </div>
      <h2
        onClick={onClick}
        className={textClass}
      >
        YourJsCoach
      </h2>
    </div>
  );
};

export default Brand;