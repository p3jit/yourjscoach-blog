import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const PostTitle = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div
      className={`font-black ${
        isDarkMode ? "text-gray-800" : "text-white"
      } text-5xl md:text-7xl pb-5 break-words`}
    >
      {data}
    </div>
  );
};

export default PostTitle;
