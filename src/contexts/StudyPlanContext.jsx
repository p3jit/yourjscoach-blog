import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProblemDataProvider } from "./ProblemDataContext";

const GRAPHQL_ENDPOINT = "http://localhost:1339/graphql"; // Replace with your actual endpoint

const StudyPlanContext = createContext();

export const StudyPlanProvider = ({ children }) => {
  const [studyPlans, setStudyPlans] = useState([]);
  const [featuredStudyPlans, setFeaturedStudyPlans] = useState([]);
  const [activeStudyPlan, setActiveStudyPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setProblems } = useContext(ProblemDataProvider);

  const navigate = useNavigate();

  const fetchStudyPlans = async () => {
    const query = `
    query StudyPlans {
        studyPlans {
            problems {
              askedIn
              category
              createdAt
              difficulty
              documentId
              tags
              problemTitle
            }
            documentId
            difficulty
            createdAt
            askedIn
            title
            featureList
            isPopular
            isFeatured
            description
        }
    }`;

    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any required authentication headers here
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0]?.message || "Error fetching study plans");
      }

      const plans = data?.studyPlans;
      let featuredPlans = plans.filter((plan) => plan.isFeatured);
      featuredPlans = featuredPlans.sort((a, b) => new Date(b) - new Date(a));
      setFeaturedStudyPlans(featuredPlans.slice(0, 3) || []);
      setStudyPlans(plans.sort((a, b) => new Date(a) - new Date(b) || []));
      setError(null);
    } catch (err) {
      console.error("Error fetching study plans:", err);
      setError(err.message);
      navigate("/404");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudyPlanById = async (planId, cFn) => {
    if (!planId) return null;

    try {
      setIsLoading(true);
      setError(null);

      const query = `
        query StudyPlan($documentId: ID!) {
            studyPlan(documentId: $documentId) {
                title
                isPopular
                isFeatured
                featureList
                documentId
                difficulty
                description
                createdAt
                askedIn
                problems {
                  documentId
                  askedIn
                  category
                  createdAt
                  description
                  difficulty
                  tags
                  problemTitle
                }
                posts {
                  askedIn
                  createdAt
                  description
                  difficulty
                  documentId
                  minRead
                  tags
                  title
                  bannerImage
                  identifier
                  category
                }
            }
        }`;

      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { documentId: planId },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0]?.message || "Error fetching study plan");
      }

      const plan = data?.studyPlan || null;
      setActiveStudyPlan(plan);
      setProblems([...plan.problems, ...plan.posts]);
    } catch (err) {
      console.error("Error fetching study plan:", err);
      setError(err.message);
      navigate("/404");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyPlans();
  }, []);

  const value = {
    studyPlans,
    activeStudyPlan,
    setActiveStudyPlan,
    isLoading,
    error,
    refetch: fetchStudyPlans,
    featuredStudyPlans,
    setFeaturedStudyPlans,
    fetchStudyPlanById,
  };

  return <StudyPlanContext.Provider value={value}>{children}</StudyPlanContext.Provider>;
};

export const useStudyPlan = () => {
  const context = useContext(StudyPlanContext);
  if (!context) {
    throw new Error("useStudyPlan must be used within a StudyPlanProvider");
  }
  return context;
};

export default StudyPlanContext;
