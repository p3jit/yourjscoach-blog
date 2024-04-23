import { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { useNavigate } from "react-router-dom";
import { PostDataProvider } from "../../contexts/PostDataContext";
import { IconBrandJavascript, IconMoon, IconSun } from "@tabler/icons";

export const Header = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeProvider);
  const { postData, setSearchData, setSearchFilter } =
    useContext(PostDataProvider);

  const navigate = useNavigate();

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
            className={` ${isDarkMode ? "text-zinc-700" : "text-white"}`}
          />
          <h2
            onClick={handleHomeRedirect}
            className={`cursor-pointer font-extrabold text-3xl md:text-3xl lg:text-4xl ${
              isDarkMode ? "text-zinc-800" : "text-white"
            }`}
          >
            YourJsCoach
          </h2>
        </div>
        <div className="flex gap-4 md:gap-8">
          <button className="text-2xl md:text-3xl" onClick={handleModeToggle}>
            {isDarkMode ? (
              <IconMoon className="text-zinc-700" />
            ) : (
              <IconSun className="text-white" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
