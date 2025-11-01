
import React, { useState, useEffect, useCallback } from 'react';
import { initializeModel, getOfflinePredictions, isModelInitialized } from './services/offlinePredictionService';
import Suggestion from './components/Suggestion';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('Initializing prediction model...');
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (!isModelInitialized()) {
          setLoadingMessage('Preparing offline engine (first-time setup)...');
        }
        await initializeModel();
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize model:", error);
        setLoadingMessage('Could not load prediction model. Please try refreshing.');
      } finally {
        setIsModelLoading(false);
      }
    };
    init();
  }, []);

  const handleTextChange = (text: string) => {
    setInputText(text);
    if (isReady) {
      const newSuggestions = getOfflinePredictions(text);
      setSuggestions(newSuggestions);
    }
  };

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInputText(prev => {
        if (prev.endsWith(' ')) {
            // It was a next-word suggestion
            return prev + suggestion + ' ';
        } else {
            // It was a word-completion suggestion
            const words = prev.split(' ');
            words[words.length - 1] = suggestion;
            return words.join(' ') + ' ';
        }
    });
    setSuggestions([]);
    document.querySelector('textarea')?.focus();
  }, []);
  
  const renderContent = () => {
    if (isModelLoading || !isReady) {
      return (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-slate-400">{loadingMessage}</p>
        </div>
      );
    }
    
    const showSuggestions = suggestions.length > 0;

    return (
      <>
        <div className="p-4 h-14 flex items-center space-x-3 border-b border-slate-700 overflow-x-auto no-scrollbar">
          {showSuggestions && suggestions.map((s, i) => (
              <Suggestion
                key={i}
                text={s}
                onClick={() => handleSuggestionClick(s)}
              />
            ))}
          {!inputText && (
            <span className="text-slate-500 text-sm whitespace-nowrap">Start writing to see suggestions.</span>
          )}
        </div>
        <div className="p-1 relative">
          <textarea
            className="w-full h-64 p-4 bg-transparent text-slate-200 text-lg resize-none focus:outline-none placeholder-slate-500"
            placeholder="Start writing here..."
            value={inputText}
            onChange={(e) => handleTextChange(e.target.value)}
            aria-label="Text input for word prediction"
            disabled={!isReady}
          />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500">
            Offline Word Prediction
          </h1>
          <p className="text-slate-400 mt-2">
            Experience instant, private, and network-independent writing assistance.
          </p>
        </header>

        <main className="bg-slate-800/50 rounded-xl shadow-2xl shadow-purple-500/10 backdrop-blur-sm border border-slate-700 min-h-[320px] flex flex-col justify-center">
          {renderContent()}
        </main>
        
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Powered by a Local Prediction Model</p>
        </footer>
      </div>
    </div>
  );
};

export default App;