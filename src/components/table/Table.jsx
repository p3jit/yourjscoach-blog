import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";
import { returnColor, returnDifficultyText } from "../../utils/utils";

const Table = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);

  const handleRowClick = () => {
    console.log("clicked");
  };

  return (
    <section className="flex flex-col gap-3 w-full">
      {/* <h2
        className={`text-3xl font-medium pl-4 pb-2 ${
          isDarkMode ? "text-zinc-700" : "text-white"
        }`}
      >
        {data.name}
      </h2> */}
      <div className="overflow-x-auto border-zinc-700 rounded-md border-2 w-full">
        {data ? (
          <table className="min-w-full divide-y-2 divide-zinc-700">
            <thead>
              <tr>
                <th
                  className={`whitespace-nowrap px-4 py-2 text-left font-medium tracking-wide text-lg ${
                    isDarkMode ? "text-zinc-900" : "text-white"
                  }`}
                >
                  Question
                </th>
                <th
                  className={`whitespace-nowrap px-4 py-2 text-left font-medium tracking-wide text-lg ${
                    isDarkMode ? "text-zinc-900" : "text-white"
                  }`}
                >
                  Difficulty
                </th>
                <th
                  className={`whitespace-nowrap px-4 py-2 text-left font-medium tracking-wide text-lg ${
                    isDarkMode ? "text-zinc-900" : "text-white"
                  }`}
                >
                  Asked in
                </th>
                <th
                  className={`whitespace-nowrap px-4 py-2 text-left font-medium tracking-wide text-lg ${
                    isDarkMode ? "text-zinc-900" : "text-white"
                  }`}
                >
                  Topic
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {data?.map((singleQuestion) => (
                <tr className="cursor-pointer" key={Math.random()} onClick={() => handleRowClick()}>
                  <td
                    className={`whitespace-nowrap px-4 py-2 font-light tracking-wide text-sm ${
                      isDarkMode ? "text-zinc-900" : "text-white"
                    }`}
                  >
                    {singleQuestion.questionName}
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-2 font-medium text-sm ${returnColor(
                      singleQuestion.difficulty
                    )}`}
                  >
                    {returnDifficultyText(singleQuestion.difficulty)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-zinc-700 max-w-3xl">
                    <div className="flex gap-2 flex-wrap max-w-[14rem]">
                      {singleQuestion.askedIn?.map((singleAskedIn) => (
                        <span
                          key={Math.random()}
                          className={`w-fit px-3 py-1 rounded-xl first-letter:uppercase text-sm font-normal ${
                            isDarkMode ? "bg-zinc-200" : "bg-zinc-600 text-white"
                          }`}
                        >
                          {singleAskedIn}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 flex flex-col gap-4">
                    <div className="flex gap-2 flex-wrap max-w-[10rem]">
                      {singleQuestion.topics?.map((singleTopic) => (
                        <span
                          key={Math.random()}
                          className={`w-fit px-3 py-1 rounded-xl first-letter:uppercase text-sm font-normal ${
                            isDarkMode ? "bg-zinc-200" : "bg-zinc-600 text-white"
                          }`}
                        >
                          {singleTopic}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

export default Table;
