import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const PostTitle = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div
      className={`font-black ${
        isDarkMode ? "text-gray-800" : "text-white"
      } text-3xl md:text-6xl pb-3 break-words md:leading-[3.6rem]`}
    >
      {data}
    </div>
  );
};

export default PostTitle;
