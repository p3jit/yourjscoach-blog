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
    <section className="flex flex-col gap-2 w-full px-3">
      <h2
        className={`text-2xl font-medium pl-4 pb-2 ${
          isDarkMode ? "text-slate-700" : "text-white"
        }`}
      >
        {data.name}
      </h2>
      <div className="overflow-x-auto border border-slate-300 w-full rounded-md">
        {data.questions ? (
          <table className="min-w-full divide-slate-200">
            <thead
              className={`${
                isDarkMode ? "bg-slate-200" : "bg-slate-600 text-white"
              }`}
            >
              <tr>
                <th
                  className={`whitespace-nowrap px-4 py-2 text-left font-bold text-lg ${
                    isDarkMode ? "text-slate-900" : "text-white"
                  }`}
                >
                  Question
                </th>
                <th
                  className={`whitespace-nowrap px-4 py-2 text-left font-bold text-lg ${
                    isDarkMode ? "text-slate-900" : "text-white"
                  }`}
                >
                  Difficulty
                </th>
                <th
                  className={`whitespace-nowrap px-4 py-2 text-left font-bold text-lg ${
                    isDarkMode ? "text-slate-900" : "text-white"
                  }`}
                >
                  Asked in
                </th>
                <th
                  className={`whitespace-nowrap px-4 py-2 text-left font-bold text-lg ${
                    isDarkMode ? "text-slate-900" : "text-white"
                  }`}
                >
                  Problem Link
                </th>
                <th
                  className={`whitespace-nowrap px-4 py-2 text-left font-bold text-lg ${
                    isDarkMode ? "text-slate-900" : "text-white"
                  }`}
                >
                  Solution Link
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.questions?.map((singleQuestion) => (
                <tr key={Math.random()}>
                  <td
                    className={`whitespace-nowrap px-4 py-2 font-semibold ${
                      isDarkMode ? "text-slate-900" : "text-white"
                    }`}
                  >
                    {singleQuestion.questionName}
                  </td>
                  <td
                    className={`whitespace-nowrap px-4 py-2 font-bold ${returnColor(
                      singleQuestion.difficulty
                    )} ${isDarkMode ? "text-slate-900" : "text-white"}`}
                  >
                    {returnDifficultyText(singleQuestion.difficulty)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 font-semibold text-slate-700 max-w-3xl">
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
                  <td className="whitespace-nowrap px-4 py-2">
                    <div className="flex flex-col gap-4">
                      {singleQuestion.problemLink1 ? (
                        <a
                          href={`${singleQuestion.problemLink1}`}
                          target="_blank"
                          className="inline-block rounded bg-slate-300 text-center hover:bg-slate-400 text-slate-900 px-4 py-2 text-sm font-medium"
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
                          className="inline-block rounded bg-slate-300 text-center hover:bg-slate-400 text-slate-900 px-4 py-2 text-sm font-medium"
                        >
                          Problem Link - 2
                        </a>
                      ) : (
                        ""
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <div className="flex flex-col gap-4">
                      {singleQuestion.solutionLink ? (
                        <a
                          href={`${singleQuestion.solutionLink}`}
                          target="_blank"
                          className="inline-block rounded bg-slate-300 text-center hover:bg-slate-400 text-slate-900 px-4 py-2 text-sm font-medium"
                        >
                          Solution
                        </a>
                      ) : (
                        ""
                      )}
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
