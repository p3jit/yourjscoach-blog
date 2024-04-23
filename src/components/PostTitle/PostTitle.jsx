import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const PostTitle = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div
      className={`font-black capitalize tracking-wide ${
        isDarkMode ? "text-zinc-800" : "text-white"
      } text-4xl md:text-7xl pb-2 md:pb-1 text-center`}
    >
      {data}
    </div>
  );
};

export default PostTitle;
