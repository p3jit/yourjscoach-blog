import React, { useContext, useRef, useState } from "react";
import Title from "../components/title/Title";
import { PostDataProvider } from "../contexts/PostDataContext";
import { IconSearch, IconMoodCry, IconX } from "@tabler/icons";
import { DarkModeProvider } from "../contexts/DarkModeContext";
import NewPostCard from "../components/newPostCard/NewPostCard";
import { ReactSVG } from "react-svg";
import SearchCard from "../components/searchCard/SearchCard";
import Tag from "../components/tag/Tag";
import SkeletonLoaderLatestPost from "../components/skeleton-loader-components/skeletonLoaderLatestPost/SkeletonLoaderLatestPost";
import SkeletonNewLatestPostCard from "../components/skeleton-loader-components/skeletonNewLatestPostCard/SkeletonNewLatestPostCard";

const Home = () => {
  const {
    latestPostData,
    searchData,
    debouncedSearch,
    fetchedTags,
    isSearching,
    setIsSearching,
  } = useContext(PostDataProvider);

  const [showClear, setShowClear] = useState(false);
  const searchRef = useRef();

  const { isDarkMode } = useContext(DarkModeProvider);

  const triggerSearch = (e) => {
    const query = e.target.value;
    setIsSearching(true);
    debouncedSearch(query.toLowerCase());
    if (query.length) {
      setShowClear(true);
    } else {
      setShowClear(false);
    }
  };

  const handleClear = () => {
    searchRef.current.value = "";
    debouncedSearch("");
    setShowClear(false);
    setIsSearching(true);
  };

  return (
    <div className="flex flex-col gap-4 md:px-2 min-h-[2000px]">
      <ReactSVG src="/creative-writing-animate.svg" className="w-96 mx-auto" />
      <Title data={"Latest Posts"}></Title>
      <div
        className={`grid grid-rows-1 gap-10 mt-2 ${
          latestPostData.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"
        }`}
      >
        {latestPostData[0] ? (
          latestPostData.map((singlePost) => (
            <NewPostCard data={singlePost} key={singlePost.id} />
          ))
        ) : (
          <div className="flex flex-col gap-5 md:flex-row justify-center 2xl:w-[50vw]">
            <SkeletonNewLatestPostCard />
            <SkeletonNewLatestPostCard />
          </div>
        )}
      </div>
      <br />
      <Title data={"Search"}></Title>
      <div className="flex justify-center items-center relative">
        <input
          type="text"
          ref={searchRef}
          spellCheck="false"
          className={`bg-zinc-100 outline outline-3 w-full outline-zinc-200 rounded-md py-2 pr-10 pl-10 font-medium ${
            isDarkMode ? "outline-zinc-200" : "outline-none"
          }`}
          onChange={triggerSearch}
        />
        <IconSearch className="absolute left-3 text-zinc-400 text-2xl" />
        {showClear ? (
          <IconX
            className="absolute right-3 text-2xl text-zinc-400 cursor-pointer"
            onClick={handleClear}
          />
        ) : (
          ""
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {fetchedTags.length ? (
          fetchedTags.map((singleTag) => (
            <Tag data={singleTag} key={singleTag} isClickable={true} />
          ))
        ) : (
          <div className="flex flex-wrap gap-3">
            <div className="w-20 h-8 rounded-md bg-zinc-200 animate-pulse"></div>
            <div className="w-20 h-8 rounded-md bg-zinc-200 animate-pulse"></div>
            <div className="w-20 h-8 rounded-md bg-zinc-200 animate-pulse"></div>
          </div>
        )}
      </div>

      {searchData.length && !isSearching ? (
        <div className="flex flex-col gap-7 pt-5 relative">
          {searchData.length
            ? searchData.map((singleData) => (
                <SearchCard data={singleData} key={singleData.id} />
              ))
            : ""}
        </div>
      ) : isSearching ? (
        <div className="flex flex-col gap-5">
          <SkeletonLoaderLatestPost />
          <SkeletonLoaderLatestPost />
        </div>
      ) : (
        <div className="flex flex-col gap-5 justify-center items-center pt-32">
          <IconMoodCry className="text-zinc-400" size={"3em"} />
          <h3 className="font-medium text-2xl text-zinc-400">Not found</h3>
        </div>
      )}
    </div>
  );
};

export default Home;
