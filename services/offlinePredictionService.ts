import { trigramModel, bigramModel } from '../data/trigram-model';

const getSuggestionsFromModel = (
  model: Record<string, Record<string, number>>,
  key: string,
  limit: number
): string[] => {
  const nextWords = model[key];
  if (!nextWords) {
    return [];
  }
  
  // Sort suggestions by frequency (descending) and return the top 'limit'
  return Object.entries(nextWords)
    .sort(([, freqA], [, freqB]) => freqB - freqA)
    .slice(0, limit)
    .map(([word]) => word);
};

export const getOfflinePredictions = (text: string): string[] => {
  if (text.trim() === '' || !text.endsWith(' ')) {
    return [];
  }

  const words = text.trim().toLowerCase().split(/\s+/);
  
  if (words.length === 0) {
    return [];
  }

  const limit = 5;

  // Try trigram model first (using last two words)
  if (words.length >= 2) {
    const key = `${words[words.length - 2]} ${words[words.length - 1]}`;
    const suggestions = getSuggestionsFromModel(trigramModel, key, limit);
    if (suggestions.length > 0) {
      return suggestions;
    }
  }

  // Fallback to bigram model (using last word)
  if (words.length >= 1) {
    const key = words[words.length - 1];
    const suggestions = getSuggestionsFromModel(bigramModel, key, limit);
    return suggestions;
  }

  return [];
};
