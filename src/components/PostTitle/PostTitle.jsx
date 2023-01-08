import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const PostTitle = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div
      className={`font-black ${
        isDarkMode ? "text-gray-800" : "text-white"
      } text-4xl md:text-6xl pb-3 break-words leading-9 md:leading-[3.5rem]`}
    >
      {data}
    </div>
  );
};

export default PostTitle;
