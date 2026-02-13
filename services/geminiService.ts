import { GoogleGenAI } from "@google/genai";
import { FinancialItem } from "../types";

// Initialize Gemini Client
// IMPORTANT: The API key is injected via process.env.API_KEY automatically.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFinancialResponse = async (
  query: string,
  financialData: FinancialItem[],
  voiceMode: boolean
): Promise<string> => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Construct the context
    const dataContext = JSON.stringify(financialData, null, 2);
    
    const systemInstruction = `
      You are FinMind, a strict financial assistant. 
      Your goal is to manage and remind the user about EMIs, bills, subscriptions, loans, and financial deadlines.
      
      Current Date: ${currentDate}

      Rules:
      1. Always check the provided JSON financial database before answering.
      2. Give exact dates and amounts.
      3. Speak in short, clear sentences.
      4. If user asks "today reminders", list only items where due_date equals ${currentDate}.
      5. If no dues are found for a query, clearly say "No payments due." or specific to the query.
      6. Prioritize high priority items in your response.
      7. Never guess. Only respond using stored data.
      8. Provide summary if asked monthly or yearly.
      9. Always format currency clearly (e.g., $ or ₹ based on context, default to currency in data).
      10. If voice mode is ON (${voiceMode}), convert the response to a natural speech style (more conversational, less robotic lists, suitable for reading aloud).
      11. If voice mode is OFF, use bullet points and concise formatting.

      Financial Database:
      ${dataContext}
    `;

    const modelId = voiceMode ? 'gemini-2.5-flash-native-audio-preview-12-2025' : 'gemini-3-flash-preview';

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Using flash for speed/text logic.
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Low temperature for factual accuracy
      }
    });

    return response.text || "I couldn't generate a response. Please check your network.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error checking your financial data.";
  }
};
