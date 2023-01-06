import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import Tag from "../tag/Tag";

const PostCard = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const navigate = useNavigate();
  const handleReadMore = () => {
    navigate(`/${data.id}`);
  };
  return (
    <div
      className={`flex flex-col rounded p-4 outline outline-1 outline-slate-300 gap-1 shadow-lg ${
        isDarkMode ? "shadow-slate-300" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <div
          className={`font-bold text-xl md:text-2xl ${
            !isDarkMode ? "text-slate-200" : "text-black"
          }`}
        >
          {data.title}
        </div>
        <h2
          className={` text-sm font-medium md:text-base ${
            !isDarkMode ? "text-white" : ""
          }`}
        >
          {new Date(data.timeStamp.seconds * 1000).toLocaleDateString()}
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {data.tags.map((singleTag) => {
          return <Tag key={singleTag} data={singleTag} />;
        })}
      </div>
      <p
        className={`break-all font-medium text-black pt-2 text-sm md:text-base ${
          !isDarkMode ? "text-slate-300" : "text-black"
        }`}
      >
        {data.description.slice(0, 400) + "..." || data.description}
      </p>
      <button
        className="rounded p-2 mt-2 bg-slate-300 hover:bg-slate-400 text-slate-600 font-medium"
        onClick={handleReadMore}
      >
        Read more
      </button>
    </div>
  );
};

export default PostCard;
