import { useState } from "react";

const ResetButton = ({ onClick, className = "", disabled = false, size = "md", label = "Reset" }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  };

  const handleClick = (e) => {
    if (disabled) return;

    setIsAnimating(true);

    if (onClick) {
      onClick(e);
    }

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 800);

    return () => clearTimeout(timer);
  };

  return false;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        inline-flex items-center gap-2
        rounded-md border border-zinc-300 dark:border-zinc-600
        bg-zinc-50 dark:bg-zinc-800/50
        text-zinc-700 dark:text-zinc-200
        hover:bg-zinc-100 dark:hover:bg-zinc-700/70
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-zinc-50 dark:disabled:hover:bg-zinc-800/50
        transition-all duration-200 ease-in-out
        shadow-sm hover:shadow
        group
        ${className}
      `}
      aria-label={label}
    >
      <svg
        className={`w-4 h-4 transition-transform duration-300 ${
          isAnimating ? "rotate-180" : ""
        } group-hover:rotate-180`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      {label}
    </button>
  );
};

export default ResetButton;
