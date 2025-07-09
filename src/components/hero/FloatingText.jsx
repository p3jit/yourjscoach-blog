import React, { memo, useMemo } from "react";

const FloatingText = memo(() => {
  const words = useMemo(
    () =>
      ["JavaScript", "HTML", "CSS", "Algorithms", "Web Dev", "System Design"]
        .sort(() => 0.5 - Math.random())
        .slice(0, 12),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      {words.map((word, index) => {
        const top = `${10 + Math.random() * 80}%`;
        const left = `${Math.random() * 100}%`;
        const delay = Math.random() * 5;
        const duration = 20 + Math.random() * 20;
        const size = 0.5 + Math.random() * 1.5;

        return (
          <div
            key={index}
            className="absolute text-zinc-200 font-mono whitespace-nowrap will-change-transform"
            style={{
              top,
              left,
              fontSize: `${size}rem`,
              animation: `float ${duration}s linear ${delay}s infinite`,
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
            {word}
          </div>
        );
      })}

      <style jsx="true" global="true">{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(20px) rotate(10deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
});

FloatingText.displayName = "FloatingText";

export { FloatingText };
