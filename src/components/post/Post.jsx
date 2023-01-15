import { lazy } from "@loadable/component";
import Markdown from "markdown-to-jsx";
import { useContext, useEffect, useState } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import PostTitle from "../PostTitle/PostTitle";
import SkeletonLoaderPost from "../skeletonLoaderPost/SkeletonLoaderPost";
import Tag from "../tag/Tag";

const LazyNewCode = lazy(() => import("../newCode/NewCode"));
const LazyHeading = lazy(() => import("../heading/Heading"));
const LazyRoundedText = lazy(() => import("../roundedText/RoundedText"));
const LazyNormalText = lazy(() => import("../normalText/NormalText"));
const LazyImageTag = lazy(() => import("../imageTag/ImageTag"));
const LazyVideoTag = lazy(() => import("../videoTag/VideoTag"));
const LazyUrlTag = lazy(() => import("../urlTag/UrlTag"));

export const Post = ({ data }) => {
  const [postContent, setPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useContext(DarkModeProvider);

  const formatDate = (value) => {
    let date = value;
    const day = date.toLocaleString("default", { day: "2-digit" });
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.toLocaleString("default", { year: "numeric" });
    return `${day} ${month}, ${year}`;
  };

  useEffect(() => {
    fetch(data.mdURL)
      .then((response) => {
        return response.text();
      })
      .then((md) => {
        setPostContent(md);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {!isLoading ? (
        <article className="flex flex-col gap-5">
          <div className="flex flex-col">
            <div className="flex gap-3 md:gap-4 items-center pb-7">
              <img
                src={"./dp.jpeg"}
                alt="author"
                width={"120px"}
                height={"120px"}
                className="w-10 rounded-full"
                loading="lazy"
              />
              <div
                className={`text-sm md:text-base ${
                  isDarkMode ? "text-slate-500" : "text-white opacity-80"
                }`}
              >
                <h3>Prithijit Das</h3>
                <h3>Posted on: {formatDate(data.timeStamp)}</h3>
              </div>
            </div>
            <PostTitle data={data.title} />
            <div className="text-gray-400 flex gap-2 flex-wrap">
              {data.tags.map((tag) => {
                return <Tag data={tag} key={tag} />;
              })}
            </div>
          </div>
          <Markdown
            options={{
              overrides: {
                Syntax: { component: LazyNewCode },
                Heading: { component: LazyHeading },
                RoundedText: { component: LazyRoundedText },
                NormalText: { component: LazyNormalText },
                ImageTag: { component: LazyImageTag },
                VideoTag: { component: LazyVideoTag },
                UrlTag: {
                  component: LazyUrlTag,
                },
              },
            }}
          >
            {postContent}
          </Markdown>
        </article>
      ) : (
        <SkeletonLoaderPost />
      )}
    </>
  );
};
