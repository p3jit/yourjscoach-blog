import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { useStudyPlan } from "../../contexts/StudyPlanContext";
import { useNavigate } from "react-router-dom";
import { ProblemDataProvider } from "../../contexts/ProblemDataContext";

const PlanCard = ({ plan, isActive, onClick }) => {
  const [isCardVisible, setIsCardVisible] = useState(false);
  const {setActiveStudyPlan} = useStudyPlan();
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const {setProblems} = useContext(ProblemDataProvider);

  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      setIsCardVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [isActive]);

  const handleClick = () => {
    const params = new URLSearchParams();
    params.append('plan', plan.documentId);
    navigate(`/practice/${plan.problems[0].documentId}?${params.toString()}`);
    setActiveStudyPlan(plan);
    setProblems(plan.problems);
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`cursor-pointer transition-all duration-300 h-full ${
        isActive ? "scale-100 opacity-100" : "scale-95 opacity-70"
      }`}
    >
      <div
        className={`group relative p-6 rounded-lg border shadow-lg h-full flex flex-col ${
          plan.isPopular
            ? "border-zinc-700/80 bg-zinc-800/40 hover:border-zinc-700 hover:bg-zinc-800/50"
            : "border-zinc-700/80 bg-zinc-800/40 hover:border-zinc-700 hover:bg-zinc-800/50"
        } transition-all hover:shadow-xl`}
      >
        {plan.isPopular && (
          <div className="absolute -top-3 right-6 bg-zinc-700 text-zinc-100 text-xs font-medium px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Most Popular
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-zinc-800/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-zinc-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-zinc-100">{plan.title}</h3>
        </div>

        <div className="flex-grow">
          <p className="text-zinc-300 mb-6 line-clamp-6 h-[9rem] overflow-hidden">{plan.description}</p>

          <ul className="space-y-2 mb-6">
            {plan.featureList?.slice(0, 4).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 mt-1 text-zinc-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <button
          onClick={handleClick}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              plan.isPopular
                ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            }`}
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
};

const StudyPlans = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef(null);
  const { studyPlans, isLoading, error } = useStudyPlan();
  const plansPerPage = 3;

  // Calculate pagination
  const { totalPages, currentPlans } = useMemo(() => {
    if (!studyPlans?.length) return { totalPages: 0, currentPlans: [] };

    const totalPages = Math.ceil(studyPlans.length / plansPerPage);
    const startIndex = currentPage * plansPerPage;
    const endIndex = startIndex + plansPerPage;
    const currentPlans = studyPlans.slice(startIndex, endIndex);

    return { totalPages, currentPlans };
  }, [studyPlans, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading) return <div className="text-center py-12">Loading study plans...</div>;
  if (error) return <div className="text-center py-12 text-red-400">Error loading study plans: {error.message}</div>;
  if (!studyPlans?.length) return null;

  return (
    <section ref={sectionRef} className="py-5 relative">
      <div
        className={`transition-all pt-12 duration-500 max-w-6xl mb-12 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-3xl font-bold text-zinc-100 mb-3">Featured Study Plans</h2>
        <p className="text-zinc-500 font-medium tracking-wide">
          Browse through our curated collection of study plans to boost your learning journey.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {currentPlans.map((plan) => (
            <div key={plan.id} className="w-full">
              <PlanCard
                plan={plan}
                isActive={true}
                onClick={() => {}} // Add navigation if needed
              />
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                currentPage === 0 ? "text-zinc-500 cursor-not-allowed" : "text-zinc-300 hover:bg-zinc-800/50"
              }`}
              aria-label="Previous page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    currentPage === index ? "bg-zinc-600 text-white" : "text-zinc-400 hover:bg-zinc-800/50"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                currentPage >= totalPages - 1
                  ? "text-zinc-500 cursor-not-allowed"
                  : "text-zinc-300 hover:bg-zinc-800/50"
              }`}
              aria-label="Next page"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudyPlans;
