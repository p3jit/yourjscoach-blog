import React, { createContext, useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import useDebounce from "../hooks/useDebounce";

export const PostDataProvider = createContext();

const PostDataContext = ({ children }) => {
  const [postData, setPostData] = useState([]);
  const [latestPostData, setlatestPostData] = useState([]);
  const [searchFilter, setSearchFilter] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [fetchedTags, setFetchedTags] = useState([]);

  const fetchPostData = async () => {
    const value = [];
    const querySnapshot = await getDocs(collection(db, "post"));
    querySnapshot.forEach((doc) => {
      value.push(doc.data());
    });
    await setPostData(value);
    let sortedValue = new Array(...value);
    sortedValue.sort((a, b) => b.timeStamp - a.timeStamp).slice(0, 2);
    await setlatestPostData([sortedValue[0], sortedValue[1]]);
    await setSearchData(sortedValue);
  };

  const fetchTagsData = async () => {
    const value = [];
    const querySnapshot = await getDocs(collection(db, "tags"));
    querySnapshot.forEach((doc) => {
      value.push(doc.data());
    });
    await setFetchedTags(value[0].tags);
  };

  const normalSearch = (query) => {
    if (!query.length) return;
    let result = postData.filter((singlePost) => {
      console.log(singlePost.tags.join("-"));
      return (
        singlePost.title.toLowerCase().includes(query) ||
        singlePost.tags.includes(query)
      );
    });
    result.sort((a, b) => b.timeStamp - a.timeStamp);
    if (searchFilter.length) {
    }
    setSearchData(result);
  };

  const debouncedSearch = useDebounce(normalSearch, 1000);

  useEffect(() => {
    fetchPostData();
    fetchTagsData();
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
      }}
    >
      {children}
    </PostDataProvider.Provider>
  );
};

export default PostDataContext;
