import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../components/post/Post";
import { BlogDataProvider } from "../contexts/BlogDataContext";
import SkeletonLoaderPost from "../components/skeleton-loader-components/skeletonLoaderPost/SkeletonLoaderPost";


const PostContent = ({ post, isLoading }) => {
  if (isLoading) {
    return <SkeletonLoaderPost aria-label="Loading post content" />;
  }
  
  return <Post data={post} />;
};

const SinglePost = () => {
  const { postData, allPostData } = useContext(BlogDataProvider);
  const [currPost, setCurrPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Find the post based on URL parameters
  useEffect(() => {
    const pathName = location.pathname.split("/")[2];
    
    if (allPostData?.length) {
      setIsLoading(true);
      
      const foundPostData = allPostData.find(
        (elem) => elem.documentId === pathName
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
