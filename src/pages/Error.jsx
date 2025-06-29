import React, { useContext, useEffect } from "react";
import { IconError404, IconArrowNarrowRight } from "@tabler/icons";
import { Link } from "react-router-dom";
import { DarkModeProvider } from "../contexts/DarkModeContext";

const Error = () => {
  const { isDarkMode } = useContext(DarkModeProvider);
  
  // Add animation keyframes to the document
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      
      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-5px, 5px); }
        40% { transform: translate(-5px, -5px); }
        60% { transform: translate(5px, 5px); }
        80% { transform: translate(5px, -5px); }
        100% { transform: translate(0); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const baseTextColor = isDarkMode ? "text-zinc-800" : "text-zinc-200";
  const accentColor = isDarkMode ? "text-zinc-600" : "text-zinc-400";
  const bgColor = isDarkMode ? "bg-zinc-100" : "bg-zinc-900";
  const borderColor = isDarkMode ? "border-zinc-300" : "border-zinc-700";
  
  return (
    <div className={`h-[80vh] w-full flex justify-center items-center flex-col ${bgColor}`}>
      <div className="relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className={`absolute ${accentColor} opacity-10`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 5 + 2}rem`,
                animation: `float ${Math.random() * 5 + 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {['404', '{ }', '[ ]', '< >', '/ \\'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
        
        {/* Main 404 content */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div 
              className={`text-[12rem] font-bold ${accentColor} opacity-20 select-none`}
              style={{ animation: 'pulse 3s ease-in-out infinite' }}
            >
              404
            </div>
            <div 
              className={`absolute top-0 text-[12rem] font-bold ${baseTextColor} select-none`}
              style={{ animation: 'glitch 3s ease-in-out infinite', animationDelay: '0.5s' }}
            >
              404
            </div>
          </div>
          
          <div className="mt-8 flex flex-col items-center">
            <p className={`font-medium text-2xl ${baseTextColor} mb-2`}>
              Oops! You're in the wrong place.
            </p>
            <p className={`${accentColor} text-center max-w-md px-4`}>
              The page you're looking for doesn't exist or has been moved to another dimension.
            </p>
            
            <div className="mt-12">
              <Link
                to={"/"}
                className={`group flex items-center gap-2 px-6 py-3 rounded-lg ${borderColor} border ${baseTextColor} hover:bg-zinc-800/10 transition-all duration-300`}
              >
                <span>Take me home</span>
                <IconArrowNarrowRight 
                  size={20} 
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
