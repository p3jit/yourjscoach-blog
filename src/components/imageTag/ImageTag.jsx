import React from "react";

const ImageTag = ({ children }) => {
  return (
    <div className="w-auto my-5">
      <img
        src={String(children[0].props.href)}
        alt="newImage"
        className="object-cover bg-no-repeat rounded-md"
      />
    </div>
  );
};

export default ImageTag;
