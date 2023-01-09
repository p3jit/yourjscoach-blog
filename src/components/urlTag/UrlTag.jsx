import React from "react";

const UrlTag = ({ children, data }) => {
  return (
    <a
      className="underline italic font-medium text-lg"
      href={data}
      target="_blank"
    >
      {children ? children : data}
    </a>
  );
};

export default UrlTag;
