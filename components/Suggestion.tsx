
import React from 'react';

interface SuggestionProps {
  text: string;
  onClick: () => void;
}

const Suggestion: React.FC<SuggestionProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 whitespace-nowrap bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-cyan-500"
    >
      {text}
    </button>
  );
};

export default Suggestion;
