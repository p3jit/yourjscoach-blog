import { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { BlogDataProvider } from "../../contexts/BlogDataContext";
import { IconMenu2, IconMoon, IconSun } from "@tabler/icons";
import { SidebarProvider } from "../../contexts/SidebarContext";
import Brand from "../brand/Brand";

const Navigation = ({ currentPath, navigate }) => {
  const isActive = (path) => {
    if (path === "/blog") {
      // Check if path is /blog or starts with /blog/
      return currentPath.split("/")[1] === "blog" || currentPath === "blog";
    }
    return currentPath === path;
  };

  const getNavLinkClass = (path) => `
    cursor-pointer 
    ${isActive(path) ? "text-zinc-200" : "text-zinc-600"}
    hover:text-zinc-300 
    transition-color
  `;

  return (
    <div className="flex gap-7 text-base pr-4" role="navigation">
      <button
        onClick={() => navigate("/blog")}
        className={getNavLinkClass("/blog")}
        aria-current={isActive("/blog") ? "page" : undefined}
      >
        Blog
      </button>
      <button
        onClick={() => navigate("/questions")}
        className={getNavLinkClass("/questions")}
        aria-current={isActive("/questions") ? "page" : undefined}
      >
        Questions
      </button>
    </div>
  );
};

export const Header = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeProvider);
  const { toggleSidebar } = useContext(SidebarProvider);
  const location = useLocation();
  const { postData, setSearchData, setSearchFilter } = useContext(BlogDataProvider);
  const navigate = useNavigate();
  const isPracticePage = (() => location.pathname.includes("/practice/"))();
  const isPostPage = (() => location.pathname.includes("/blog/") || location.pathname.includes("/sd/"))();
  const containerClasses = returnContainerClasses();

  function returnContainerClasses() {
    if (isPracticePage) {
      return "py-3 px-4 gap-5 min-w-[950px]";
    }
    if (isPostPage) {
      return "py-3 px-4 gap-5 min-w-[950px]";
    }
    return "gap-10 py-[3vh] 2xl:px-[20vw] lg:px-[10vw] px-[7vw] min-w-[56vw]";
  }

  const handleHomeRedirect = () => {
    navigate("/");
    setSearchData(postData.sort((a, b) => b.timeStamp - a.timeStamp));
    setSearchFilter([]);
  };

  const handleModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      <nav
        className={`flex justify-between text-xl items-center bg-zinc-900 ${containerClasses}`}
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-5">
          {(isPracticePage || isPostPage) && (
            <button onClick={toggleSidebar}>
              <IconMenu2 className="text-zinc-200 cursor-pointer" />
            </button>
          )}
          <Brand isDarkMode={isDarkMode} onClick={handleHomeRedirect} />
        </div>
        {/* <div className="flex gap-4 md:gap-8">
          <button className="text-2xl md:text-3xl" onClick={handleModeToggle}>
            {isDarkMode ? (
              <IconMoon className="text-zinc-700" />
            ) : (
              <IconSun className="text-white" />
            )}
          </button>
        </div> */}
        {!(isPracticePage || isPostPage) && <Navigation currentPath={location.pathname} navigate={navigate} />}
      </nav>
      {(isPracticePage || isPostPage) && <hr className="bg-zinc-700 h-0.5 outline-none border-none" />}
    </header>
  );
};
