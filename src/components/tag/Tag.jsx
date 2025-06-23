import { useContext, useState } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { BlogDataProvider } from "../../contexts/BlogDataContext";

const Tag = ({ data, isClickable = false, showHash = true }) => {
  const [isActive, setIsActive] = useState(false);
  const { isDarkMode } = useContext(DarkModeProvider);
  const { searchFilter, setSearchFilter } = useContext(BlogDataProvider);

  const handleActive = async () => {
    if (!isClickable) return;
    await setIsActive(!isActive);
    if (!isActive) {
      await setSearchFilter((prev) => [...prev, data]);
    } else {
      await setSearchFilter(
        searchFilter.filter((singleFilter) => singleFilter != data)
      );
    }
  };

  return (
    <div className="flex" onClick={handleActive}>
      <span
        className={`w-fit px-3 py-1 rounded-lg text-sm ${
          isDarkMode ? (!isActive ? "bg-zinc-200" : "bg-zinc-400")  : (!isActive ? "bg-zinc-600 text-zinc-300" : "bg-zinc-800 text-zinc-300") 
        } ${
          isClickable ? "cursor-pointer" : "cursor-auto"
        }`}
      >
        {showHash ? "# " : ""}{data}
      </span>
    </div>
  );
};

export default Tag;
