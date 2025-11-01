
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeModel, getOfflinePredictions, isModelInitialized } from './services/offlinePredictionService';
import { getOnlinePredictions } from './services/geminiService';
import Suggestion from './components/Suggestion';

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

interface SuggestionType {
  text: string;
  isAi: boolean;
}

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [localSuggestions, setLocalSuggestions] = useState<string[]>([]);
  const [onlineSuggestions, setOnlineSuggestions] = useState<string[]>([]);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Initializing prediction model...');
  const [isReady, setIsReady] = useState<boolean>(false);

  const debouncedInput = useDebounce(inputText, 400);

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

  useEffect(() => {
    if (isReady && debouncedInput.trim().length > 0 && debouncedInput.endsWith(' ')) {
      const fetchOnlineSuggestions = async () => {
        setIsApiLoading(true);
        try {
          const suggestions = await getOnlinePredictions(debouncedInput);
          setOnlineSuggestions(suggestions);
        } catch (error) {
          console.error("Failed to get online predictions:", error);
          setOnlineSuggestions([]);
        } finally {
          setIsApiLoading(false);
        }
      };
      fetchOnlineSuggestions();
    } else {
      setOnlineSuggestions([]);
    }
  }, [debouncedInput, isReady]);

  const handleTextChange = (text: string) => {
    setInputText(text);
    if (isReady) {
      const newSuggestions = getOfflinePredictions(text);
      setLocalSuggestions(newSuggestions);
      // Reset online suggestions immediately on new input
      setOnlineSuggestions([]);
    }
  };

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInputText(prev => {
      const words = prev.trim().split(' ');
      words.pop();
      const newText = words.join(' ') + (words.length > 0 ? ' ' : '');
      return newText + suggestion + ' ';
    });
    setLocalSuggestions([]);
    setOnlineSuggestions([]);
    
    document.querySelector('textarea')?.focus();
  }, []);

  const mergedSuggestions = useMemo(() => {
    const local: SuggestionType[] = localSuggestions.map(s => ({ text: s, isAi: false }));
    const online: SuggestionType[] = onlineSuggestions
      .filter(s => !localSuggestions.includes(s)) // Avoid duplicates
      .map(s => ({ text: s, isAi: true }));
      
    return [...local, ...online].slice(0, 7); // Limit total suggestions
  }, [localSuggestions, onlineSuggestions]);

  const renderContent = () => {
    if (isModelLoading || !isReady) {
      return (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-slate-400">{loadingMessage}</p>
        </div>
      );
    }
    
    const showSuggestions = mergedSuggestions.length > 0;
    const showKeepTyping = inputText.length > 0 && mergedSuggestions.length === 0 && !isApiLoading;

    return (
      <>
        <div className="p-4 h-14 flex items-center space-x-3 border-b border-slate-700 overflow-x-auto no-scrollbar">
          {showSuggestions && mergedSuggestions.map((s, i) => (
              <Suggestion
                key={i}
                text={s.text}
                isAi={s.isAi}
                onClick={() => handleSuggestionClick(s.text)}
              />
            ))}
          {isApiLoading && (
            <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
          )}
          {showKeepTyping && (
             <span className="text-slate-500 text-sm whitespace-nowrap">Keep typing...</span>
          )}
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
            Hybrid Word Prediction
          </h1>
          <p className="text-slate-400 mt-2">
            Instant local suggestions, supercharged by the Gemini API.
          </p>
        </header>

        <main className="bg-slate-800/50 rounded-xl shadow-2xl shadow-purple-500/10 backdrop-blur-sm border border-slate-700 min-h-[320px] flex flex-col justify-center">
          {renderContent()}
        </main>
        
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Local Model + Gemini AI</p>
        </footer>
      </div>
    </div>
  );
};

export default App;