import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { useNavigate } from "react-router-dom";
import { PostDataProvider } from "../../contexts/PostDataContext";
import { TbBrandJavascript } from "react-icons/tb";

export const Header = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeProvider);
  const { postData, setSearchData, setSearchFilter } =
    useContext(PostDataProvider);

  const navigate = useNavigate();

  const handleModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleHomeRedirect = () => {
    navigate("/home");
    setSearchData(postData.sort((a, b) => b.timeStamp - a.timeStamp));
    setSearchFilter([]);
  };

  return (
    <>
      <nav className="flex justify-between text-xl items-center">
        <div className="flex items-center gap-2">
          <TbBrandJavascript
            className={`text-4xl md:text-5xl ${
              isDarkMode ? "text-gray-800" : "text-white"
            }`}
          />
          <h2
            onClick={handleHomeRedirect}
            className={`cursor-pointer font-bold text-3xl md:text-3xl lg:text-4xl ${
              isDarkMode ? "text-gray-800" : "text-white"
            }`}
          >
            YourJsCoach
          </h2>
        </div>
        <div className="flex gap-4 md:gap-8">
          <button className="text-2xl md:text-3xl" onClick={handleModeToggle}>
            {isDarkMode ? (
              <MdDarkMode className="text-slate-800" />
            ) : (
              <MdLightMode className="text-white" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
