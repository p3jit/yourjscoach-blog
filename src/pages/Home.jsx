import { IconBrandJavascript } from "@tabler/icons";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { DarkModeProvider } from "../contexts/DarkModeContext";

const Home = () => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div className="flex flex-col-reverse md:flex-row items-center my-auto w-full lg:w-[70rem] gap-10 md:gap-0">
      <div className="flex flex-col gap-4 md:w-5/12">
        <div className="flex items-center gap-2">
          {" "}
          <IconBrandJavascript
            size={"3em"}
            stroke={"2"}
            className={` ${isDarkMode ? "text-gray-800" : "text-white"}`}
          />
          <h1
            className={`font-extrabold text-4xl md:text-4xl lg:text-5xl ${
              isDarkMode ? "text-gray-800" : "text-white"
            }`}
          >
            YourJsCoach
          </h1>
        </div>
        <h2
          className={`text-lg lg:text-xl font-semibold md:pt-2 leading-snug ${
            !isDarkMode ? "text-slate-300 " : "text-slate-500"
          }`}
        >
          Harness the power of JavaScript, unleash your coding potential, and
          embark on a transformative learning journey with our curated problems
          that will help your clear your next interviews
        </h2>
        <h2
          className={`text-lg font-bold pt-3 ${
            !isDarkMode ? "text-slate-300 " : "text-slate-500"
          }`}
        >
          Explore:
        </h2>
        <div className="flex gap-2 flex-wrap">
          <Link
            to={`/blog`}
            className="rounded bg-slate-300 hover:bg-slate-400 text-gray-900 px-4 py-2 text-base font-bold w-fit"
          >
            Blog
          </Link>
          <Link
            to={`/dsa-questions`}
            className="rounded bg-slate-300 hover:bg-slate-400 text-gray-900 px-4 py-2 text-base font-bold w-fit"
          >
            Dsa questions
          </Link>
        </div>
      </div>
      <ReactSVG src="/website-creator-animate.svg" className="w-96 md:w-7/12" />
    </div>
  );
};

export default Home;
