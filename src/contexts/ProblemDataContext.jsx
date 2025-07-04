import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isNewProblem } from "../utils/utils";

export const ProblemDataProvider = createContext();

const ProblemDataContext = ({ children }) => {
  // State management
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState({});
  const [originalProblem, setOriginalProblem] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

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
      const sortedProblems = data.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setProblems(sortedProblems || []);
      setFilteredProblems(sortedProblems || []);

      // Identify and store newly added problems
      const newProblems = sortedProblems.filter((problem) =>
        isNewProblem(problem.timestamp || problem.createdAt) ? problem : null
      );
      setNewProblems(newProblems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 2));
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError(err.message);
      navigate("/404");
    }
  };

  // Filter problems based on search text and selected category
  const filterProblems = (searchValue, category = "") => {
    if (!problems.length) return [];

    let filtered = problems;

    // Apply search text filter
    if (searchValue.length > 0) {
      filtered = problems.filter(
        (problem) =>
          problem.problemTitle.includes(searchValue) ||
          problem.askedIn.some((company) => company.toLowerCase().includes(searchValue)) ||
          problem.tags.some((tag) => tag.toLowerCase().includes(searchValue))
      );
    }

    // Apply category filter
    if (category && category !== "all") {
      filtered = filtered.filter((problem) => problem.category === category);
    }

    return filtered;
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
      setOriginalProblem(data.data || {});
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
    fetchAllProblems();
  }, []);

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
    filterProblems,
    setCurrentProblem,
    currentProblemIndex,
    setCurrentProblemIndex,
    originalProblem,
    setOriginalProblem
  };

  return <ProblemDataProvider.Provider value={contextValue}>{children}</ProblemDataProvider.Provider>;
};

export default ProblemDataContext;
