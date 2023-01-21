import React, { useContext, useState } from "react";
import ProgressiveImage from "react-progressive-graceful-image";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const ImageTag = ({ children, index, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useContext(DarkModeProvider);
  const { imageList } = props;
  return (
    <div
      className={`w-auto rounded-md p-3 my-5 ${
        !isDarkMode ? "ring-slate-700 ring-1" : "p-0"
      }`}
    >
      {!imageList[parseInt(index)] ? (
        <img
          src={String(children[0].props.href)}
          alt="newImage"
          loading="lazy"
          className={`object-cover bg-no-repeat rounded-md ${
            isLoading ? "invisible" : "visible"
          }`}
          onLoad={() => {
            setIsLoading(!isLoading);
          }}
        />
      ) : (
        ""
      )}
      {props.imageList[index] ? (
        <div className="">
          <ProgressiveImage
            src={imageList[parseInt(index)].highQuality.url}
            placeholder={imageList[parseInt(index)].lowQuality.url}
          >
            {(src, loading) => (
              <img
                rel="prefetch"
                className={`${
                  loading ? "blur-[4px]" : "blur-none"
                } delay-300 mb-2 mt-1 rounded-xl w-full min-h-[20rem] md:min-h-[25rem] lg:min-h-[30rem] object-cover`}
                src={src}
                alt="an image"
                width={"100px"}
                height={"100px"}
              />
            )}
          </ProgressiveImage>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ImageTag;
