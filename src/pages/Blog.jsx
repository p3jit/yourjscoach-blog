import React, { useContext, useRef, useState } from "react";
import SearchTag from "../components/searchTag/SearchTag";
import Title from "../components/title/Title";
import { PostDataProvider } from "../contexts/PostDataContext";
import { IconSearch, IconMoodCry, IconX } from "@tabler/icons";
import { DarkModeProvider } from "../contexts/DarkModeContext";
import NewPostCard from "../components/newPostCard/NewPostCard";
import SkeletonNewLatestPostCard from "../components/skeletonNewLatestPostCard/SkeletonNewLatestPostCard";
import { ReactSVG } from "react-svg";
import LatestPostCard from "../components/latestPostCard/LatestPostCard";

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
    debouncedSearch(query);
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
      {/* <ReactSVG
        src="/creative-writing-animate.svg"
        className="w-80 md:w-96 mx-auto"
      /> */}
      <Title data={"Latest"}></Title>
      {latestPostData[0] ? <LatestPostCard data={latestPostData[0]} /> : ""}
      <br />
      <Title data={"Search"}></Title>
      <div className="flex justify-center items-center relative">
        <input
          type="text"
          ref={searchRef}
          spellCheck="false"
          className={`bg-slate-100 outline outline-3 w-full outline-slate-200 rounded-md py-2 pr-10 pl-10 font-medium ${
            isDarkMode ? "outline-slate-200" : "outline-none"
          }`}
          onChange={triggerSearch}
        />
        <IconSearch className="absolute left-3 text-slate-400 text-2xl" />
        {showClear ? (
          <IconX
            className="absolute right-3 text-2xl text-slate-400 cursor-pointer"
            onClick={handleClear}
          />
        ) : (
          ""
        )}
      </div>
      <div className="flex gap-3 flex-wrap">
        {fetchedTags.length ? (
          fetchedTags.map((singleTag) => (
            <SearchTag data={singleTag} key={singleTag} />
          ))
        ) : (
          <div className="flex flex-wrap gap-3">
            <div className="w-20 h-8 rounded-md bg-slate-200 animate-pulse"></div>
            <div className="w-20 h-8 rounded-md bg-slate-200 animate-pulse"></div>
            <div className="w-20 h-8 rounded-md bg-slate-200 animate-pulse"></div>
          </div>
        )}
      </div>

      {searchData.length && !isSearching ? (
        <div className="flex flex-col md:flex-row gap-7 pt-5 relative">
          {searchData.length
            ? searchData.map((singleData) => (
                <NewPostCard data={singleData} key={singleData.id} />
              ))
            : ""}
        </div>
      ) : isSearching ? (
        <div className="flex flex-col gap-5">
          <SkeletonNewLatestPostCard />
          <SkeletonNewLatestPostCard />
        </div>
      ) : (
        <div className="flex flex-col gap-5 justify-center items-center pt-32">
          <IconMoodCry className="text-slate-400" size={"3em"} />
          <h3 className="font-medium text-2xl text-slate-400">Not found</h3>
        </div>
      )}
    </div>
  );
};

export default Home;
