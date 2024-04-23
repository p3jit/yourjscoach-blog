import React from "react";

const SkeletonLoaderLatestPost = () => {
  return (
    <div className="flex flex-col gap-3 outline outline-1 outline-zinc-300 rounded-md p-4 animate-pulse">
      <div className="flex justify-between">
        <div className="bg-zinc-200 w-72 h-7 rounded-md"></div>
        <div className="bg-zinc-200 w-20 h-7 rounded-md"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-14 bg-zinc-200 rounded-md"></div>
        <div className="h-5 w-14 bg-zinc-200 rounded-md"></div>
        <div className="h-5 w-14 bg-zinc-200 rounded-md"></div>
        <div className="h-5 w-14 bg-zinc-200 rounded-md"></div>
      </div>
      <div className="h-32 w-full bg-zinc-200 rounded-md"></div>
      <div className="h-10 w-full bg-zinc-200 rounded-md"></div>
    </div>
  );
};

export default SkeletonLoaderLatestPost;
