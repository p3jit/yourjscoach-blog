import React, { memo, useState, useMemo } from 'react';
import { Header } from '../header/header';
import { FloatingText } from './FloatingText';
import { CodePreview } from './CodePreview';
import { CTAButton } from './CTAButton';

// Constants
const STATS = [
  { value: '50+', label: 'Problems' },
  { value: '10+', label: 'Companies' },
  { value: '8+', label: 'Categories' },
];

const HeroSection = memo(() => {
  const [isHovered, setIsHovered] = useState(false);
  const codeSnippet = useMemo(() => (
    `// Find the longest substring without repeating characters
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
}`
  ), []);

  const codeTags = ['JavaScript', 'Algorithms', 'Strings', 'Hash Map'];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 w-full">
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
              <CTAButton 
                isHovered={isHovered}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Start Practicing
              </CTAButton>
              
              <button className="px-6 py-4 border-2 border-zinc-700 text-zinc-300 rounded-xl hover:bg-zinc-800/50 transition-colors hover:border-zinc-600">
                View All Problems
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0">
              {STATS.map((stat) => (
                <div key={stat.label} className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-700/30">
                  <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
                  <div className="text-sm text-zinc-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Preview */}
          <div className="relative">
            <CodePreview 
              code={codeSnippet}
              fileName="challenge.js"
              tags={codeTags}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(20px) rotate(10deg); opacity: 0; }
        }
        
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
          background-image: 
            linear-gradient(to right, #a1a1aa 1px, transparent 1px),
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
          0% { transform: translate(-5%, -5%) scale(1.1); }
          50% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-5%, -5%) scale(1.1); }
        }
      `}</style>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export { HeroSection as default };
