import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";

/**
 * Context for managing blog post data across the application
 */
export const PostDataProvider = createContext();

/**
 * PostDataContext component that provides post data and search functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The PostDataProvider context provider
 */
const PostDataContext = ({ children }) => {
  // State management
  const [postData, setPostData] = useState([]);
  const [latestPostData, setLatestPostData] = useState([]);
  const [searchFilter, setSearchFilter] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [fetchedTags, setFetchedTags] = useState([]);
  const [isSearching, setIsSearching] = useState(true);

  const navigate = useNavigate();

  /**
   * Filter posts by search query (title or tags)
   * @param {string} query - Search query string
   */
  const searchPostsByQuery = (query) => {
    const result = postData.filter((post) => post.title.toLowerCase().includes(query) || post.tags.includes(query));

    // Sort by timestamp, newest first
    result.sort((a, b) => b.timeStamp - a.timeStamp);

    setSearchData(result);
    setIsSearching(false);
  };

  // Debounce search for better performance
  const debouncedSearch = useDebounce(searchPostsByQuery, 1000);

  /**
   * Filter posts by selected tags
   * @returns {Array} Filtered posts
   */
  const filterPostsByTags = () => {
    if (!searchFilter.length) {
      return postData.slice().sort((a, b) => b.timeStamp - a.timeStamp);
    }

    return postData.filter((post) => post.tags.some((tag) => searchFilter.includes(tag)));
  };

  /**
   * Fetch posts and extract tags from the data
   */
  const fetchPostsAndTags = async () => {
    try {
      const response = await fetch(`/data/blogs.json`);
      const { data } = await response.json();

      // Set all posts data
      setPostData(data);

      // Sort posts by timestamp, newest first
      const sortedPosts = [...data].sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

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
  };

  return <PostDataProvider.Provider value={contextValue}>{children}</PostDataProvider.Provider>;
};

export default PostDataContext;
