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
        <article className="flex flex-col gap-5">
          <div className="flex flex-col">
            <div className="flex gap-3 md:gap-4 items-center pb-7">
              <picture pathset="/assets/">
                <img
                  sizes="(max-width: 100px) 100vw, 800px"
                  srcSet="
                  dp_bbot2g_c_scale,w_200.jpg 200w,
                  dp_bbot2g_c_scale,w_200.jpg 487w,
                  dp_bbot2g_c_scale,w_200.jpg 611w,
                  dp_bbot2g_c_scale,w_200.jpg 773w,
                  dp_bbot2g_c_scale,w_200.jpg 800w"
                  src="dp_bbot2g_c_scale,w_200.jpg"
                  alt="author"
                  className="w-16 rounded-full"
                  width={"100px"}
                  height={"100px"}
                />
              </picture>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-slate-500" : "text-white opacity-80"
                }`}
              >
                <h3>Prithijit Das</h3>
                <h3>Posted on: {formatDate(new Date(data.timeStamp))}</h3>
              </div>
            </div>
            <div className="">
              {data.bannerImage ? (
                <ProgressiveImage
                  src={data.bannerImage.highQuality.url}
                  placeholder={data.bannerImage.lowQuality.url}
                >
                  {(src, loading) => (
                    <img
                      className={`${
                        loading ? "blur-sm" : "blur-none"
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
            <PostTitle data={data.title} />
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
