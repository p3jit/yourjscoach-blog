import React, { useContext } from "react";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

const Table = ({ data }) => {
  const { isDarkMode } = useContext(DarkModeProvider);

  const returnColor = (difficulty) => {
    if (difficulty === 0) {
      return "text-green-600";
    } else if (difficulty === 1) {
      return "text-yellow-600";
    } else {
      return "text-red-600";
    }
  };

  const returnDifficultyText = (difficulty) => {
    if (difficulty === 0) {
      return "Easy";
    } else if (difficulty === 1) {
      return "Medium";
    } else {
      return "Hard";
    }
  };

  return (
    <section className="flex flex-col gap-3 w-full px-3">
      <h2
        className={`text-3xl font-medium pl-4 pb-2 ${
          isDarkMode ? "text-gray-700" : "text-white"
        }`}
      >
        {data.name}
      </h2>
      <div className="overflow-x-auto border border-slate-300 w-full">
        {data.questions ? (
          <table className="min-w-full divide-y-2 divide-gray-200">
            <thead>
              <tr>
                <th
                  className={`whitespace-nowrap px-4 py-2 text-left font-bold text-xl ${
                    isDarkMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  Question
                </th>
                <th
                  className={`whitespace-nowrap px-4 py-2 text-left font-bold text-xl ${
                    isDarkMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  Difficulty
                </th>
                <th
                  className={`whitespace-nowrap px-4 py-2 text-left font-bold text-xl ${
                    isDarkMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  Asked in
                </th>
                <th
                  className={`whitespace-nowrap px-4 py-2 text-left font-bold text-xl ${
                    isDarkMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  Problem Link
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.questions?.map((singleQuestion) => (
                <tr key={Math.random()}>
                  <td
                    className={`whitespace-nowrap px-4 py-2 font-semibold ${
                      isDarkMode ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {singleQuestion.questionName}
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-2 font-bold ${returnColor(
                      singleQuestion.difficulty
                    )} ${isDarkMode ? "text-gray-900" : "text-white"}`}
                  >
                    {returnDifficultyText(singleQuestion.difficulty)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 font-semibold text-gray-700 max-w-3xl">
                    <div className="flex gap-2 flex-wrap max-w-[14rem]">
                      {singleQuestion.askedIn?.map((singleAskedIn) => (
                        <span
                          key={Math.random()}
                          className={`w-fit px-3 py-1 rounded-xl first-letter:uppercase ${
                            isDarkMode
                              ? "bg-slate-200"
                              : "bg-slate-600 text-white"
                          }`}
                        >
                          {singleAskedIn}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 flex flex-col gap-4">
                    {singleQuestion.problemLink1 ? (
                      <a
                        href={`${singleQuestion.problemLink1}`}
                        target="_blank"
                        className="inline-block rounded bg-slate-300 text-center hover:bg-slate-400 text-gray-900 px-4 py-2 text-sm font-medium"
                      >
                        Problem Link - 1
                      </a>
                    ) : (
                      ""
                    )}
                    {singleQuestion.problemLink2 ? (
                      <a
                        href={`${singleQuestion.problemLink2}`}
                        target="_blank"
                        className="inline-block rounded bg-slate-300 text-center hover:bg-slate-400 text-gray-900 px-4 py-2 text-sm font-medium"
                      >
                        Problem Link - 2
                      </a>
                    ) : (
                      ""
                    )}
                    {singleQuestion.solutionLink ? (
                      <a
                        href={`${singleQuestion.solutionLink}`}
                        target="_blank"
                        className="inline-block rounded text-center bg-slate-300 hover:bg-slate-400 text-gray-900 px-4 py-2 text-sm font-medium"
                      >
                        Solution Link
                      </a>
                    ) : (
                      ""
                    )}
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
