import Markdown from "markdown-to-jsx";
import { useContext, useEffect, useState, lazy, Suspense } from "react";
import ProgressiveImage from "react-progressive-graceful-image";
import { useNavigate } from "react-router-dom";
import { IconClockHour3, IconCalendarDue, IconFlame, IconCircleCheck, IconCircle } from "@tabler/icons";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import Heading from "../markdown-components/heading/Heading";
import NormalText from "../markdown-components/normalText/NormalText";
import PostTitle from "../PostTitle/PostTitle";
import RoundedText from "../markdown-components/roundedText/RoundedText";
import SkeletonLoaderPost from "../skeleton-loader-components/skeletonLoaderPost/SkeletonLoaderPost";
import UrlTag from "../markdown-components/urlTag/UrlTag";

// Lazy-loaded components to improve initial performance
const LazyComponents = {
  Code: lazy(() => import("../markdown-components/newCode/NewCode")),
  VideoTag: lazy(() => import("../markdown-components/videoTag/VideoTag")),
  ImageTag: lazy(() => import("../markdown-components/imageTag/ImageTag")),
};

// Environment variable for API URL
const ENV_VITE_API_URL = import.meta.env.VITE_API_URL;

const formatDate = (value) => {
  const date = value;
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.toLocaleString("default", { year: "numeric" });
  return `${day} ${month}, ${year}`;
};

const Avatar = ({ userName = "Prithijit Das", userDesignation = "Software Engineer" }) => {
  return (
    <div className="flex gap-5 justify-center">
      <img src="../dp.jpg" alt="User Avatar" className="w-12 rounded-full" />
      <div className="user-info flex flex-col  font-semibold  justify-center">
        <span className="text-zinc-300">{userName}</span>
        <span className="text-zinc-500">{userDesignation}</span>
      </div>
    </div>
  );
};

const PostHeader = ({ data }) => (
  <div>
    <div className="flex flex-col gap-6 bg-zinc-800 p-10 rounded-2xl shadow-xl border border-zinc-700">
      <div className="flex justify-between">
        <h5 className="text-zinc-400  font-medium">System Design & Architecture</h5>
        <span className="flex gap-2 justify-center items-center text-center">
          <IconCalendarDue className="w-4 text-zinc-500" />
          <h3
            className=" text-zinc-400 font-medium text-sm"
            aria-label={`Published on ${formatDate(new Date(data.timeStamp))}`}
          >
            {formatDate(new Date(data.timeStamp))}
          </h3>
        </span>
      </div>
      <PostTitle data={data.title} />
      <div className="flex justify-between text-sm">
        <Avatar />
        <div className="flex gap-5">
          <span className="flex gap-2 justify-center items-center text-center">
            <IconClockHour3 className="w-5 text-zinc-500" />
            <h3 className="text-zinc-400" aria-label={`Time`}>
              {`5 Min Read`}
            </h3>
          </span>
          <span className="flex gap-2 justify-center items-center text-center">
            <IconFlame className="w-5 text-zinc-500" />
            <h3 className=" text-yellow-400" aria-label={`Difficulty`}>
              {"Medium"}
            </h3>
          </span>
        </div>
      </div>
      <hr className="h-px pt-0.5 bg-zinc-700 border-0 mt-2"></hr>
      <div className="flex justify-between">
        <div className="flex justify-center items-center">
          <TagList tags={data.tags} isDarkMode={false} />
        </div>
        <button className={`text-sm ${data.solved ? "bg-emerald-700" : "bg-zinc-600"} text-zinc-100  py-2 px-3 rounded-md flex justify-center items-center gap-2`}>
          {data.solved ? <><IconCircleCheck className="w-5"/> Complete</> : <><IconCircle className="w-5"/> Mark Complete</> }
        </button>
      </div>
    </div>
    <BannerImage data={data} />
  </div>
);

const BannerImage = ({ data }) => {
  if (!data.bannerImage) return null;

  const imagePath = `/images/${data.identifier}/${data.identifier}_banner.png`;

  return (
    <div className="mt-5">
      <ProgressiveImage src={imagePath} placeholder={imagePath}>
        {(src, loading) => (
          <img
            rel="preload"
            className={`${
              loading ? "blur-[4px]" : "blur-none"
            } delay-200 mb-2 mt-1 rounded-xl w-full h-[20rem] md:h-[25rem] lg:h-[30rem] respImage object-contain`}
            src={src}
            alt={`Banner image for ${data.title}`}
            width="600"
            height="300"
          />
        )}
      </ProgressiveImage>
    </div>
  );
};

const PostContent = ({ content, data }) => (
  <Suspense>
    <Markdown
      options={{
        overrides: {
          Syntax: { component: LazyComponents.Code },
          Heading: { component: Heading },
          RoundedText: { component: RoundedText },
          NormalText: { component: NormalText },
          ImageTag: {
            component: LazyComponents.ImageTag,
            props: { imageList: data.imageList },
          },
          VideoTag: {
            component: LazyComponents.VideoTag,
            props: { imageList: data.videoList },
          },
          UrlTag: {
            component: UrlTag,
          },
        },
      }}
    >
      {content}
    </Markdown>
  </Suspense>
);

const TagList = ({ tags }) => (
  <div className="flex flex-col justify-between pt-1">
    <div className="text-zinc-600 flex gap-2 flex-wrap" aria-label="Post tags">
      {tags.map((tag, index) => (
        <span key={index} className={`px-3.5 py-1.5 text-sm rounded-md bg-zinc-700 text-zinc-300`}>
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export const Post = ({ data }) => {
  const [postContent, setPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useContext(DarkModeProvider);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUrl = !ENV_VITE_API_URL
      ? `../${"mdFiles/" + data.mdFile + ".md"}`
      : `${ENV_VITE_API_URL}/assets/${data.mdFile}`;

    fetch(fetchUrl)
      .then((response) => response.text())
      .then((md) => {
        setPostContent(md);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load post content:", err);
        navigate("/404");
      });
  }, [data.mdFile, navigate]);

  if (isLoading) return <SkeletonLoaderPost />;

  return (
    <article className="flex flex-col gap-3 py-[5vh]">
      <PostHeader data={data} />
      <PostContent content={postContent} data={data} />
      {data.askedIn && (
        <>
          <hr className="bg-zinc-800 h-0.5 outline-none border-none mb-4" />
          <TagList tags={data.askedIn} isDarkMode={false} />
        </>
      )}
    </article>
  );
};
