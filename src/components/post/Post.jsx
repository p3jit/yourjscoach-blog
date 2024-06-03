import Markdown from "markdown-to-jsx";
import { useContext, useEffect, useState, lazy, Suspense } from "react";
import ProgressiveImage from "react-progressive-graceful-image";
import { useNavigate } from "react-router-dom";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import Heading from "../markdown-components/heading/Heading";
import NormalText from "../markdown-components/normalText/NormalText";
import PostTitle from "../PostTitle/PostTitle";
import RoundedText from "../markdown-components/roundedText/RoundedText";
import SkeletonLoaderPost from "../skeleton-loader-components/skeletonLoaderPost/SkeletonLoaderPost";
import UrlTag from "../markdown-components/urlTag/UrlTag";

const LazyCode = lazy(() => import("../markdown-components/newCode/NewCode"));
const LazyVideoTag = lazy(() =>
  import("../markdown-components/videoTag/VideoTag")
);
const LazyImageTag = lazy(() =>
  import("../markdown-components/imageTag/ImageTag")
);

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
    fetch(`${import.meta.env.VITE_API_URL}/assets/${data.mdFile}`)
      .then((response) => {
        return response.text();
      })
      .then((md) => {
        setPostContent(md);
        setIsLoading(false);
      })
      .catch((err) => {
        navigate("/404");
        console.log(err);
      });
  }, []);

  return (
    <>
      {!isLoading ? (
        <article className="flex flex-col gap-5 pt-[3vh] md:pt-[2vh]">
          <div className="flex flex-col">
            <PostTitle data={data.title} />
            <h3 className="text-center text-sm md:text-lg  text-zinc-400 pt-2">
              {formatDate(new Date(data.timeStamp))}
            </h3>
            <div className=" mt-5">
              {data.bannerImage ? (
                <ProgressiveImage
                  src={`${import.meta.env.VITE_API_URL}/assets/${
                    data.bannerImage
                  }?quality=70`}
                  placeholder={`${import.meta.env.VITE_API_URL}/assets/${
                    data.bannerImage
                  }?quality=1`}
                >
                  {(src, loading) => (
                    <img
                      rel="preload"
                      className={`${
                        loading ? "blur-[4px]" : "blur-none"
                      } delay-200 mb-2 mt-1 rounded-xl w-full h-[20rem] md:h-[25rem] lg:h-[30rem] respImage object-contain`}
                      src={src}
                      alt="an image"
                      width={"600"}
                      height={"300"}
                    />
                  )}
                </ProgressiveImage>
              ) : (
                ""
              )}
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
                  ImageTag: {
                    component: LazyImageTag,
                    props: { imageList: data.imageList },
                  },
                  VideoTag: {
                    component: LazyVideoTag,
                    props: { imageList: data.videoList },
                  },
                  UrlTag: {
                    component: UrlTag,
                  },
                },
              }}
            >
              {postContent}
            </Markdown>
          </Suspense>
          <hr className="bg-zinc-400" />
          <div className="flex flex-col justify-between pt-1">
            <div className="text-zinc-600 flex gap-2 flex-wrap">
              {data.tags.map((tag) => {
                return (
                  <span
                    className={`w-fit px-3 py-1 rounded-xl ${
                      isDarkMode ? "bg-zinc-200" : "bg-zinc-600 text-white"
                    }`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </article>
      ) : (
        <SkeletonLoaderPost />
      )}
    </>
  );
};
