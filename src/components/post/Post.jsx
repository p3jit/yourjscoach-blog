import Markdown from "markdown-to-jsx";
import React, { useContext, useEffect, useState, lazy, Suspense, Fragment, useRef } from "react";
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
import { LocalStorageProvider } from "../../contexts/localStorageContext";
import TableOfContents from "./TableOfContents";
import Mermaid from "../markdown-components/mermaid/Mermaid";
import { returnColor, returnDifficultyText } from "../../utils/utils";
import { BlogDataProvider } from "../../contexts/BlogDataContext";

// Lazy-loaded components to improve initial performance
const LazyComponents = {
  Code: lazy(() => import("../markdown-components/newCode/NewCode")),
  VideoTag: lazy(() => import("../markdown-components/videoTag/VideoTag")),
  ImageTag: lazy(() => import("../markdown-components/imageTag/ImageTag")),
};

// Environment variable for API URL
// const ENV_VITE_API_URL = import.meta.env.VITE_API_URL;
const ENV_VITE_API_URL = false;

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

const PostHeader = ({ data, setSolvedProblems, solvedProblems, updateLocalStorage }) => {
  const currentId = data.documentId;
  const isSolved = solvedProblems.includes(currentId);

  const handleUpdateSolved = () => {
    let updatedSolvedProblems = [];
    if (isSolved) {
      updatedSolvedProblems = solvedProblems.filter((_) => _.documentId == currentId);
      setSolvedProblems(updatedSolvedProblems);
    } else {
      debugger;
      updatedSolvedProblems = [...solvedProblems, currentId];
      setSolvedProblems(updatedSolvedProblems);
    }
    updateLocalStorage({ solvedProblems: [...updatedSolvedProblems] });
  };

  return (
    <div>
      <div className="flex flex-col gap-6 bg-zinc-800 p-10 mb-16 rounded-2xl shadow-xl border border-zinc-700">
        <div className="flex justify-between">
          <h5 className="text-zinc-400  font-medium">
            {data.category == "sd" ? "System Design & Architecture" : "Blog Post"}
          </h5>
          <span className="flex gap-2 justify-center items-center text-center">
            <IconCalendarDue className="w-4 text-zinc-500" />
            <h3
              className=" text-zinc-400 font-medium text-sm"
              aria-label={`Published on ${formatDate(new Date(data.createdAt))}`}
            >
              {formatDate(new Date(data.createdAt))}
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
                {`${data.minRead} Min Read`}
              </h3>
            </span>
            {data.difficulty && data.category == "sd" && (
              <span className="flex gap-2 justify-center items-center text-center">
                <IconFlame className="w-5 text-zinc-500" />
                <h3 className={` ${returnColor(Number(data.difficulty))}`} aria-label={`Difficulty`}>
                  {returnDifficultyText(Number(data.difficulty))}
                </h3>
              </span>
            )}
          </div>
        </div>
        <hr className="h-px pt-0.5 bg-zinc-700 border-0 mt-2"></hr>
        <div className="flex justify-between">
          <div className="flex justify-center items-center">
            <TagList tags={data.tags} isDarkMode={false} />
          </div>
        </div>
      </div>
      <BannerImage data={data} />
    </div>
  );
};

const BannerImage = ({ data }) => {
  if (!data.bannerImage || !data.bannerImage.length > 0) return null;
  const imagePath = data.bannerImage;

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

function SyntaxHighlightedCode(props) {
  if (props?.className?.includes("lang-mermaid")) {
    return (
      <>
        <Mermaid chartDefinition={props.children} />
      </>
    );
  }

  if (props?.className?.includes("lang-iframe")) {
    return (
      <>
        <iframe className="w-full h-[70vh]" srcDoc={props.children} />
      </>
    );
  }

  const ref = useRef();

  React.useEffect(() => {
    if (ref.current && window.hljs) {
      window.hljs.highlightElement(ref.current);

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const PostContent = ({ content, data }) => {
  return (
    <div className={`flex gap-8 w-full ${data.bannerImage ? "pt-24" : ""}`}>
      <div className="prose prose-hr:border-zinc-700 prose-lg border-zinc-400 prose-zincDark w-full">
        <Markdown
          options={{
            wrapper: Fragment,
            overrides: {
              code: { component: SyntaxHighlightedCode },
              Syntax: { component: LazyComponents.Code },
              h1: {
                component: (props) => <Heading level={1} {...props} />,
              },
              h2: {
                component: (props) => <Heading level={2} {...props} />,
              },
              h3: {
                component: (props) => <Heading level={3} {...props} />,
              },
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
      </div>
    </div>
  );
};

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
  const { setCurrentPost } = useContext(BlogDataProvider);
  const { setSolvedProblems, solvedProblems, updateLocalStorage } = useContext(LocalStorageProvider);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUrl = !ENV_VITE_API_URL
      ? `http://localhost:1339/api/posts/${data.documentId}`
      : `${ENV_VITE_API_URL}/api/posts/${data.documentId}`;

    fetch(fetchUrl)
      .then((response) => response.json())
      .then((md) => {
        setCurrentPost(md.data);
        setPostContent(md.data.mdFile);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load post content:", err);
        navigate("/404");
      });
    setPostContent(data.mdFile);
    setIsLoading(false);
  }, [data.mdFile, navigate]);

  if (isLoading) return <SkeletonLoaderPost />;

  return (
    <article className="flex flex-col gap-3 py-[1vh] w-full">
      <PostHeader
        data={data}
        setSolvedProblems={setSolvedProblems}
        solvedProblems={solvedProblems}
        updateLocalStorage={updateLocalStorage}
      />

      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Main content */}
        <div className={`w-full ${data.isProblem ? "lg:max-w-3xl" : ""}`}>
          <PostContent content={postContent} data={data} />
          {data.askedIn && (
            <>
              <hr className="bg-zinc-800 h-0.5 outline-none border-none my-4" />
              <TagList tags={data.askedIn} isDarkMode={false} />
            </>
          )}
        </div>

        {/* Table of Contents - Only visible on lg screens and up */}
        {data.isProblem && (
          <div className="hidden lg:block w-80 flex-shrink-0">
            <TableOfContents />
          </div>
        )}
      </div>
    </article>
  );
};
