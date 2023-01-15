import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import Tag from "../tag/Tag";

const PostCard = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const navigate = useNavigate();
  const handleReadMore = () => {
    navigate(`/${data.displayId}`);
  };

  const formatDate = (value) => {
    let date = value;
    const day = date.toLocaleString("default", { day: "2-digit" });
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.toLocaleString("default", { year: "numeric" });
    return `${day} ${month}, ${year}`;
  };

  return (
    <div
      className={`flex flex-col rounded p-4 outline outline-1 outline-slate-300`}
    >
      <div className="flex justify-between itme">
        <div
          className={`font-bold leading-6 text-xl w-9/12 md:text-2xl ${
            !isDarkMode ? "text-slate-200" : "text-black"
          }`}
        >
          {data.title}
        </div>
        <h2
          className={` text-xs font-medium w-3/12 md:text-base mt-1 text-right ${
            !isDarkMode ? "text-white" : "text-slate-400"
          }`}
        >
          {formatDate(data.timeStamp)}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-1">
        <div className="flex gap-1 md:gap-2 flex-wrap">
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
