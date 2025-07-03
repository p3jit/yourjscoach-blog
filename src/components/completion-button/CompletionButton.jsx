import { useContext } from "react";
import { ProblemDataProvider } from "../../contexts/ProblemDataContext";
import { BlogDataProvider } from "../../contexts/BlogDataContext";
import { LocalStorageProvider } from "../../contexts/localStorageContext";
import { IconCircle, IconCircleCheck } from "@tabler/icons";

const  CompletionButton = ({}) => {
  const { currentProblem } = useContext(ProblemDataProvider);
  const { currPost } = useContext(BlogDataProvider);
  const { updateLocalStorage, solvedProblems, setSolvedProblems } = useContext(LocalStorageProvider);
  const currentId = currentProblem.documentId;
  const isSolved = solvedProblems.includes(currentId);

  const handleUpdateSolved = () => {
    let updatedSolvedProblems = [];
    if (isSolved) {
      updatedSolvedProblems = solvedProblems.filter((x) => x != currentId);
      setSolvedProblems(updatedSolvedProblems);
    } else {
      updatedSolvedProblems = [...solvedProblems, currentId];
      setSolvedProblems(updatedSolvedProblems);
    }
    updateLocalStorage(JSON.stringify({ solvedProblems: [...updatedSolvedProblems] }));
  };

  return (
    <button
      onClick={handleUpdateSolved}
      className={`text-sm ${
        isSolved ? "bg-emerald-700" : "bg-zinc-600"
      } text-zinc-100  py-2 px-3 rounded-md flex justify-center items-center gap-2`}
    >
      {isSolved ? (
        <>
          <IconCircleCheck className="w-5" /> Complete
        </>
      ) : (
        <>
          <IconCircle className="w-5" /> Mark Complete
        </>
      )}
    </button>
  );
};

export default CompletionButton;
