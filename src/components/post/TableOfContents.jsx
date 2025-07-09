import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TableOfContents = () => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Extract headings from the post content
  useEffect(() => {
    const article = document.querySelector(".prose");
    if (!article) return;

    const elements = Array.from(article.querySelectorAll("h1, h2, h3"))
      .filter((element) => element.id)
      .map((element, index) => ({
        id: element.id,
        text: element.textContent || "",
        level: Number(element.nodeName.charAt(1)),
        // Create a key that combines ID and index to ensure uniqueness
        key: `${element.id}-${index}`,
      }));

    setHeadings(elements);
  }, [location.pathname]);

  // Set up intersection observer to highlight active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0% 0% -80% 0%",
        threshold: 0.1,
      }
    );

    // Observe all heading elements
    document.querySelectorAll("h1, h2, h3").forEach((element) => {
      if (element.id) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  // Handle navigation to a section
  const scrollToSection = (id, e) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Update the URL without causing a page reload
      window.history.pushState({}, '', `#${id}`);
      
      // Scroll to the element
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update the active ID
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="hidden lg:block sticky top-0 right-0 h-screen overflow-y-auto py-2 pr-2 scrollbar-thin">
      <div className="h-full flex flex-col">
        <div className="rounded-lg p-4 flex-1">
          <h2 className="text-lg font-semibold text-zinc-200 mb-4 pb-2">
            Table of Contents
          </h2>
          <nav className="h-[calc(100%-3rem)] overflow-y-auto pr-2">
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li key={heading.key}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => scrollToSection(heading.id, e)}
                    className={`block text-sm transition-colors hover:text-zinc-300 ${
                      activeId === heading.id
                        ? 'text-zinc-300 font-medium'
                        : 'text-zinc-500'
                    } ${heading.level === 3 ? 'pl-4' : ''} ${
                      heading.level === 1 ? 'font-semibold' : ''
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
