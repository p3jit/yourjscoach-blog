import React from "react";

const VideoTag = ({ children }) => {
  return (
    <iframe
      className="w-full h-96 rounded-md"
      src={children[0].props.href}
    ></iframe>
  );
};

export default VideoTag;
