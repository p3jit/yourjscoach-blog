import React, { useContext } from "react";
import { IconArrowNarrowRight } from "@tabler/icons";
import ProgressiveImage from "react-progressive-graceful-image";
import { useNavigate } from "react-router-dom";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import Tag from "../tag/Tag";

const NewPostCard = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  const navigate = useNavigate();
  const handleReadMore = () => {
    navigate(`/${data.displayId}`);
  };

  const formatDate = (value) => {
    let date = value;
    const day = date.toLocaleString("default", { day: "2-digit" });
    const month = date.toLocaleString("default", { month: "long" });
    return `${month} ${day}`;
  };

  return (
    <div className={`outline outline-1  outline-slate-300 rounded-md h-fit`}>
      <div className="m-[0.04rem]">
        {data.bannerImage ? (
          <ProgressiveImage
            src={data.bannerImage.highQuality.url}
            placeholder={data.bannerImage.lowQuality.url}
          >
            {(src, loading) => (
              <img
                rel="prefetch"
                className={`${
                  loading ? "blur-[4px]" : "blur-none"
                } delay-200 mb-4 rounded-t-md w-full h-[15rem] object-fill`}
                src={src}
                alt="an image"
                width={"100px"}
                height={"100px"}
              />
            )}
          </ProgressiveImage>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col px-5 py-1">
        <h3
          className={`text-2xl font-bold leading-7 text-slate-800 mb-1 tracking-tighter ${
            !isDarkMode ? "text-slate-200" : "text-black"
          }`}
        >
          {data.title}
        </h3>
        <div className="flex gap-1 md:gap-2 flex-wrap">
          {data.tags.map((singleTag) => {
            return <Tag key={singleTag} data={singleTag} />;
          })}
        </div>
        <p
          className={`font-medium text-slate-500 mt-2 text-lg md:text-xl ${
            !isDarkMode ? "text-slate-300" : "text-black"
          }`}
        >
          {data.description.slice(0, 300) + "..." || data.description}
        </p>
        <div className="flex justify-between mt-5 mb-3 items-end">
          <div className="flex gap-3 items-center">
            <h3
              className={`text-sm mb-2 font-medium ${
                !isDarkMode ? "text-slate-200" : "text-slate-400"
              }`}
            >
              {formatDate(new Date(data.timeStamp))}
            </h3>
          </div>
          <button
            className={`underline underline-offset-4 decoration-slate-400 text-base flex gap-2 font-medium text-slate-500 ${
              !isDarkMode ? "text-slate-300" : "text-black"
            }`}
            onClick={handleReadMore}
          >
            Read More <IconArrowNarrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPostCard;
