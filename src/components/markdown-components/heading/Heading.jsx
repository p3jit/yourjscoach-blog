import { useContext } from "react";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";

const Heading = ({ children, level = 1, id, ...props }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  
  // Create a slug from the heading text for the ID
  const slug = id || (typeof children === 'string' 
    ? children.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
    : '');
  
  const Tag = `h${Math.min(level, 6)}`;
  const textColor = isDarkMode ? "text-zinc-800" : "text-white";
  const textSize = {
    1: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl",
    3: "text-2xl md:text-3xl",
    4: "text-xl md:text-2xl",
    5: "text-lg md:text-xl",
    6: "text-base md:text-lg",
  }[level] || "text-2xl";
  
  return (
    <Tag 
      id={slug}
      className={`${textSize} font-bold ${textColor} mt-6 mb-4 scroll-mt-20`}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Heading;
