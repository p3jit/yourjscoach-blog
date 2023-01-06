import React from "react";

const VideoTag = ({ children }) => {
  console.log(children);
  return (
    <iframe
      className="w-full h-96 rounded-md my-2"
      src="https://www.youtube.com/embed/tgbNymZ7vqY"
    ></iframe>
  );
};

export default VideoTag;
