import Markdown from "markdown-to-jsx";
import { useContext, useEffect, useState, lazy, Suspense } from "react";
import ProgressiveImage from "react-progressive-graceful-image";
import { useNavigate } from "react-router-dom";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import Heading from "../heading/Heading";
import NormalText from "../normalText/NormalText";
import PostTitle from "../PostTitle/PostTitle";
import RoundedText from "../roundedText/RoundedText";
import SkeletonLoaderPost from "../skeletonLoaderPost/SkeletonLoaderPost";
import Tag from "../tag/Tag";
import UrlTag from "../urlTag/UrlTag";

const LazyCode = lazy(() => import("../newCode/NewCode"));
const LazyVideoTag = lazy(() => import("../videoTag/VideoTag"));
const LazyImageTag = lazy(() => import("../imageTag/ImageTag"));

export const Post = ({ data }) => {
  const [postContent, setPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useContext(DarkModeProvider);
  const navigate = useNavigate();
  const formatDate = (value) => {
    let date = value;
    const day = date.toLocaleString("default", { day: "2-digit" });
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.toLocaleString("default", { year: "numeric" });
    return `${day} ${month}, ${year}`;
  };

  useEffect(() => {
    fetch(data.mdFile.url)
      .then((response) => {
        return response.text();
      })
      .then((md) => {
        setPostContent(md);
        setIsLoading(false);
      })
      .catch((err) => {
        navigate("/404");
      });
  }, []);

  return (
    <>
      {!isLoading ? (
        <article className="flex flex-col gap-5 pt-[3vh] md:pt-[2vh]">
          <div className="flex flex-col">
            <PostTitle data={data.title} />
            <h3 className="text-center text-sm md:text-lg  text-slate-400 pt-2 pb-5 capitalize">
              {formatDate(new Date(data.timeStamp)) +
                " || Written By -  Prithijit Das"}
            </h3>
            <div>
              {data.bannerImage ? (
                <ProgressiveImage
                  src={data.bannerImage.highQuality.url}
                  placeholder={data.bannerImage.lowQuality.url}
                >
                  {(src, loading) => (
                    <img
                      rel="prefetch"
                      className={`${
                        loading ? "blur-[4px]" : "blur-none"
                      } transition-all delay-1000 mb-7 mt-1 rounded-xl w-full h-[20rem] md:h-[25rem] lg:h-[30rem] object-cover`}
                      src={src}
                      alt="an image"
                      width={"100px"}
                      height={"100px"}
                    />
                  )}
                </ProgressiveImage>
              ) : (
                ""
              )}
            </div>
            <div className="text-gray-400 flex gap-2 flex-wrap">
              {data.tags.map((tag) => {
                return <Tag data={tag} key={tag} />;
              })}
            </div>
          </div>
          <Suspense>
            <Markdown
              options={{
                overrides: {
                  Syntax: { component: LazyCode },
                  Heading: { component: Heading },
                  RoundedText: { component: RoundedText },
                  NormalText: { component: NormalText },
                  ImageTag: { component: LazyImageTag },
                  VideoTag: { component: LazyVideoTag },
                  UrlTag: {
                    component: UrlTag,
                  },
                },
              }}
            >
              {postContent}
            </Markdown>
          </Suspense>
        </article>
      ) : (
        <SkeletonLoaderPost />
      )}
    </>
  );
};
