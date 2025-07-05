import React, { memo, useState, useEffect } from "react";
import { Header } from "../header/header";

const AnimationStyles = () => (
  <style jsx="true">{`
    @keyframes float {
      0% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
      100% {
        transform: translateY(0px);
      }
    }

    .floating-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
    }

    .floating-shapes::before,
    .floating-shapes::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.1;
    }

    .floating-shapes::before {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      animation: float 12s ease-in-out infinite;
      left: 20%;
      top: 20%;
    }

    .floating-shapes::after {
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, #ec4899, #f43f5e);
      animation: float 8s ease-in-out infinite reverse;
      right: 15%;
      bottom: 20%;
    }

    /* Grid Background */
    .grid-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
      opacity: 0.1;
    }

    .grid-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(to right, #a1a1aa 1px, transparent 1px),
        linear-gradient(to bottom, #a1a1aa 1px, transparent 1px);
      background-size: 40px 40px;
      animation: gridMove 30s linear infinite;
      transform-origin: center;
    }

    .grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, transparent 0%, rgba(24, 24, 27, 0.8) 100%);
    }

    @keyframes gridMove {
      0% {
        transform: translate(-5%, -5%) scale(1.1);
      }
      50% {
        transform: translate(0, 0) scale(1);
      }
      100% {
        transform: translate(-5%, -5%) scale(1.1);
      }
    }
  `}</style>
);

const FloatingText = () => {
  const words = ["JavaScript", "HTML", "CSS", "Algorithms", "Data Structures", "Web Development", "System Design"];
  
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      {words.map((word, index) => {
        // Random position and animation delay
        const top = `${10 + Math.random() * 80}%`;
        const left = `${Math.random() * 100}%`;
        const delay = Math.random() * 5;
        const duration = 20 + Math.random() * 20;
        const size = 0.5 + Math.random() * 1.5; // Random font size between 0.5 and 2rem
        
        return (
          <div 
            key={index}
            className="absolute text-zinc-200 font-mono whitespace-nowrap"
            style={{
              top,
              left,
              fontSize: `${size}rem`,
              animation: `float ${duration}s linear ${delay}s infinite`,
            }}
          >
            {word}
          </div>
        );
      })}
    </div>
  );
};

const HeroSection = memo(() => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <style jsx="true">{`
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
      
      <AnimationStyles />
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 w-full">
        {/* Floating Text Background */}
        <FloatingText />
        
        {/* Animated Grid Background */}
        <div className="grid-bg">
          <div className="grid-container"></div>
          <div className="grid-overlay"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 z-10">
          <Header />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}

            <div className="space-y-14 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-zinc-900/20 border border-zinc-700/50 text-sm text-zinc-300">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-300"></span>
                </span>
                New challenges added weekly
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-400">
                  Code.
                </span>
                <span className="block text-zinc-200">Practice.</span>
                <span className="block text-zinc-400">Master.</span>
              </h1>

              <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0">
                Sharpen your skills with our curated collection of frontend challenges and system design problems.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:from-zinc-600 hover:to-zinc-700"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 text-zinc-100 font-medium text-lg">
                    Start Practicing
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>

                <button className="px-6 py-4 border-2 border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800/50 transition-colors hover:border-zinc-600">
                  View All Problems
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0">
                {[
                  { value: "50+", label: "Problems" },
                  { value: "10+", label: "Companies" },
                  { value: "8+", label: "Categories" },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-700/30">
                    <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
                    <div className="text-sm text-zinc-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Preview */}
            <div className="relative">
              <div className="relative bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/50 shadow-2xl overflow-hidden">
                {/* Window Controls */}
                <div className="flex items-center mb-6">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="ml-3 text-sm text-zinc-400 font-mono">challenge.js</div>
                </div>

                {/* Code Block */}
                <div className="relative">
                  <pre className="font-mono text-sm text-zinc-300 overflow-hidden">
                    <code>
                      {`// Find the longest substring without repeating characters
function longestSubstring(s) {
  let max = 0, start = 0;
  const map = new Map();
  
  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    if (map.has(char)) {
      start = Math.max(map.get(char) + 1, start);
    }
    max = Math.max(max, end - start + 1);
    map.set(char, end);
  }
  return max;
}`}
                    </code>
                  </pre>
                </div>

                {/* Interactive Elements */}
                <div className="mt-6 pt-6 border-t border-zinc-700/50">
                  <div className="flex flex-wrap gap-2">
                    {["JavaScript", "Algorithms", "Strings", "Hash Map"].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600/50 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default HeroSection;
