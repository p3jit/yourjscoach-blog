import React from "react";
import { IconBrandJavascript } from "@tabler/icons";

const Brand = ({ isDarkMode, onClick, size="1.8em", fontSize="text-2xl" }) => (
  <div className="flex items-center gap-2">
    <IconBrandJavascript
      size={size}
      stroke={"2"}
      className={isDarkMode ? "text-zinc-700" : "text-zinc-200"}
      aria-hidden="true"
    />
    <h2
      onClick={onClick}
      className={`cursor-pointer font-bold ${fontSize} ${isDarkMode ? "text-zinc-800" : "text-zinc-200"}`}
    >
      YourJsCoach
    </h2>
  </div>
);

export default Brand;