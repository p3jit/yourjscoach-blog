import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";

export const PostDataProvider = createContext();
// const ENV_VITE_API_URL = import.meta.env.VITE_API_URL;

const PostDataContext = ({ children }) => {
  const [postData, setPostData] = useState([]);
  const [latestPostData, setlatestPostData] = useState([]);
  const [searchFilter, setSearchFilter] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [fetchedTags, setFetchedTags] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const navigate = useNavigate();

  const normalSearch = (query) => {
    let result = postData.filter((singlePost) => {
      return singlePost.title.toLowerCase().includes(query) || singlePost.tags.includes(query);
    });
    result.sort((a, b) => b.timeStamp - a.timeStamp);
    if (searchFilter.length) {
    }
    setSearchData(result);
    setIsSearching(false);
  };

  const debouncedSearch = useDebounce(normalSearch, 1000);

  const newFetchPostsandTags = async () => {
    const { data } =  await (await fetch(`/data/blogs.json`)).json();

    //Filling the posts
    await setPostData(data);
    let sortedValue = new Array(...data);
    sortedValue.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)).slice(0, 2);
    if (sortedValue.length == 1) {
      await setlatestPostData([sortedValue[0]]);
    } else {
      await setlatestPostData([sortedValue[0], sortedValue[1]]);
    }
    await setSearchData(sortedValue);

    // Filling the tags
    let tagSet = new Set();
    data.forEach((singlePost) => {
      singlePost.tags.forEach((singleTag) => {
        tagSet.add(singleTag);
      });
    });
    await setFetchedTags(new Array(...tagSet));
    setIsSearching(false);
  };

  useEffect(() => {
    try {
      newFetchPostsandTags();
    } catch (err) {
      navigate("/404");
    }
  }, []);

  const includeFilters = async () => {
    let result = [];
    for (let i = 0; i < postData.length; i++) {
      let flag = false;
      for (let j = 0; j < searchFilter.length; j++) {
        if (postData[i].tags.includes(searchFilter[j])) flag = true;
      }
      if (flag) {
        result.push(postData[i]);
      }
    }
    return result;
  };

  useEffect(() => {
    if (!postData.length) return;
    async function triggerSearch() {
      let ans = await includeFilters();
      if (ans.length) {
        setSearchData([...ans]);
      } else if (!ans.length && searchFilter.length) {
        setSearchData([]);
      } else {
        setSearchData(postData.sort((a, b) => b.timeStamp - a.timeStamp));
      }
    }
    triggerSearch();
  }, [searchFilter]);

  return (
    <PostDataProvider.Provider
      value={{
        postData,
        latestPostData,
        searchFilter,
        setSearchFilter,
        debouncedSearch,
        searchData,
        setSearchData,
        fetchedTags,
        isSearching,
        setIsSearching,
      }}
    >
      {children}
    </PostDataProvider.Provider>
  );
};

export default PostDataContext;
