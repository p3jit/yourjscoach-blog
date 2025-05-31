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

// SearchBar Component
const SearchBar = ({ triggerSearch, handleClear, showClear, searchRef, isDarkMode }) => {
  return (
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
      {showClear && (
        <IconX
          className="absolute right-3 text-2xl text-zinc-400 cursor-pointer"
          onClick={handleClear}
        />
      )}
    </div>
  );
};

// TagList Component
const TagList = ({ fetchedTags }) => {
  if (fetchedTags.length) {
    return (
      <div className="flex gap-2 flex-wrap mt-5">
        {fetchedTags.map((singleTag) => (
          <Tag data={singleTag} key={singleTag} isClickable={true} />
        ))}
      </div>
    );
  }
  
  return (
    <div className="flex gap-2 flex-wrap">
      <div className="flex flex-wrap gap-3">
        <div className="w-20 h-8 rounded-md bg-zinc-200 animate-pulse"></div>
        <div className="w-20 h-8 rounded-md bg-zinc-200 animate-pulse"></div>
        <div className="w-20 h-8 rounded-md bg-zinc-200 animate-pulse"></div>
      </div>
    </div>
  );
};

// LatestPosts Component
const LatestPosts = ({ latestPostData }) => {
  if (latestPostData[0]) {
    return (
      <div className="grid grid-rows-1 gap-10 mt-2 md:grid-cols-2">
        {latestPostData.map((singlePost) => (
          <NewPostCard data={singlePost} key={singlePost.id} />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-rows-1 gap-10 mt-2 md:grid-cols-2">
      <SkeletonNewLatestPostCard />
      <SkeletonNewLatestPostCard />
    </div>
  );
};

// SearchResults Component
const SearchResults = ({ searchData, isSearching }) => {
  if (searchData.length && !isSearching) {
    return (
      <div className="flex flex-col gap-7 pt-5 relative">
        {searchData.map((singleData) => (
          <SearchCard data={singleData} key={singleData.id} />
        ))}
      </div>
    );
  }
  
  if (isSearching) {
    return (
      <div className="flex flex-col gap-5 mt-4">
        <SkeletonLoaderLatestPost />
        <SkeletonLoaderLatestPost />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-5 justify-center items-center pt-32">
      <IconMoodCry className="text-zinc-400" size={"3em"} />
      <h3 className="font-medium text-2xl text-zinc-400">Not found</h3>
    </div>
  );
};

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
    setShowClear(query.length > 0);
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
      
      <section aria-labelledby="latest-posts-title">
        <Title data={"Latest Posts"} />
        <LatestPosts latestPostData={latestPostData} />
      </section>
      
      <br />
      
      <section aria-labelledby="search-title">
        <Title data={"Search"} />
        <SearchBar 
          triggerSearch={triggerSearch} 
          handleClear={handleClear} 
          showClear={showClear} 
          searchRef={searchRef}
          isDarkMode={isDarkMode}
        />
        <TagList fetchedTags={fetchedTags} />
        <SearchResults searchData={searchData} isSearching={isSearching} />
      </section>
    </div>
  );
};

export default Home;
