import Markdown from "markdown-to-jsx";
import { useContext, useEffect, useState } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import Heading from "../heading/Heading";
import ImageTag from "../imageTag/ImageTag";
import NewCode from "../newCode/NewCode";
import NormalText from "../normalText/NormalText";
import PostTitle from "../PostTitle/PostTitle";
import RoundedText from "../roundedText/RoundedText";
import SkeletonLoaderPost from "../skeletonLoaderPost/SkeletonLoaderPost";
import Tag from "../tag/Tag";
import UrlTag from "../urlTag/UrlTag";
import VideoTag from "../videoTag/VideoTag";

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
              <picture pathset="./assets/">
                <img
                  sizes="(max-width: 100px) 100vw, 800px"
                  srcset="
                  dp_bbot2g_c_scale,w_200.jpg 200w,
                  dp_bbot2g_c_scale,w_200.jpg 487w,
                  dp_bbot2g_c_scale,w_200.jpg 611w,
                  dp_bbot2g_c_scale,w_200.jpg 773w,
                  dp_bbot2g_c_scale,w_200.jpg 00w"
                  src="dp_bbot2g_c_scale,w_200.jpg"
                  alt="author"
                  className="w-16 md:w-20 rounded-full"
                  width={"100px"}
                  height={"100px"}
                />
              </picture>
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
                Syntax: { component: NewCode },
                Heading: { component: Heading },
                RoundedText: { component: RoundedText },
                NormalText: { component: NormalText },
                ImageTag: { component: ImageTag },
                VideoTag: { component: VideoTag },
                UrlTag: {
                  component: UrlTag,
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
