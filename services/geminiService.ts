import { GoogleGenAI, Type } from "@google/genai";
import { Activity, RecoveryTimeObjective, RecoveryPointObjective, AIAnalysisResult } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBIAAnalysis = async (
  activityName: string,
  department: string
): Promise<AIAnalysisResult | null> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini");
    return null;
  }

  const prompt = `
    You are an expert Business Continuity Consultant certified in ISO 22301. 
    Analyze the business activity "${activityName}" for the department "${department}".
    
    Provide a structured assessment including:
    1. A professional description of the activity.
    2. A recommended Recovery Time Objective (RTO) and Recovery Point Objective (RPO) based on industry standards for this type of activity.
    3. A brief narrative describing the potential impact if this activity is disrupted for 24 hours.
    4. A list of 3-5 typical resources (IT systems, people, facilities) required to perform this activity.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedDescription: { type: Type.STRING },
            suggestedRTO: { type: Type.STRING, enum: Object.values(RecoveryTimeObjective) },
            suggestedRPO: { type: Type.STRING, enum: Object.values(RecoveryPointObjective) },
            impactNarrative: { type: Type.STRING },
            suggestedResources: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["suggestedDescription", "suggestedRTO", "suggestedRPO", "impactNarrative", "suggestedResources"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    return null;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};