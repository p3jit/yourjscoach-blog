import { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { BlogDataProvider } from "../../contexts/BlogDataContext";
import { IconCircle, IconCircleCheck, IconMenu2, IconMoon, IconSun } from "@tabler/icons";
import { SidebarProvider } from "../../contexts/SidebarContext";
import Brand from "../brand/Brand";
import { ProblemDataProvider } from "../../contexts/ProblemDataContext";
import { LocalStorageProvider } from "../../contexts/localStorageContext";

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
        onClick={() => navigate("/problems")}
        className={getNavLinkClass("/problems")}
        aria-current={isActive("/problems") ? "page" : undefined}
      >
        Problems
      </button>
    </div>
  );
};

export const Header = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeProvider);
  const { toggleSidebar } = useContext(SidebarProvider);
  const { postData, setSearchData, setSearchFilter } = useContext(BlogDataProvider);
  const { problems, currentProblemIndex, currentProblem } = useContext(ProblemDataProvider);
  const { solvedProblems, setSolvedProblems, updateLocalStorage } = useContext(LocalStorageProvider);

  const location = useLocation();
  const navigate = useNavigate();
  const isPracticePage = (() => location.pathname.includes("/practice/"))();
  const isProblemsPage = (() => location.pathname.includes("/problems"))();
  const isPostPage = (() => location.pathname.includes("/blog/") || location.pathname.includes("/sd/"))();
  const currentId = currentProblem.documentId || currentProblem.displayId;
  const isSolved = solvedProblems.includes(currentId);

  const markSolved = () => {
    let updatedSolvedProblems = [];
    if (!isSolved) {
      updatedSolvedProblems = [...solvedProblems, currentId];
      setSolvedProblems(updatedSolvedProblems);
      updateLocalStorage({ solvedProblems: [...updatedSolvedProblems] });
    } else {
      updatedSolvedProblems = solvedProblems.filter((id) => id !== currentId);
      setSolvedProblems(updatedSolvedProblems);
      updateLocalStorage({ solvedProblems: [...updatedSolvedProblems] });
    }
  };

  const containerClasses = returnContainerClasses();

  function returnContainerClasses() {
    if (isPracticePage) {
      return "py-3 px-4 gap-5 min-w-[950px] bg-zinc-900";
    }
    if (isPostPage) {
      return "gap-10 py-[1.5vh] 2xl:px-[20vw] lg:px-[10vw] px-[7vw] min-w-[56vw] bg-zinc-900";
    }
    if (isProblemsPage) {
      return "absolute w-full bottom-14";
    }
    return "gap-10 py-[1.5vh] 2xl:px-[20vw] lg:px-[10vw] px-[7vw] min-w-[56vw] bg-zinc-900";
  }

  const handleHomeRedirect = () => {
    if (isProblemsPage) return;
    navigate("/");
    setSearchData(postData.sort((a, b) => b.timeStamp - a.timeStamp));
    setSearchFilter([]);
  };

  const handleModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleProblemNavigation = (type) => {
    if (type === "prev") {
      if (problems[currentProblemIndex - 1]) {
        navigate(`/practice/${problems[currentProblemIndex - 1].documentId}`);
      }
    } else {
      navigate(`/practice/${problems[currentProblemIndex + 1].documentId}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md ">
      <nav className={`flex justify-between text-xl items-center ${containerClasses}`} aria-label="Main navigation">
        <div className="flex items-center gap-5">
          {(isPracticePage) && (
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
        {isPracticePage && (
          <div className="text-sm text-zinc-300 gap-3 flex">
            {currentProblem.category == "js" && (
              <button
                type="button"
                onClick={markSolved}
                className={
                  "px-3 py-2 rounded-md font-medium transition-all duration-50 flex gap-2 justify-center items-center " +
                  `${
                    isSolved
                      ? "hover:bg-emerald-700 active:bg-emerald-800 bg-emerald-800"
                      : "hover:bg-zinc-700 active:bg-zinc-800 bg-zinc-800"
                  } text-zinc-100  ` +
                  "shadow-sm hover:shadow-lg active:shadow-md "
                }
              >
                {isSolved ? <IconCircleCheck className="w-5 h-5" /> : <IconCircle className="w-5 h-5" />}
                Mark Complete
              </button>
            )}
            <button
              type="button"
              onClick={() => handleProblemNavigation("prev")}
              className={
                "px-3 py-2 rounded-md font-medium transition-all duration-50 " +
                "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 " +
                "shadow-sm hover:shadow-lg active:shadow-md "
              }
            >
              {`< Previous`}
            </button>
            <button
              type="button"
              onClick={() => handleProblemNavigation("next")}
              className={
                "px-3 py-2 rounded-lg font-medium transition-all duration-50 " +
                "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 " +
                "shadow-sm hover:shadow-md active:shadow-md "
              }
            >
              {`Next >`}
            </button>
          </div>
        )}
        {!(isPracticePage || isPostPage) && <Navigation currentPath={location.pathname} navigate={navigate} />}
      </nav>
      {(isPracticePage) && <hr className="bg-zinc-700 h-0.5 outline-none border-none" />}
    </header>
  );
};
