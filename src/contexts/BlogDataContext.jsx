import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";

export const BlogDataProvider = createContext();

const BlogDataContext = ({ children }) => {
  // State management
  const [postData, setPostData] = useState([]);
  const [currentPost, setCurrentPost] = useState({});
  const [allPostData, setAllPostData] = useState([]);
  const [latestPostData, setLatestPostData] = useState([]);
  const [searchFilter, setSearchFilter] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [fetchedTags, setFetchedTags] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const [systemDesignProblems, setSystemDesignProbelms] = useState([]);

  const navigate = useNavigate();

  const searchPostsByQuery = (query) => {
    const result = postData.filter((post) => post.title.toLowerCase().includes(query) || post.tags.includes(query));

    result.sort((a, b) => b.createdAt - a.createdAt);

    setSearchData(result);
    setIsSearching(false);
  };

  // Debounce search for better performance
  const debouncedSearch = useDebounce(searchPostsByQuery, 1000);

  const filterPostsByTags = () => {
    if (!searchFilter.length) {
      return postData.slice().sort((a, b) => b.createdAt - a.createdAt);
    }

    return postData.filter((post) => post.tags.some((tag) => searchFilter.includes(tag)));
  };

  const fetchPostsAndTags = async () => {
    try {
      const query = `
      query Posts {
        posts {
          askedIn
          createdAt
          description
          difficulty
          documentId
          minRead
          tags
          title
          bannerImage
          identifier
          category
        }
      }
    `;

      const response = await fetch("http://localhost:1339/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query }),
      });

      let { data } = await response.json();
      data = data.posts;
      setAllPostData(data);
      const sdProblems = data.filter((a) => a.category === "sd");
      data = data.filter((a) => a.category === "post");
      setSystemDesignProbelms([...sdProblems]);

      // Set all posts data
      setPostData(data);

      // Sort posts by createdAt, newest first
      const sortedPosts = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Set latest posts (up to 2)
      setLatestPostData(sortedPosts.slice(0, Math.min(2, sortedPosts.length)));

      // Set initial search data
      setSearchData(sortedPosts);

      // Extract unique tags from all posts
      const tagSet = new Set();
      data.forEach((post) => {
        post.tags.forEach((tag) => tagSet.add(tag));
      });

      setFetchedTags([...tagSet]);
      setIsSearching(false);
    } catch (error) {
      console.error("Failed to fetch blog data:", error);
      navigate("/404");
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchPostsAndTags();
  }, []);

  // Update search results when filters change
  useEffect(() => {
    if (!postData.length) return;

    const filteredPosts = filterPostsByTags();
    setSearchData(filteredPosts);
  }, [searchFilter, postData]);

  // Context value with all data and functions
  const contextValue = {
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
    systemDesignProblems,
    setSystemDesignProbelms,
    allPostData,
    setAllPostData,
    currentPost,
    setCurrentPost
  };

  return <BlogDataProvider.Provider value={contextValue}>{children}</BlogDataProvider.Provider>;
};

export default BlogDataContext;
