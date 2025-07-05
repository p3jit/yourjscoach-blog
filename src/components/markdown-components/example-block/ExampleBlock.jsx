import React from 'react';

const ExampleBlock = ({ input, output, name, explanation }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-zinc-100 flex items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mr-2"></span>
        {name}
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-sm font-medium text-zinc-400">Input</span>
          <div className="p-3 bg-zinc-800/50 rounded-md border border-zinc-700/50">
            <code className="text-zinc-200 font-mono text-sm">{input}</code>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-sm font-medium text-zinc-400">Output</span>
          <div className="p-3 bg-zinc-700/20 rounded-md border border-zinc-700/30">
            <code className="text-zinc-100 font-mono text-sm">{output}</code>
          </div>
        </div>

        {explanation && (
          <div className="pt-3 border-t border-zinc-700/50">
            <p className="text-md text-zinc-400 leading-relaxed">
              {explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExampleBlock;