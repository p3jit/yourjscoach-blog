import React, { memo } from 'react';

const CodePreview = memo(({ code, fileName, tags }) => {
  return (
    <div className="relative bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/50 shadow-2xl overflow-hidden">
      {/* Window Controls */}
      <div className="flex items-center mb-6">
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="ml-3 text-sm text-zinc-400 font-mono">{fileName}</div>
      </div>

      {/* Code Block */}
      <div className="relative">
        <pre className="font-mono text-sm text-zinc-300 overflow-hidden">
          <code>
            {code}
          </code>
        </pre>
      </div>

      {/* Tags */}
      <div className="mt-6 pt-6 border-t border-zinc-700/50">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
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
  );
});

CodePreview.displayName = 'CodePreview';

export { CodePreview };
