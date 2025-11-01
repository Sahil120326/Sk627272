import React, { useState, useCallback } from 'react';
import { getOfflinePredictions } from './services/offlinePredictionService';
import Suggestion from './components/Suggestion';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleTextChange = (text: string) => {
    setInputText(text);
    const newSuggestions = getOfflinePredictions(text);
    setSuggestions(newSuggestions);
  };

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInputText(prev => {
      const words = prev.split(' ');
      words.pop(); // Remove the partially typed word
      const newText = words.join(' ') + (words.length > 0 ? ' ' : '');
      return newText + suggestion + ' ';
    });
    setSuggestions([]);
  }, []);


  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500">
            Offline Word Prediction
          </h1>
          <p className="text-slate-400 mt-2">
            Instant, private, and offline-capable suggestions as you type.
          </p>
        </header>

        <main className="bg-slate-800/50 rounded-xl shadow-2xl shadow-purple-500/10 backdrop-blur-sm border border-slate-700">
          <div className="p-4 h-14 flex items-center space-x-3 border-b border-slate-700 overflow-x-auto no-scrollbar">
             {suggestions.length > 0 ? (
                suggestions.map((s, i) => (
                    <Suggestion
                        key={i}
                        text={s}
                        onClick={() => handleSuggestionClick(s)}
                    />
                ))
             ) : (
                <span className="text-slate-500 text-sm whitespace-nowrap">
                  {inputText.length > 0 ? "Keep typing..." : "Start writing to see suggestions."}
                </span>
             )}
          </div>
          <div className="p-1 relative">
            <textarea
              className="w-full h-64 p-4 bg-transparent text-slate-200 text-lg resize-none focus:outline-none placeholder-slate-500"
              placeholder="Start writing here..."
              value={inputText}
              onChange={(e) => handleTextChange(e.target.value)}
              aria-label="Text input for word prediction"
            />
          </div>
        </main>
        
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Powered by a Local Prediction Model</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
