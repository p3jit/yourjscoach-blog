import React from "react";

const PlanIcon = ({ icon, isPopular }) => (
  <div
    className={`w-8 h-8 flex items-center justify-center rounded-full ${isPopular ? "text-zinc-100" : "text-zinc-600"}`}
  >
    {icon}
  </div>
);

const PlanHeader = ({ icon, title, isPopular }) => (
  <div className="flex gap-4">
    <div className="flex items-center mb-4">
      <PlanIcon icon={icon} isPopular={isPopular} />
      <h3 className="ml-2 text-xl font-bold text-white">{title}</h3>
    </div>
    {isPopular && (
      <div className="self-start py-1">
        <span
          className="bg-zinc-700 text-xs font-semibold px-2.5 py-1 rounded text-zinc-100 uppercase"
          aria-label="Popular plan"
        >
          Popular
        </span>
      </div>
    )}
  </div>
);

const FeatureList = ({ features }) => (
  <ul className="mb-6 flex-grow" aria-label="Plan features">
    {features.map((feature, index) => (
      <li key={`feature-${index}`} className="flex items-start mb-2">
        <svg
          className="w-4 h-4 text-green-400 mt-1 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="ml-2 text-sm text-gray-300">{feature}</span>
      </li>
    ))}
  </ul>
);

const PlanButton = ({ buttonText, buttonAction, isPopular }) => {
  let buttonStyle = "bg-zinc-600 hover:bg-zinc-700 text-white";

  if (isPopular) {
    buttonStyle = "bg-zinc-200 hover:bg-zinc-400 text-zinc-700";
  }

  return (
    <button
      className={`py-3 px-4 rounded-md font-medium transition-all duration-200 ${buttonStyle}`}
      onClick={buttonAction}
      aria-label={buttonText}
    >
      {buttonText}
    </button>
  );
};

const PrepPlan = ({ title, description, features, buttonText, buttonAction, icon, isPopular = false }) => {
  return (
    <article
      className={`rounded-lg p-6 flex flex-col h-full ${
        isPopular ? "border-2 border-zinc-300" : "border border-zinc-700"
      }`}
    >
      <PlanHeader icon={icon} title={title} isPopular={isPopular} />
      <p className="text-gray-300 mb-4 text-sm">{description}</p>
      <FeatureList features={features} />
      <PlanButton buttonText={buttonText} buttonAction={buttonAction} isPopular={isPopular} />
    </article>
  );
};

const PlanIcons = {
  sprint: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  challenge: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  dive: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      />
    </svg>
  ),
};

const InterviewPrepPlans = () => {
  const plans = [
    {
      id: "sprint",
      title: "2 Weeks Sprint",
      description: "Focus on core concepts and high-frequency questions. Maximize your impact in minimum time.",
      features: ["Top 75 DSA Questions", "Top 50 JS Questions", "Curated 10 System Design Questions"],
      buttonText: "Get Started",
      buttonAction: () => {},
      icon: PlanIcons.sprint,
      isPopular: false,
      customClasses: "",
    },
    {
      id: "challenge",
      title: "30 Days Challenge",
      description: "Comprehensive topic coverage, from fundamentals to advanced problem-solving techniques.",
      features: ["All Sprint Features", "Diverse Problem Types", "Mock Interview Tips"],
      buttonText: "Start Challenge",
      buttonAction: () => {},
      icon: PlanIcons.challenge,
      isPopular: true,
      customClasses: "",
    },
    {
      id: "dive",
      title: "90 Days Deep Dive",
      description: "Master advanced algorithms, data structures, and system design principles. Aim for top-tier roles.",
      features: ["All Challenge Features", "System Design Modules", "Personalized Feedback"],
      buttonText: "Begin Deep Dive",
      buttonAction: () => {},
      icon: PlanIcons.dive,
      isPopular: false,
      customClasses: "blue-accent",
    },
  ];

  return (
    <section className="bg-zinc-900 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ace Your Next Interview</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Tailored prep plans to match your timeline and goals.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PrepPlan
              key={plan.id}
              title={plan.title}
              description={plan.description}
              features={plan.features}
              buttonText={plan.buttonText}
              buttonAction={plan.buttonAction}
              icon={plan.icon}
              isPopular={plan.isPopular}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InterviewPrepPlans;
