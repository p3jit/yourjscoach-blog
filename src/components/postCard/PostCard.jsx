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
    // outline outline-1 outline-slate-300
    <div
      className={`flex flex-col rounded p-4 outline outline-1 outline-slate-300  ${
        isDarkMode ? "" : ""
      }`}
    >
      <div className="flex justify-between">
        <div
          className={`font-bold text-xl md:text-2xl ${
            !isDarkMode ? "text-slate-200" : "text-black"
          }`}
        >
          {data.title}
        </div>
        <h2
          className={` text-sm font-medium md:text-base mt-1 ${
            !isDarkMode ? "text-white" : "text-slate-400"
          }`}
        >
          {new Date(data.timeStamp.seconds * 1000).toLocaleDateString()}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-1">
        <div className="flex gap-2 flex-wrap">
          {data.tags.map((singleTag) => {
            return <Tag key={singleTag} data={singleTag} />;
          })}
        </div>
        <h3 className="text-sm font-medium text-slate-400 pl-[1px] md:pl-0 pt-1 md:pt-0">
          {data.minRead} min
        </h3>
      </div>
      <p
        className={`break-words font-medium text-black pt-2 text-sm md:text-base ${
          !isDarkMode ? "text-slate-300" : "text-black"
        }`}
      >
        {data.description.slice(0, 400) + "..." || data.description}
      </p>
      <button
        className="rounded p-2 mt-3 bg-slate-300 hover:bg-slate-400 text-slate-600 font-medium"
        onClick={handleReadMore}
      >
        Read more
      </button>
    </div>
  );
};

export default PostCard;
