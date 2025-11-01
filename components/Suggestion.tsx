
import React from 'react';

interface SuggestionProps {
  text: string;
  onClick: () => void;
  isAi?: boolean;
}

const Suggestion: React.FC<SuggestionProps> = ({ text, onClick, isAi = false }) => {
  const baseClasses = "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 whitespace-nowrap flex items-center space-x-2";
  
  const themeClasses = isAi 
    ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 focus:ring-purple-500"
    : "bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-cyan-500";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${themeClasses}`}
    >
      {isAi && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v3.5h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5h-3.5a.75.75 0 010-1.5h3.5v-3.5A.75.75 0 0110 3zM10 18a8 8 0 100-16 8 8 0 000 16zm-4.95-2.05a6.5 6.5 0 119.192 0 6.5 6.5 0 01-9.192 0z" clipRule="evenodd" />
          <path d="M10 5.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM5.5 10a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 00-.75-.75zm9.25-.75a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 00-.75-.75zM10 14.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5a.75.75 0 01-.75.75z" />
          <path d="M3.25 6.5a.75.75 0 011.06-1.06l.72.72a.75.75 0 01-1.06 1.06l-.72-.72zm12.44 6.38a.75.75 0 011.06-1.06l.72.72a.75.75 0 11-1.06 1.06l-.72-.72zM6.5 16.75a.75.75 0 01-1.06 1.06l-.72-.72a.75.75 0 011.06-1.06l.72.72zm6.38-12.44a.75.75 0 01-1.06 1.06l-.72-.72a.75.75 0 011.06-1.06l.72.72z" />
        </svg>
      )}
      <span>{text}</span>
    </button>
  );
};

export default Suggestion;
