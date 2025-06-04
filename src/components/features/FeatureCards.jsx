import React from "react";

const IconWrapper = ({ children, className }) => (
  <div className={`text-4xl ${className}`} aria-hidden="true">
    {children}
  </div>
);

const FeatureIcons = {
  Code: () => (
    <IconWrapper className="text-zinc-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    </IconWrapper>
  ),

  Path: () => (
    <IconWrapper className="text-zinc-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="10" y1="6" x2="21" y2="6"></line>
        <line x1="10" y1="12" x2="21" y2="12"></line>
        <line x1="10" y1="18" x2="21" y2="18"></line>
        <circle cx="5" cy="6" r="2"></circle>
        <circle cx="5" cy="12" r="2"></circle>
        <circle cx="5" cy="18" r="2"></circle>
      </svg>
    </IconWrapper>
  ),

  Community: () => (
    <IconWrapper className="text-zinc-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    </IconWrapper>
  ),
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <article className="bg-zinc-800 rounded-lg p-8 flex flex-col items-center text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-zinc-300 text-xl font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </article>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <header className="mb-10">
    <h2 className="text-white text-3xl font-bold text-center mb-2">{title}</h2>
    <p className="text-zinc-400 text-center">{subtitle}</p>
  </header>
);

const FeatureGrid = ({ features }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {features.map((feature, index) => (
      <FeatureCard
        key={`feature-${index}`}
        icon={feature.icon}
        title={feature.title}
        description={feature.description}
      />
    ))}
  </div>
);

const FeatureCards = () => {
  const features = [
    {
      icon: <FeatureIcons.Code />,
      title: "Vast Problem Library",
      description: "Access thousands of problems curated from real interviews and coding challenges.",
    },
    {
      icon: <FeatureIcons.Path />,
      title: "Structured Learning Paths",
      description: "Follow guided tracks for specific skills like Data Structures, Algorithms, or System Design.",
    },
    {
      icon: <FeatureIcons.Community />,
      title: "Active Community",
      description: "Engage in discussions, share solutions, and learn from fellow coders.",
    },
  ];

  return (
    <section className="py-16 px-4" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title="Why CodePlatform?" subtitle="We provide the tools and community to help you succeed." />
        <FeatureGrid features={features} />
      </div>
    </section>
  );
};

export default FeatureCards;
