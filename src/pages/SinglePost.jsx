import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../components/post/Post";
import SkeletonLoaderPost from "../components/skeletonLoaderPost/SkeletonLoaderPost";
import { PostDataProvider } from "../contexts/PostDataContext";

const SinglePost = () => {
  const { postData } = useContext(PostDataProvider);
  const [currPost, setCurrPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const pathName = location.pathname.split("/")[1];
    if (postData.length) {
      const foundPostData = postData.find(
        (elem) => elem.displayId === pathName
      );
      if (foundPostData) {
        setCurrPost(foundPostData);
      } else {
        navigate("/404");
      }
    }
  }, [postData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <>{currPost ? <Post data={currPost} /> : <SkeletonLoaderPost />}</>;
};

export default SinglePost;
