import { getModelData, setModelData } from './dbService';

interface Model {
  trigramModel: Record<string, Record<string, number>>;
  bigramModel: Record<string, Record<string, number>>;
}

let model: Model | null = null;

const fetchModel = async (): Promise<Model> => {
  const response = await fetch('/model.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const initializeModel = async (): Promise<void> => {
  if (model) {
    return;
  }
  try {
    let modelData = await getModelData();
    if (!modelData) {
      console.log("Model not found in cache, fetching from network...");
      modelData = await fetchModel();
      await setModelData(modelData);
      console.log("Model fetched and cached.");
    } else {
      console.log("Model loaded from cache.");
    }
    model = modelData;
  } catch (error) {
    console.error('Failed to initialize model:', error);
    throw error;
  }
};

export const isModelInitialized = (): boolean => {
  return model !== null;
}

const getSuggestionsFromModel = (
  predictionModel: Record<string, Record<string, number>>,
  key: string,
  limit: number
): string[] => {
  const nextWords = predictionModel[key];
  if (!nextWords) {
    return [];
  }
  
  return Object.entries(nextWords)
    .sort(([, freqA], [, freqB]) => freqB - freqA)
    .slice(0, limit)
    .map(([word]) => word);
};

export const getOfflinePredictions = (text: string): string[] => {
  if (!model || text.trim() === '' || !text.endsWith(' ')) {
    return [];
  }

  const words = text.trim().toLowerCase().split(/\s+/);
  
  if (words.length === 0) {
    return [];
  }

  const limit = 5;

  if (words.length >= 2) {
    const key = `${words[words.length - 2]} ${words[words.length - 1]}`;
    const suggestions = getSuggestionsFromModel(model.trigramModel, key, limit);
    if (suggestions.length > 0) {
      return suggestions;
    }
  }

  if (words.length >= 1) {
    const key = words[words.length - 1];
    const suggestions = getSuggestionsFromModel(model.bigramModel, key, limit);
    return suggestions;
  }

  return [];
};
