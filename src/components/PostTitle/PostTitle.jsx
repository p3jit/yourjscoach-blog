import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const PostTitle = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div className="flex flex-col gap-1">
      <div className={`font-semibold capitalize text-zinc-200 text-4xl md:text-5xl pb-2 md:pb-1 text-start`}>
        {data}
      </div>
    </div>
  );
};

export default PostTitle;
