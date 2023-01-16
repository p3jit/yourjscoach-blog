import React, { createContext, useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

export const PostDataProvider = createContext();

const PostDataContext = ({ children }) => {
  const [postData, setPostData] = useState([]);
  const [latestPostData, setlatestPostData] = useState([]);
  const [searchFilter, setSearchFilter] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [fetchedTags, setFetchedTags] = useState([]);
  const [isSearching, setIsSearching] = useState(true);

  const fetchPostData = async () => {
    const value = [];

    //dynamic imports
    const { collection, getDocs, getFirestore } = await import(
      "firebase/firestore"
    );
    const { initializeApp } = await import("firebase/app");
    const { firebaseConfig } = await import("../firebase");
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const querySnapshot = await getDocs(collection(db, "post"));
    querySnapshot.forEach((doc) => {
      let currData = doc.data();
      currData.timeStamp = new Date(currData.timeStamp.seconds * 1000);
      value.push(currData);
    });
    await setPostData(value);
    let sortedValue = new Array(...value);
    sortedValue.sort((a, b) => b.timeStamp - a.timeStamp).slice(0, 2);
    await setlatestPostData([sortedValue[0], sortedValue[1]]);
    await setSearchData(sortedValue);
  };

  const fetchTagsData = async () => {
    const value = [];

    //dynamic imports
    const { collection, getDocs, getFirestore } = await import(
      "firebase/firestore"
    );
    const { initializeApp } = await import("firebase/app");
    const { firebaseConfig } = await import("../firebase");
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const querySnapshot = await getDocs(collection(db, "tags"));
    querySnapshot.forEach((doc) => {
      value.push(doc.data());
    });
    await setFetchedTags(value[0].tags);
    setIsSearching(false);
  };

  const normalSearch = (query) => {
    let result = postData.filter((singlePost) => {
      return (
        singlePost.title.toLowerCase().includes(query) ||
        singlePost.tags.includes(query)
      );
    });
    result.sort((a, b) => b.timeStamp - a.timeStamp);
    if (searchFilter.length) {
    }
    setSearchData(result);
    setIsSearching(false);
  };

  const debouncedSearch = useDebounce(normalSearch, 1000);

  useEffect(() => {
    try {
      fetchPostData();
      fetchTagsData();
    } catch (err) {
      console.log(err);
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
