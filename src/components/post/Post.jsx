import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { Code } from "../code/Code";
import { Heading } from "../heading/Heading";
import ImageTag from "../imageTag/ImageTag";
import NormalText from "../normalText/NormalText";
import PostTitle from "../PostTitle/PostTitle";
import { RoundedText } from "../roundedText/RoundedText";
import SkeletonLoaderPost from "../skeletonLoaderPost/SkeletonLoaderPost";
import Tag from "../tag/Tag";
import VideoTag from "../videoTag/VideoTag";

export const Post = ({ data }) => {
  const [postContent, setPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
          <div className="flex flex-col gap-1">
            <PostTitle data={data.title} />
            <div className="text-sm text-gray-400 flex gap-2 flex-wrap">
              {data.tags.map((tag) => {
                return <Tag data={tag} key={tag} />;
              })}
            </div>
          </div>
          <Markdown
            options={{
              overrides: {
                Syntax: { component: Code },
                Heading: { component: Heading },
                RoundedText: { component: RoundedText },
                NormalText: { component: NormalText },
                ImageTag: { component: ImageTag },
                VideoTag: { component: VideoTag },
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
