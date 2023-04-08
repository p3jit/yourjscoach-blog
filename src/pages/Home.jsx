import { IconBrandJavascript } from "@tabler/icons";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { DarkModeProvider } from "../contexts/DarkModeContext";

const Home = () => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div className="flex flex-col-reverse md:flex-row items-center my-auto w-full lg:w-[70rem] gap-10 md:gap-0">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {" "}
          <IconBrandJavascript
            size={"3em"}
            stroke={"2"}
            className={` ${isDarkMode ? "text-gray-800" : "text-white"}`}
          />
          <h1
            className={`cursor-pointer font-extrabold text-3xl md:text-3xl lg:text-4xl ${
              isDarkMode ? "text-gray-800" : "text-white"
            }`}
          >
            YourJsCoach
          </h1>
        </div>

        <h2 className="text-xl font-bold text-gray-400 ">
          Your one stop solution for cracking interviews and practice javascript
          questions
        </h2>
        <h2 className="text-lg font-bold text-gray-400 pt-6">Explore:</h2>
        <div className="flex md:flex-col gap-2">
          <Link
            to={`/blog`}
            className="inline-block rounded bg-slate-300 hover:bg-slate-400 text-gray-900 px-4 py-2 text-sm font-semibold w-fit"
          >
            Blog
          </Link>
          <Link
            to={`/dsa`}
            className="inline-block rounded bg-slate-300 hover:bg-slate-400 text-gray-900 px-4 py-2 text-sm font-semibold w-fit"
          >
            Dsa Questions
          </Link>
        </div>
      </div>
      <ReactSVG src="/website-creator-animate.svg" className="w-full" />
    </div>
  );
};

export default Home;
