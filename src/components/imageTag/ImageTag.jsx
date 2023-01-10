import React, { useState } from "react";

const ImageTag = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  console.log(isLoading);

  return (
    <div className="w-auto my-4">
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
    </div>
  );
};

export default ImageTag;
