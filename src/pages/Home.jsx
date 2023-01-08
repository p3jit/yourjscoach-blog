import React, { useContext } from "react";
import PostCard from "../components/postCard/PostCard";
import SearchTag from "../components/searchTag/SearchTag";
import SkeletonLoaderLatestPost from "../components/skeletonLoaderLatestPost/SkeletonLoaderLatestPost";
import Title from "../components/title/Title";
import { PostDataProvider } from "../contexts/PostDataContext";
import { MdSearch } from "react-icons/md";
import { FaSadCry } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { DarkModeProvider } from "../contexts/DarkModeContext";

const Home = () => {
  const {
    latestPostData,
    searchData,
    debouncedSearch,
    fetchedTags,
    isSearching,
    setIsSearching,
  } = useContext(PostDataProvider);

  const { isDarkMode } = useContext(DarkModeProvider);

  const triggerSearch = (e) => {
    const query = e.target.value;
    setIsSearching(true);
    debouncedSearch(query);
  };

  return (
    <div className="flex flex-col gap-4 md:px-2 min-h-[2000px]">
      <Title data={"Latest Posts"}></Title>
      {latestPostData[0] ? (
        latestPostData.map((singlePost) => (
          <PostCard data={singlePost} key={singlePost.id} />
        ))
      ) : (
        <div className="flex flex-col gap-5">
          <SkeletonLoaderLatestPost />
          <SkeletonLoaderLatestPost />
        </div>
      )}
      <br />
      <Title data={"Search"}></Title>
      <div className="flex justify-center items-center relative">
        <input
          type="text"
          spellCheck="false"
          className={`bg-slate-100 outline outline-3 w-full outline-slate-200 rounded-md py-2 pr-3 pl-10 font-medium ${
            isDarkMode ? "outline-slate-200" : "outline-none"
          }`}
          onChange={triggerSearch}
        />
        <MdSearch className="absolute left-3 text-slate-400 text-2xl" />
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
        <div className="flex flex-col gap-7 pt-5 relative">
          {searchData.length
            ? searchData.map((singleData) => (
                <PostCard data={singleData} key={singleData.id} />
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
          <FaSadCry className="text-8xl text-slate-400" />
          <h3 className="font-medium text-2xl text-slate-400">Not found</h3>
        </div>
      )}
    </div>
  );
};

export default Home;
