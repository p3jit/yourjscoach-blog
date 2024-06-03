import { useContext, useState } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { PostDataProvider } from "../../contexts/PostDataContext";

const Tag = ({ data, isClickable = false }) => {
  const [isActive, setIsActive] = useState(false);
  const { isDarkMode } = useContext(DarkModeProvider);
  const { searchFilter, setSearchFilter } = useContext(PostDataProvider);

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
        className={`w-fit px-3 py-1 rounded-xl ${
          isDarkMode ? (!isActive ? "bg-zinc-200" : "bg-zinc-400")  : (!isActive ? "bg-zinc-600 text-white" : "bg-zinc-800 text-white") 
        } ${
          isClickable ? "cursor-pointer" : "cursor-auto"
        }`}
      >
        {data}
      </span>
    </div>
  );
};

export default Tag;
