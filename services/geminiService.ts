import { GoogleGenAI, Type } from "@google/genai";
import type { PredictionResponse } from '../types';

const systemInstruction = `You are an intelligent text editor assistant. Your task is to analyze a given text and provide helpful suggestions.
- Correct the last word if it's misspelled.
- Provide a list of 3 to 5 likely next words or short phrases.
- Provide one longer, contextually relevant sentence completion suggestion.
- Provide 2-3 relevant emojis based on the text's sentiment and context.
- Provide your response in JSON format according to the specified schema.
- If a field is not applicable (e.g., no correction needed, no suitable sentence completion), its value should be null or an empty array.`;

export const getPredictions = async (text: string): Promise<PredictionResponse | null> => {
  if (!text.trim()) {
    return null;
  }

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      correction: {
        type: Type.STRING,
        description: 'The spelling correction for the last word in the text. Null if no correction is needed.',
      },
      suggestions: {
        type: Type.ARRAY,
        description: 'An array of 3 to 5 strings, representing the most likely next words or short phrases.',
        items: {
          type: Type.STRING,
        },
      },
      sentenceCompletion: {
        type: Type.STRING,
        description: 'A longer, contextually relevant suggestion to complete the current sentence. Null if not applicable.',
      },
      emojis: {
        type: Type.ARRAY,
        description: 'An array of 2-3 relevant emojis.',
        items: {
            type: Type.STRING
        }
      }
    },
    required: ['correction', 'suggestions', 'sentenceCompletion', 'emojis'],
  };

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Lower temperature for more predictable, less creative suggestions
      },
    });

    const jsonString = response.text.trim();
    if (jsonString) {
      const parsed = JSON.parse(jsonString) as PredictionResponse;
      // Ensure emojis is an array even if model returns null
      if (!parsed.emojis) {
        parsed.emojis = [];
      }
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Error fetching predictions from Gemini API:", error);
    // Re-throw the error to be handled by the calling function
    throw error;
  }
};
