import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const SearchCard = ({ data }) => {
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
      className={`flex flex-col rounded p-6 outline outline-2 outline-zinc-200`}
    >
      <div className="flex justify-between itme">
        <div
          className={`font-medium leading-6 text-xl w-9/12 md:text-2xl tracking-normal ${
            !isDarkMode ? "text-zinc-200" : "text-black"
          }`}
        >
          {data.title}
        </div>
        <h2
          className={` text-xs font-medium w-3/12 md:text-base mt-1 text-right ${
            !isDarkMode ? "text-white" : "text-zinc-400"
          }`}
        >
          {formatDate(new Date(data.timeStamp))}
        </h2>
      </div>
      <div className="flex flex-col pt-1 md:flex-row md:justify-between md:items-center">
        <h3 className="text-sm font-medium text-zinc-400 pl-[1px] md:pl-0 pt-1 md:pt-0">
          {data.minRead} min
        </h3>
      </div>
      <p
        className={`break-words font-normal text-black py-4 text-md md:text-lg ${
          !isDarkMode ? "text-zinc-400" : "text-zinc-500"
        }`}
      >
        {data.description.slice(0, 280) + "..." || data.description}
      </p>
      <button
        className="p-2 mt-4 font-medium rounded bg-zinc-300 hover:bg-zinc-400 text-zinc-600"
        onClick={handleReadMore}
      >
        Read more
      </button>
    </div>
  );
};

export default SearchCard;
