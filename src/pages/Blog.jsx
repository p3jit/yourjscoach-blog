import React, { useContext, useRef, useState } from "react";
import Title from "../components/title/Title";
import { BlogDataProvider } from "../contexts/BlogDataContext";
import { IconSearch, IconMoodCry, IconX } from "@tabler/icons";
import { DarkModeProvider } from "../contexts/DarkModeContext";
import NewPostCard from "../components/newPostCard/NewPostCard";
import { ReactSVG } from "react-svg";
import SearchCard from "../components/searchCard/SearchCard";
import Tag from "../components/tag/Tag";
import SkeletonLoaderLatestPost from "../components/skeleton-loader-components/skeletonLoaderLatestPost/SkeletonLoaderLatestPost";
import SkeletonNewLatestPostCard from "../components/skeleton-loader-components/skeletonNewLatestPostCard/SkeletonNewLatestPostCard";
import Footer from "../components/footer/Footer";

// SearchBar Component
const SearchBar = ({ triggerSearch, handleClear, showClear, searchRef, isDarkMode }) => {
  const containerClass = !isDarkMode
    ? "bg-zinc-800 border border-zinc-700 focus-within:border-zinc-500"
    : "bg-white border border-zinc-200 focus-within:border-zinc-400";

  const inputClass = !isDarkMode
    ? "bg-zinc-800 text-zinc-200 placeholder-zinc-500"
    : "bg-white text-zinc-800 placeholder-zinc-400";

  return (
    <div
      className={`flex items-center relative my-5 rounded-xl px-4 py-3 transition-all duration-300 shadow-sm focus-within:shadow-md ${containerClass}`}
    >
      <IconSearch size={20} className={`flex-shrink-0 ${!isDarkMode ? "text-zinc-500" : "text-zinc-400"}`} />

      <input
        type="text"
        ref={searchRef}
        spellCheck="false"
        placeholder="Search articles, topics, or keywords..."
        className={`w-full outline-none px-3 text-base ${inputClass}`}
        onChange={triggerSearch}
      />

      {showClear && (
        <button
          className={`flex items-center justify-center p-1.5 rounded-full transition-colors ${
            !isDarkMode
              ? "hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300"
              : "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
          }`}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <IconX size={18} />
        </button>
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
  const { isDarkMode } = useContext(DarkModeProvider);

  if (searchData.length && !isSearching) {
    return (
      <div className="mt-7">
        <div className="flex items-center mb-4">
          <h2 className={` pl-2 textlg font-bold ${!isDarkMode ? "text-zinc-200" : "text-zinc-800"}`}>
            Results <span className="text-sm font-normal text-zinc-500 ml-2">({searchData.length} found)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {searchData.map((singleData) => (
            <SearchCard data={singleData} key={singleData.id} />
          ))}
        </div>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="mt-8">
        <div className="flex items-center mb-6">
          <h2 className={`text-xl font-bold ${!isDarkMode ? "text-zinc-200" : "text-zinc-800"}`}>
            Searching<span className="animate-pulse">...</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonLoaderLatestPost />
          <SkeletonLoaderLatestPost />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 justify-center items-center py-16 my-8 rounded-xl border border-dashed border-zinc-700/30">
      <IconMoodCry className={`${!isDarkMode ? "text-zinc-600" : "text-zinc-400"}`} size={48} />
      <div className="text-center">
        <h3 className={`font-medium text-xl ${!isDarkMode ? "text-zinc-300" : "text-zinc-600"}`}>No results found</h3>
        <p className={`mt-2 text-sm ${!isDarkMode ? "text-zinc-500" : "text-zinc-500"}`}>
          Try adjusting your search or filter to find what you're looking for
        </p>
      </div>
    </div>
  );
};

const Home = () => {
  const { latestPostData, searchData, debouncedSearch, fetchedTags, isSearching, setIsSearching } =
    useContext(BlogDataProvider);

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
    <div className="flex flex-col  md:px-2 ">
      {/* <ReactSVG src="/creative-writing-animate.svg" className="w-96 mx-auto" /> */}

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
      <div className="w-full pt-28">{!location.pathname.includes("/practice") && <Footer />}</div>
    </div>
  );
};

export default Home;
