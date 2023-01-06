import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { BsCodeSlash } from "react-icons/bs";
import { MdFeedback } from "react-icons/md";
import { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { useNavigate } from "react-router-dom";

export const Header = ({ setIsModalOpen }) => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeProvider);
  const navigate = useNavigate();

  const handleModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleHomeRedirect = () => {
    navigate("/home");
  };

  const toggleModalOpen = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <nav className="flex justify-between text-xl items-center">
        <div className="flex items-center gap-2">
          <BsCodeSlash
            className={`text-2xl md:text-4xl ${
              isDarkMode ? "text-gray-800" : "text-white"
            }`}
          />
          <h2
            onClick={handleHomeRedirect}
            className={`cursor-pointer font-bold text-xl md:text-3xl lg:text-4xl ${
              isDarkMode ? "text-gray-800" : "text-white"
            }`}
          >
            way2frontend
          </h2>
        </div>
        <div className="flex gap-4 md:gap-">
          <button className="text-xl md:text-3xl" onClick={handleModeToggle}>
            {isDarkMode ? (
              <MdDarkMode className="text-slate-800" />
            ) : (
              <MdLightMode className="text-white" />
            )}
          </button>
          <button
            className="bg-slate-300 hover:bg-slate-400 px-3 py-2 text-sm md:text-lg font-medium rounded text-gray-900 flex items-center gap-2"
            onClick={toggleModalOpen}
          >
            <MdFeedback className="text-xl font-medium mt-1 text-slate-700" />
            Contact
          </button>
        </div>
      </nav>
    </>
  );
};
