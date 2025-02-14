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
    navigate(`/blog/${data.displayId}`);
  };

  const formatDate = (value) => {
    let date = value;
    const day = date.toLocaleString("default", { day: "2-digit" });
    const month = date.toLocaleString("default", { month: "long" });
    return `${month} ${day}`;
  };

  return (
    <div
      className={`outline outline-2 rounded-md h-fit cursor-pointer ${
        !isDarkMode ? "outline-zinc-700" : "outline-zinc-200"
      }`}
      onClick={handleReadMore}
    >
      <div className="m-[0.04rem]">
        {data.bannerImage ? (
          <ProgressiveImage
            src={`${import.meta.env.VITE_API_URL}/assets/${data.bannerImage}?quality=70&format=webp`}
            placeholder={`${import.meta.env.VITE_API_URL}/assets/${data.bannerImage}?quality=1&format=webp`}
          >
            {(src, loading) => (
              <img
                rel="preload"
                className={`${
                  loading ? "blur-[4px]" : "blur-none"
                } delay-200 mb-4 rounded-t-md w-full h-[15rem] object-cover`}
                src={src}
                alt={data.bannerImage}
                width={"500"}
                height={"300"}
              />
            )}
          </ProgressiveImage>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col px-5 py-4">
        <h3
          className={`text-xl font-normal leading-7 mb-1 tracking-tight ${
            !isDarkMode ? "text-zinc-200" : "text-black"
          }`}
        >
          {data.title}
        </h3>
        <div className="flex gap-1 md:gap-2 flex-wrap py-1">
          {data.tags.map((singleTag) => {
            return <Tag data={singleTag} key={singleTag} />;
          })}
        </div>
        <p
          className={`font-normal mt-2 text-md md:text-lg ${
            !isDarkMode ? "text-zinc-400" : "text-zinc-700"
          }`}
        >
          {data.description.slice(0, 300) + "..." || data.description}
        </p>
        <div className="flex justify-between mt-5 mb-3 items-end">
          <div className="flex gap-3 items-center">
            <h3
              className={`text-sm mb-2 font-medium ${
                !isDarkMode ? "text-zinc-200" : "text-zinc-400"
              }`}
            >
              {formatDate(new Date(data.timeStamp))}
            </h3>
          </div>
          <button
            className={`underline underline-offset-4 decoration-zinc-400 text-base flex gap-2 font-medium ${
              !isDarkMode ? "text-zinc-100" : "text-zinc-600"
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
