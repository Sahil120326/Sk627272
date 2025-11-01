
import { GoogleGenAI, Type } from '@google/genai';

// Assume process.env.API_KEY is available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: 'A list of 3 to 5 likely next words, in lowercase.',
    },
  },
  required: ['suggestions'],
};

export const getOnlinePredictions = async (text: string): Promise<string[]> => {
  if (!text || text.trim() === '') {
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Given the text "${text.trim()}", what are the most likely next words?`,
      config: {
        systemInstruction: `You are an expert next-word prediction engine. Your task is to predict the next word a user might type.
        - Analyze the provided text context.
        - Provide a list of 3 to 5 common and contextually relevant next words.
        - The words must be single words and in lowercase.
        - Return ONLY the JSON object with the suggestions. Do not add any other text or formatting.`,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, // Lower temperature for more predictable suggestions
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        return [];
    }

    const result = JSON.parse(jsonText);
    if (result && Array.isArray(result.suggestions)) {
      return result.suggestions;
    }
  } catch (error) {
    console.error('Error fetching Gemini predictions:', error);
    // Return empty array on error to prevent UI crash
    return [];
  }
  return [];
};
