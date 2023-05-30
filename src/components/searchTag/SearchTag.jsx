import { useContext, useState } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { PostDataProvider } from "../../contexts/PostDataContext";

const SearchTag = ({ data }) => {
  const [isActive, setIsActive] = useState(false);
  const { isDarkMode } = useContext(DarkModeProvider);
  const { searchFilter, setSearchFilter, postData } =
    useContext(PostDataProvider);

  const handleActive = async () => {
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
        className={`rounded text-sm md:text-lg font-semibold bg-slate-200 px-3 py-1 cursor-pointer ${
          isActive
            ? `outline outline-2 text-slate-700 ${
                isDarkMode
                  ? "outline-slate-500 "
                  : "outline-offset-2 outline-white"
              }`
            : "text-slate-500"
        }`}
      >
        {data}
      </span>
    </div>
  );
};

export default SearchTag;
