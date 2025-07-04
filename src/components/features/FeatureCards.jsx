import React, { useEffect, useRef } from "react";

const IconWrapper = ({ children }) => (
  <div className="p-3 rounded-lg bg-zinc-700/50 mb-6 transition-transform duration-300 group-hover:scale-110">
    {children}
  </div>
);

const FeatureIcons = {
  Code: () => (
    <IconWrapper>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-zinc-200"
      >
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    </IconWrapper>
  ),
  Path: () => (
    <IconWrapper>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-zinc-200"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    </IconWrapper>
  ),
  Community: () => (
    <IconWrapper>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-zinc-200"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    </IconWrapper>
  ),
};

const FeatureCard = ({ icon, title, description, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="group relative h-full p-6 rounded-lg border border-zinc-700/50 bg-zinc-800/30 
                 hover:bg-zinc-800/50 transition-all duration-300 transform translate-y-4 opacity-0
                 hover:shadow-lg hover:-translate-y-1"
      style={{
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        transitionDelay: `${index * 100}ms`
      }}
    >
      <div className="flex flex-col items-center text-center">
        {icon}
        <h3 className="text-zinc-100 text-lg font-medium mb-2 transition-colors duration-300 group-hover:text-white">
          {title}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed transition-colors duration-300 group-hover:text-zinc-300">
          {description}
        </p>
      </div>
      <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-zinc-400 group-hover:w-2/4 group-hover:left-1/4 transition-all duration-300"></div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => {
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={headerRef}
      className="text-center max-w-3xl mx-auto mb-16 opacity-0 transform -translate-y-4 transition-all duration-700"
      style={{ transitionDelay: '100ms' }}
    >
      <h2 className="text-2xl md:text-3xl font-semibold text-zinc-100 mb-3">{title}</h2>
      <p className="text-zinc-400">{subtitle}</p>
    </div>
  );
};

const FeatureGrid = ({ features }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {features.map((feature, index) => (
      <FeatureCard
        key={`feature-${index}`}
        icon={feature.icon}
        title={feature.title}
        description={feature.description}
        index={index}
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
    <section className="py-16 px-4 bg-zinc-900 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <SectionHeader 
          title="Why Choose YourJsCoach?" 
          subtitle="We provide the tools and community to help you succeed in your coding journey." 
        />
        <FeatureGrid features={features} />
      </div>
    </section>
  );
};

export default FeatureCards;
