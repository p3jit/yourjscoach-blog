import { IconBrandJavascript } from "@tabler/icons";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { DarkModeProvider } from "../contexts/DarkModeContext";

// Brand component for logo and title
const Brand = ({ isDarkMode }) => (
  <div className="flex items-center gap-2">
    <IconBrandJavascript
      size={"3em"}
      stroke={"2"}
      className={`${isDarkMode ? "text-zinc-800" : "text-white"}`}
    />
    <h1
      className={`cursor-pointer font-extrabold text-3xl md:text-3xl lg:text-4xl ${
        isDarkMode ? "text-zinc-800" : "text-white"
      }`}
    >
      YourJsCoach
    </h1>
  </div>
);

// Navigation component for links
const Navigation = () => (
  <div className="flex md:flex-col gap-2">
    <Link
      to={`/blog`}
      className="inline-block rounded bg-zinc-300 hover:bg-zinc-400 text-zinc-900 px-4 py-2 text-sm font-bold w-fit"
    >
      Blog
    </Link>
    <Link
      to={`/dsa`}
      className="inline-block rounded bg-zinc-300 hover:bg-zinc-400 text-zinc-900 px-4 py-2 text-sm font-bold w-fit"
    >
      Dsa Questions
    </Link>
  </div>
);

// Main content component
const Content = ({ isDarkMode }) => (
  <div className="flex flex-col gap-2">
    <Brand isDarkMode={isDarkMode} />

    <h2 className="text-xl font-bold text-zinc-400">
      Your one stop solution for cracking interviews and practice javascript
      questions
    </h2>
    <h2 className="text-lg font-bold text-zinc-400 pt-6">Explore:</h2>
    <Navigation />
  </div>
);

const Home = () => {
  const { isDarkMode } = useContext(DarkModeProvider);
  
  return (
    <section className="flex flex-col-reverse md:flex-row items-center my-auto w-full lg:w-[70rem] gap-10 md:gap-0" aria-labelledby="home-heading">
      <Content isDarkMode={isDarkMode} />
      <ReactSVG src="/website-creator-animate.svg" className="w-full" aria-label="Website creator illustration" />
    </section>
  );
};

export default Home;
