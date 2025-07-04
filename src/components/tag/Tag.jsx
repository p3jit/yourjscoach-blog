import { useContext } from "react";
import { BlogDataProvider } from "../../contexts/BlogDataContext";

const Tag = ({ data, isClickable = false, showHash = true, isActive = false, onClick }) => {
  const { searchFilter, setSearchFilter } = useContext(BlogDataProvider);

  const handleActive = async (e) => {
    if (!isClickable) return;
    e.preventDefault();
    if (isActive) {
      await setSearchFilter(
        searchFilter.filter((singleFilter) => singleFilter !== data)
      );
    } else {
      await setSearchFilter((prev) => [...new Set([...prev, data])]);
    }
  };

  const baseStyles = "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-all duration-200";
const tagStyles = isActive 
  ? "bg-zinc-600 text-white shadow-md hover:bg-zinc-700"
  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700";

  return (
    <button
      onClick={onClick || handleActive}
      disabled={!isClickable}
      aria-pressed={isActive}
      className={`${baseStyles} ${tagStyles} ${
        isClickable ? 'cursor-pointer focus:outline-none' : 'cursor-default'
      }`}
    >
      {showHash && (
        <span className="mr-1" aria-hidden="true">
          #
        </span>
      )}
      {data}
      {isClickable && isActive && (
        <span className="ml-1.5" aria-hidden="true">
          ×
        </span>
      )}
    </button>
  );
};

export default Tag;
