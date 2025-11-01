
import React from 'react';

interface SuggestionProps {
  text: string;
  onClick: () => void;
  type: 'suggestion' | 'correction';
}

const baseClasses = "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 whitespace-nowrap";

const typeClasses = {
  suggestion: "bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-cyan-500",
  correction: "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500"
};

export const Suggestion: React.FC<SuggestionProps> = ({ text, onClick, type }) => {
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${typeClasses[type]}`}
    >
      {type === 'correction' && <span className="mr-1.5 italic">Did you mean:</span>}
      {text}
    </button>
  );
};
