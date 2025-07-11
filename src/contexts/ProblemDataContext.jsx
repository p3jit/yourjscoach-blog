import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { isNewProblem } from "../utils/utils";
import { BlogDataProvider } from "./BlogDataContext";

export const ProblemDataProvider = createContext();

const ProblemDataContext = ({ children }) => {
  // State management
  const [problems, setProblems] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const {systemDesignProblems} = useContext(BlogDataProvider);

  // New state for storing newly added problems
  const [newProblems, setNewProblems] = useState([]);

  const navigate = useNavigate();

  // Fetch all problems
  const fetchAllProblems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:1339/api/problems", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }

      let data = await response.json();
      if (systemDesignProblems?.length > 0) {
        data.data = [...data.data, ...systemDesignProblems];
      }
      const sortedProblems = data.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setProblems([...sortedProblems] || []);
      setAllProblems([...sortedProblems] || []);
      setFilteredProblems([...sortedProblems] || []);

      // Identify and store newly added problems
      const newProblems = sortedProblems.filter((problem) =>
        isNewProblem(problem.createdAt || problem.createdAt) ? problem : null
      );
      setNewProblems(newProblems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3));
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError(err.message);
      navigate("/404");
    }
  };

  // Fetch a single problem by ID
  const fetchProblemById = async (documentId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:1339/api/problems/${documentId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Problem not found");
      }

      const data = await response.json();
      setCurrentProblem(data.data || {});
    } catch (err) {
      console.error(`Error fetching problem ${documentId}:`, err);
      setError(err.message);
      navigate("/404");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all problems on component mount
  useEffect(() => {
    const currentPlanId = new URLSearchParams(location.search).get("plan");
    if (!currentPlanId) fetchAllProblems();
  }, [systemDesignProblems]);

  // Context value with all data and functions
  const contextValue = {
    problems,
    currentProblem,
    filteredProblems,
    newProblems, // Include the new state in the context
    isLoading,
    error,
    fetchAllProblems,
    fetchProblemById,
    setProblems,
    setFilteredProblems,
    setCurrentProblem,
    currentProblemIndex,
    setCurrentProblemIndex,
    allProblems,
    setAllProblems
  };

  return <ProblemDataProvider.Provider value={contextValue}>{children}</ProblemDataProvider.Provider>;
};

export default ProblemDataContext;
