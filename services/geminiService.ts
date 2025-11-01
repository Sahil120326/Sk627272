import { GoogleGenAI, Type } from "@google/genai";
import type { PredictionResponse } from '../types';

const systemInstruction = `You are an intelligent text editor assistant. Your task is to analyze a given text, correct the last word if it's misspelled, and provide a list of 3 to 5 likely next words or short phrases to continue the sentence.
- Provide your response in JSON format according to the specified schema.
- If there is no spelling correction for the last word, the 'correction' field in the JSON response should be null.
- The suggestions should be contextually relevant to the provided text.`;

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
    },
    required: ['correction', 'suggestions'],
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
      return JSON.parse(jsonString) as PredictionResponse;
    }
    return null;
  } catch (error) {
    console.error("Error fetching predictions from Gemini API:", error);
    // Re-throw the error to be handled by the calling function
    throw error;
  }
};