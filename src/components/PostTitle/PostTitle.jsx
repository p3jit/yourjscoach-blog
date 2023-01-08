import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const PostTitle = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div
      className={`font-black ${
        isDarkMode ? "text-gray-800" : "text-white"
      } text-4xl md:text-6xl pb-3 break-words`}
    >
      {data}
    </div>
  );
};

export default PostTitle;
