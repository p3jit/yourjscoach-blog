import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import Tag from "../tag/Tag";
import ProgressiveImage from "react-progressive-graceful-image";
import { useNavigate } from "react-router-dom";

const LatestPostCard = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const navigate = useNavigate();

  const formatDate = (value) => {
    let date = value;
    const day = date.toLocaleString("default", { day: "2-digit" });
    const month = date.toLocaleString("default", { month: "long" });
    return `${month} ${day}`;
  };

  const handleClick = () => {
    navigate(`/${data.displayId}`);
  };
  return (
    <div
      className="flex flex-col-reverse md:flex-row rounded-md cursor-pointer border-2 border-slate-200 p-6 gap-5"
      onClick={handleClick}
    >
      <div className="w-full md:w-6/12 flex flex-col gap-2">
        <h1
          className={`text-3xl font-bold leading-8 text-slate-800 mb-1 ${
            !isDarkMode ? "text-slate-200" : "text-black"
          }`}
        >
          {data.title}
        </h1>
        <div className="flex gap-1 md:gap-2 flex-wrap">
          {data.tags.map((singleTag) => {
            return <Tag key={singleTag} data={singleTag} />;
          })}
        </div>
        <p
          className={`font-medium mt-2 text-lg md:text-xl ${
            !isDarkMode ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {data.description.slice(0, 300) + "..." || data.description}
        </p>
        <div className="flex gap-3 items-center">
          <h3
            className={`text-lg mb-2 font-medium ${
              !isDarkMode ? "text-slate-200" : "text-slate-500"
            }`}
          >
            {formatDate(new Date(data.timeStamp))}
          </h3>
        </div>
      </div>
      <div className="w-full md:w-6/12 h-[18em] md:h-auto justify-center flex items-center">
        {data.bannerImage ? (
          <ProgressiveImage
            src={data.bannerImage.highQuality.url}
            placeholder={data.bannerImage.lowQuality.url}
          >
            {(src, loading) => (
              <img
                rel="preload"
                className={`${
                  loading ? "blur-[4px]" : "blur-none"
                } delay-200 rounded-md w-full h-full object-cover`}
                src={src}
                alt="an image"
                width={"500"}
                height={"300"}
              />
            )}
          </ProgressiveImage>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default LatestPostCard;
