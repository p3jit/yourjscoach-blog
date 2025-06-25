import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ProblemDataProvider = createContext();

const ProblemDataContext = ({ children }) => {
  // State management
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch all problems
  const fetchAllProblems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:1337/api/problems", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }

      let data = await response.json();
      debugger;
      const sortedProblems = data.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setProblems(sortedProblems || []);
      setFilteredProblems(sortedProblems || []);
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

    debugger;
    return filtered;
  };

  // Fetch a single problem by ID
  const fetchProblemById = async (documentId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:1337/api/problems/${documentId}`, {
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
    fetchAllProblems();
  }, []);

  // Context value with all data and functions
  const contextValue = {
    problems,
    currentProblem,
    filteredProblems,
    isLoading,
    error,
    fetchAllProblems,
    fetchProblemById,
    setProblems,
    setFilteredProblems,
    filterProblems,
    setCurrentProblem
  };

  return <ProblemDataProvider.Provider value={contextValue}>{children}</ProblemDataProvider.Provider>;
};

export default ProblemDataContext;
