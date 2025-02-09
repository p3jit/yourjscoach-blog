import React from "react";

const SkeletonLoaderPost = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse 2xl:w-[45vw] 2xl:self-center">
      <div className="bg-zinc-200 rounded w-full h-36 self-center"></div>
      <div className="bg-zinc-200 rounded w-4/12 h-14 self-center"></div>
      <div className="flex flex-col gap-5">
        <div className="bg-zinc-200 rounded w-12/12 h-56"></div>
        <div className="bg-zinc-200 rounded w-12/12 h-40"></div>
        <div className="bg-zinc-200 rounded w-12/12 h-40"></div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="bg-zinc-200 rounded w-12/12 h-40"></div>
        <div className="bg-zinc-200 rounded w-12/12 h-40"></div>
        <div className="bg-zinc-200 rounded w-12/12 h-40"></div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="bg-zinc-200 rounded w-12/12 h-40"></div>
        <div className="bg-zinc-200 rounded w-12/12 h-40"></div>
        <div className="bg-zinc-200 rounded w-12/12 h-40"></div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="bg-zinc-200 rounded w-12/12 h-40"></div>
        <div className="bg-zinc-200 rounded w-12/12 h-40"></div>
        <div className="bg-zinc-200 rounded w-12/12 h-40"></div>
      </div>
    </div>
  );
};

export default SkeletonLoaderPost;
