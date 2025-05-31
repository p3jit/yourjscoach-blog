import { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { PostDataProvider } from "../../contexts/PostDataContext";
import { IconBrandJavascript, IconMoon, IconSun } from "@tabler/icons";

/**
 * Brand component for rendering the site logo and title
 * @param {Object} props - Component props
 * @param {boolean} props.isDarkMode - Current theme mode
 * @param {Function} props.onClick - Click handler for the brand title
 * @returns {JSX.Element} The Brand component
 */
const Brand = ({ isDarkMode, onClick }) => (
  <div className="flex items-center gap-2">
    <IconBrandJavascript
      size={"2em"}
      stroke={"2"}
      className={isDarkMode ? "text-zinc-700" : "text-zinc-200"}
      aria-hidden="true"
    />
    <h2
      onClick={onClick}
      className={`cursor-pointer font-bold text-2xl md:text-2xl lg:text-3xl ${
        isDarkMode ? "text-zinc-800" : "text-zinc-200"
      }`}
    >
      YourJsCoach
    </h2>
  </div>
);

/**
 * Navigation component for rendering navigation links
 * @param {Object} props - Component props
 * @param {string} props.currentPath - Current route path
 * @param {Function} props.navigate - Navigation function
 * @returns {JSX.Element} The Navigation component
 */
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
    transition-colors
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

/**
 * Header component for the site's main navigation
 * @returns {JSX.Element} The Header component
 */
export const Header = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeProvider);
  const location = useLocation();
  const { postData, setSearchData, setSearchFilter } = useContext(PostDataProvider);
  const navigate = useNavigate();

  const handleHomeRedirect = () => {
    navigate("/");
    setSearchData(postData.sort((a, b) => b.timeStamp - a.timeStamp));
    setSearchFilter([]);
  };

  const handleModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header>
      <nav 
        className="flex justify-between text-xl items-center" 
        aria-label="Main navigation"
      >
        <Brand isDarkMode={isDarkMode} onClick={handleHomeRedirect} />
        {/* <div className="flex gap-4 md:gap-8">
          <button className="text-2xl md:text-3xl" onClick={handleModeToggle}>
            {isDarkMode ? (
              <IconMoon className="text-zinc-700" />
            ) : (
              <IconSun className="text-white" />
            )}
          </button>
        </div> */}
        <Navigation currentPath={location.pathname} navigate={navigate} />
      </nav>
    </header>
  );
};
