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
    <div
      className={`outline outline-1  outline-slate-300 rounded-md shadow-lg ${
        isDarkMode ? "shadow-slate-300" : "shadow-slate-700"
      }`}
    >
      <div className="m-[3px]">
        {data.bannerImage ? (
          <ProgressiveImage
            src={data.bannerImage.highQuality.url}
            placeholder={data.bannerImage.lowQuality.url}
          >
            {(src, loading) => (
              <img
                className={`${
                  loading ? "blur-sm" : "blur-none"
                } transition-all delay-1000 rounded-t-md w-full h-[14rem] object-cover`}
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
      <div className="flex flex-col px-5 py-4">
        <h3
          className={`text-sm mb-2 font-medium ${
            !isDarkMode ? "text-slate-200" : "text-slate-700"
          }`}
        >
          {formatDate(new Date(data.timeStamp))}
        </h3>
        <h3
          className={`text-2xl font-semibold text-slate-800 mb-1 ${
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
          className={`font-medium text-slate-500 mt-2 text-sm md:text-base ${
            !isDarkMode ? "text-slate-300" : "text-black"
          }`}
        >
          {data.description.slice(0, 400) + "..." || data.description}
        </p>
        <div className="flex justify-between mt-5 items-center">
          <div className="flex gap-3 items-center">
            <picture pathset="/assets/">
              <img
                sizes="(max-width: 100px) 100vw, 800px"
                srcSet="
                  dp_bbot2g_c_scale,w_200.jpg 200w,
                  dp_bbot2g_c_scale,w_200.jpg 487w,
                  dp_bbot2g_c_scale,w_200.jpg 611w,
                  dp_bbot2g_c_scale,w_200.jpg 773w,
                  dp_bbot2g_c_scale,w_200.jpg 800w"
                src="dp_bbot2g_c_scale,w_200.jpg"
                alt="author"
                className="w-8 rounded-full"
                width={"100px"}
                height={"100px"}
              />
            </picture>
            <h3 className="text-xs text-slate-400 font-medium">
              Prithijit Das
            </h3>
          </div>

          <button
            className={`underline underline-offset-4 text-base flex gap-2 font-medium text-slate-500 ${
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
