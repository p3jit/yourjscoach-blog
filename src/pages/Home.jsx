import React, { useContext } from "react";
import PostCard from "../components/postCard/PostCard";
import SearchTag from "../components/searchTag/SearchTag";
import SkeletonLoaderLatestPost from "../components/skeletonLoaderLatestPost/SkeletonLoaderLatestPost";
import Title from "../components/title/Title";
import { PostDataProvider } from "../contexts/PostDataContext";
import { MdSearch } from "react-icons/md";
import { FaSadCry } from "react-icons/fa";
import { DarkModeProvider } from "../contexts/DarkModeContext";

const Home = () => {
  const {
    latestPostData,
    searchData,
    setSearchData,
    debouncedSearch,
    postData,
    searchFilter,
    fetchedTags,
  } = useContext(PostDataProvider);

  const { isDarkMode } = useContext(DarkModeProvider);

  const triggerSearch = (e) => {
    const query = e.target.value;
    if (query.length) {
      debouncedSearch(query);
    } else {
      if (!searchFilter.length) setSearchData(postData);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:px-2 ">
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
      <Title data={"Search"}></Title>
      <div className="flex justify-center items-center relative">
        <input
          type="text"
          className={`bg-slate-100 outline outline-3 w-full outline-slate-200 rounded-md py-2 pr-3 pl-10 font-medium ${
            isDarkMode ? "outline-slate-200" : "outline-none"
          }`}
          onKeyUp={triggerSearch}
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

      {searchData.length ? (
        <div className="flex flex-col gap-5 pt-10 relative">
          {searchData.length ? (
            searchData.map((singleData) => (
              <PostCard data={singleData} key={singleData.id} />
            ))
          ) : (
            <div
              className={`font-bold text-4xl  self-center p-20 flex flex-col items-center gap-5 ${
                isDarkMode ? "text-slate-700" : "text-slate-200"
              }`}
            >
              <FaSadCry />
              <div>Not found!</div>
            </div>
          )}
        </div>
      ) : (
        <SkeletonLoaderLatestPost />
      )}
    </div>
  );
};

export default Home;
