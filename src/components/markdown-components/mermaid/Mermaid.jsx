import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const Mermaid = ({ chartDefinition }) => {
  const mermaidRef = useRef(null);

  useEffect(() => {
    if (mermaidRef.current) {
      // Clear previous content to ensure re-rendering on definition change
      mermaidRef.current.innerHTML = chartDefinition;
      mermaid.init({theme: 'dark'}, mermaidRef.current);
    }
  }, [chartDefinition]);

  return <div className="mermaid" ref={mermaidRef}>{chartDefinition}</div>;
};

export default Mermaid;