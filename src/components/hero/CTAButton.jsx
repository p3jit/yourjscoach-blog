import React, { memo } from "react";

const CTAButton = memo(({ children, isHovered, onMouseEnter, onMouseLeave, className = "" }) => {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative px-8 py-4 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:from-zinc-600 hover:to-zinc-700 ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 text-zinc-100 font-medium text-lg">
        {children}
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </span>
    </button>
  );
});

CTAButton.displayName = "CTAButton";

export { CTAButton };
