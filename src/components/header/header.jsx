import { useContext, useEffect } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { PostDataProvider } from "../../contexts/PostDataContext";
import { IconBrandJavascript, IconMoon, IconSun } from "@tabler/icons";

export const Header = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeProvider);
  const location = useLocation();
  const { postData, setSearchData, setSearchFilter } = useContext(PostDataProvider);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(location);
  },[])

  const handleModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleHomeRedirect = () => {
    navigate("/");
    setSearchData(postData.sort((a, b) => b.timeStamp - a.timeStamp));
    setSearchFilter([]);
  };

  return (
    <>
      <nav className="flex justify-between text-xl items-center">
        <div className="flex items-center gap-2">
          <IconBrandJavascript
            size={"2em"}
            stroke={"2"}
            className={` ${isDarkMode ? "text-zinc-700" : "text-zinc-200"}`}
          />
          <h2
            onClick={handleHomeRedirect}
            className={`cursor-pointer font-bold text-2xl md:text-2xl lg:text-3xl ${
              isDarkMode ? "text-zinc-800" : "text-zinc-200"
            }`}
          >
            YourJsCoach
          </h2>
        </div>
        {/* {location.pathname !== "/practice" ? (
          <div className="flex gap-4 md:gap-8">
            <button className="text-2xl md:text-3xl" onClick={handleModeToggle}>
              {isDarkMode ? (
                <IconMoon className="text-zinc-700" />
              ) : (
                <IconSun className="text-white" />
              )}
            </button>
          </div>
        ) : (
          ""
        )} */}
        <div className="flex gap-7 text-base pr-4">
          <h3 onClick={() => navigate("/blog")} className={`cursor-pointer ${location.pathname.split("/")[1] === "blog" || location.pathname === "blog" ? "text-zinc-200" : "text-zinc-600"}`}>Blog</h3>
          <h3 onClick={() => navigate("/questions")} className={`cursor-pointer ${location.pathname === "/questions" ? "text-zinc-200" : "text-zinc-600"}`}>Questions</h3>
        </div>
      </nav>
    </>
  );
};
