
import React, { useState, useEffect, useCallback } from 'react';
import { getPredictions } from './services/geminiService';
import type { PredictionResponse } from './types';
import { Suggestion } from './components/Suggestion';

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

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

const LoadingSkeleton: React.FC = () => (
  <div className="flex items-center space-x-2 animate-pulse h-10">
    <div className="h-8 bg-slate-700 rounded-full w-24"></div>
    <div className="h-8 bg-slate-700 rounded-full w-32"></div>
    <div className="h-8 bg-slate-700 rounded-full w-20"></div>
  </div>
);

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedInputText = useDebounce(inputText, 500);

  const fetchPredictions = useCallback(async (text: string) => {
    if (text.trim().length === 0) {
      setPrediction(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getPredictions(text);
      const trimmedText = text.trim();
      const words = trimmedText.split(/\s+/);
      const lastWord = words[words.length - 1];
      
      // Don't show correction if it's the same as the last word
      if (result && result.correction && result.correction.toLowerCase() === lastWord.toLowerCase()) {
        result.correction = null;
      }
      setPrediction(result);
    } catch (err) {
      setError('Failed to fetch predictions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPredictions(debouncedInputText);
  }, [debouncedInputText, fetchPredictions]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(prev => {
      let newText = prev.trimEnd();
      // If the last character is not a space, add one.
      if (newText.length > 0) {
        newText += ' ';
      }
      return newText + suggestion + ' ';
    });
  };
  
  const handleCorrectionClick = (correction: string) => {
    setInputText(prev => {
        const words = prev.trim().split(/\s+/);
        if (words.length > 0) {
            words[words.length - 1] = correction;
            return words.join(' ') + ' ';
        }
        return prev;
    });
  };


  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500">
            Next Word Prediction Model
          </h1>
          <p className="text-slate-400 mt-2">
            AI-powered suggestions and corrections as you type.
          </p>
        </header>

        <main className="bg-slate-800/50 rounded-xl shadow-2xl shadow-purple-500/10 backdrop-blur-sm border border-slate-700">
          <div className="p-4 h-14 flex items-center space-x-2 border-b border-slate-700 overflow-x-auto">
             {isLoading ? <LoadingSkeleton /> : 
                <>
                    {prediction?.correction && (
                        <Suggestion
                            text={prediction.correction}
                            onClick={() => handleCorrectionClick(prediction.correction!)}
                            type="correction"
                        />
                    )}
                    {prediction?.suggestions?.map((s, i) => (
                        <Suggestion
                            key={i}
                            text={s}
                            onClick={() => handleSuggestionClick(s)}
                            type="suggestion"
                        />
                    ))}
                </>
             }
             { !isLoading && !prediction && inputText.length > 0 && <span className="text-slate-500 text-sm">Continue typing for suggestions...</span>}
          </div>
          <div className="p-1">
            <textarea
              className="w-full h-64 p-4 bg-transparent text-slate-200 text-lg resize-none focus:outline-none placeholder-slate-500"
              placeholder="Start writing here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label="Text input for word prediction"
            />
          </div>
        </main>
        
        {error && <div className="mt-4 text-red-400 text-center" role="alert">{error}</div>}

        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Powered by Google Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
