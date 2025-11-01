export interface PredictionResponse {
  correction: string | null;
  suggestions: string[];
  sentenceCompletion: string | null;
  emojis: string[];
}
