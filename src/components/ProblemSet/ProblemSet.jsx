import React from "react";
import { returnDifficultyText } from "../../utils/utils";
import { useNavigate } from "react-router-dom";

const difficultyStyles = ["bg-green-700 text-zinc-300", "bg-yellow-400 text-yellow-800", "bg-red-500 text-zinc-300"];

const ProblemCard = ({ problem }) => {
  const { problemTitle, difficulty, description, tags, askedIn, documentId } = problem;
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/practice/${id}`);
  }

  return (
    <article className="bg-zinc-900 rounded-lg p-6 shadow-lg shadow-zinc-950 flex flex-col justify-between h-full border-2 border-zinc-700">
      <div>
        <header className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold text-zinc-300">{problemTitle}</h3>
          {difficulty && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                difficultyStyles[Number(difficulty - 1)] || "bg-zinc-500 text-zinc-100"
              }`}
            >
              {returnDifficultyText(difficulty)}
            </span>
          )}
        </header>
        <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{description}</p>

        {tags && tags.length > 0 && (
          <section className="mb-4">
            <h4 className="text-xs text-zinc-500 uppercase font-semibold mb-1.5">Topics:</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {askedIn && askedIn.length > 0 && (
          <section className="mb-5">
            <h4 className="text-xs text-zinc-500 uppercase font-semibold mb-1.5">Companies:</h4>
            <div className="flex flex-wrap gap-2">
              {askedIn.map((company) => (
                <span key={company} className={`px-2 py-1 rounded-md text-xs bg-zinc-700 text-zinc-200`}>
                  {company}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      <button
        onClick={() => handleClick(documentId)}
        className={`w-full text-white font-semibold py-2.5 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2  focus:ring-zinc-400 bg-zinc-700`}
      >
        Solve Problem
      </button>
    </article>
  );
};

const ProblemSet = ({ data }) => {
  const loadMoreProblems = () => {
    // Placeholder for fetching more problems
    // Example: setIsLoading(true); fetch('/api/problems?offset=' + problems.length).then(...)
    console.log("Load more problems action triggered");
  };

  return (
    <div className=" min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {data.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
        {/* <div className="text-center">
          <button
            onClick={loadMoreProblems}
            // disabled={isLoading}
            className="border-2 border-zinc-500 relative overflow-hidden text-zinc-200 py-3 px-6 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900 group"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-900 bg-[length:200%_100%] animate-gradient-x"></span>
            <span className="relative">
              {isLoading ? 'Loading...' : 'Load More Problems'}
              Load More Problems
            </span>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProblemSet;
