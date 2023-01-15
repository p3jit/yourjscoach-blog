import React from "react";

const SkeletonLoaderPost = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse w-full">
      <div className="bg-slate-200 rounded w-[260px] h-16"></div>
      <div className="bg-slate-200 rounded w-12/12 h-20"></div>
      <div className="flex gap-3">
        <div className="bg-slate-200 rounded w-1/12 h-6"></div>
        <div className="bg-slate-200 rounded w-1/12 h-6"></div>
        <div className="bg-slate-200 rounded w-1/12 h-6"></div>
        <div className="bg-slate-200 rounded w-1/12 h-6"></div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="bg-slate-200 rounded w-12/12 h-40"></div>
        <div className="bg-slate-200 rounded w-12/12 h-40"></div>
        <div className="bg-slate-200 rounded w-12/12 h-40"></div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="bg-slate-200 rounded w-12/12 h-40"></div>
        <div className="bg-slate-200 rounded w-12/12 h-40"></div>
        <div className="bg-slate-200 rounded w-12/12 h-40"></div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="bg-slate-200 rounded w-12/12 h-40"></div>
        <div className="bg-slate-200 rounded w-12/12 h-40"></div>
        <div className="bg-slate-200 rounded w-12/12 h-40"></div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="bg-slate-200 rounded w-12/12 h-40"></div>
        <div className="bg-slate-200 rounded w-12/12 h-40"></div>
        <div className="bg-slate-200 rounded w-12/12 h-40"></div>
      </div>
    </div>
  );
};

export default SkeletonLoaderPost;
