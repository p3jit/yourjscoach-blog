import React, { useContext } from "react";
import { IconError404 } from "@tabler/icons";
import { Link } from "react-router-dom";
import { DarkModeProvider } from "../contexts/DarkModeContext";

const Error = () => {
  const { isDarkMode } = useContext(DarkModeProvider);
  return (
    <div className="h-[86vh] w-full flex justify-center items-center flex-col">
      <IconError404
        size={"7em"}
        className={`${!isDarkMode ? "text-white" : "text-slate-800"}`}
      />
      <p
        className={`font-medium text-2xl ${
          !isDarkMode ? "text-white" : "text-slate-800"
        }`}
      >
        Oops! You are in the worng place.
      </p>
      <Link
        to={"/"}
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
