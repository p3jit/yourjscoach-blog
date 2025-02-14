import React, { useContext } from "react";
import ProgressiveImage from "react-progressive-graceful-image";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";

const ImageTag = ({ children, index, identifier }) => {
  const { isDarkMode } = useContext(DarkModeProvider);
  debugger;
  const imageLink = children[0]?.props?.href
    ? String(children[0].props.href)
    : `/images/${identifier}/${identifier}_${index}.png`;

  return (
    <div
      className={`w-auto rounded-md p-3 my-5 ${
        !isDarkMode ? "ring-zinc-700 ring-1" : "p-0"
      }`}
    >
      <ProgressiveImage src={`${imageLink}?quality=70&format=webp`} placeholder={`${imageLink}?quality=1&format=webp`}>
        {(src, loading) => (
          <img
            rel="lazy"
            className={`${
              loading ? "blur-[4px]" : "blur-none"
            } delay-300 mb-2 mt-1 rounded-xl w-full min-h-[20rem] md:min-h-[25rem] lg:min-h-[30rem] respImage object-contain`}
            src={src}
            alt={String(children[0])}
            width={"600"}
            height={"300px"}
          />
        )}
      </ProgressiveImage>
    </div>
  );
};

export default ImageTag;
