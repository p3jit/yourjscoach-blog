import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../components/post/Post";
import { PostDataProvider } from "../contexts/PostDataContext";
import SkeletonLoaderPost from "../components/skeleton-loader-components/skeletonLoaderPost/SkeletonLoaderPost";

/**
 * PostContent component displays the post content or skeleton loader
 */
const PostContent = ({ post, isLoading }) => {
  if (isLoading) {
    return <SkeletonLoaderPost aria-label="Loading post content" />;
  }
  
  return <Post data={post} />;
};

/**
 * SinglePost page component that displays a single blog post
 * based on the URL parameter
 */
const SinglePost = () => {
  const { postData } = useContext(PostDataProvider);
  const [currPost, setCurrPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Find the post based on URL parameters
  useEffect(() => {
    const pathName = location.pathname.split("/")[2];
    
    if (postData?.length) {
      setIsLoading(true);
      
      const foundPostData = postData.find(
        (elem) => elem.displayId === pathName
      );
      
      if (foundPostData) {
        setCurrPost(foundPostData);
      } else {
        navigate("/404");
      }
      
      setIsLoading(false);
    }
  }, [postData, navigate]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="single-post-container">
      <PostContent post={currPost} isLoading={isLoading || !currPost} />
    </main>
  );
};

export default SinglePost;
