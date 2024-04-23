import React from "react";

const SkeletonNewLatestPostCard = () => {
  return (
    <div className="flex flex-col gap-2 outline outline-1 outline-zinc-300 rounded-md animate-pulse w-full">
      <div className="h-[17rem] bg-zinc-200"></div>
      <div className="flex flex-col px-5 py-2 gap-2">
        <div className="h-10 bg-zinc-200 rounded-lg"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-zinc-200 w-12 rounded-lg"></div>
          <div className="h-6 bg-zinc-200 w-12 rounded-lg"></div>
          <div className="h-6 bg-zinc-200 w-12 rounded-lg"></div>
        </div>
        <div className="h-24 bg-zinc-200 rounded-lg"></div>
        <div className="flex gap-2 justify-between pb-2 mb-1 mt-1">
          <div className="h-6 bg-zinc-200 w-20 rounded-lg"></div>
          <div className="h-6 bg-zinc-200 w-20 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonNewLatestPostCard;
