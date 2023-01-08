import React, { useContext } from "react";
import { TbError404 } from "react-icons/tb";
import { Link } from "react-router-dom";
import { DarkModeProvider } from "../contexts/DarkModeContext";

const Error = () => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div className="h-[86vh] w-full flex justify-center items-center flex-col">
      <TbError404
        className={`text-9xl ${!isDarkMode ? "text-white" : "text-slate-800"}`}
      />
      <p
        className={`font-medium text-2xl ${
          !isDarkMode ? "text-white" : "text-slate-800"
        }`}
      >
        Oops! You are in the worng place.
      </p>
      <Link
        to={"/home"}
        className={`underline underline-offset-8 pt-5 text-lg font-medium ${
          !isDarkMode ? "text-white" : "text-slate-900"
        }`}
      >
        Take me home
      </Link>
    </div>
  );
};

export default Error;
