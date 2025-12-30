
import { GoogleGenAI, Type } from "@google/genai";
import { CustomerData, PredictionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getChurnPrediction = async (data: CustomerData): Promise<PredictionResult> => {
  const prompt = `
    Act as a Senior ML Engineer. Analyze this customer data for churn:
    - Tenure: ${data.tenure} months
    - Monthly Charges: ₹${data.monthlyCharges}
    - Contract: ${data.contract}
    - Service: ${data.internetService}
    
    Return a JSON response following this schema:
    - churnProbability (0-1)
    - riskLevel (Low/Medium/High/Critical)
    - topFactors (Array of {factor: string, weight: number})
    - recommendation (Business strategy)
    - reasoning (ML explanation)
    - modelComparison (Array of {name: string, score: number} for Logistic Regression, Random Forest, XGBoost)
    
    The reasoning should mention feature engineering like 'tenure groups' or 'interaction terms'.
  `;

  // Use ai.models.generateContent for both model name and prompt
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          churnProbability: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING },
          topFactors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                factor: { type: Type.STRING },
                weight: { type: Type.NUMBER }
              }
            }
          },
          recommendation: { type: Type.STRING },
          reasoning: { type: Type.STRING },
          modelComparison: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.NUMBER }
              }
            }
          }
        },
        required: ["churnProbability", "riskLevel", "topFactors", "recommendation", "reasoning", "modelComparison"]
      }
    }
  });

  // Extract text using response.text property (not a method) as per SDK guidelines
  const jsonStr = response.text || "{}";
  return JSON.parse(jsonStr);
};

export const getPortfolioAssets = async () => {
  const prompt = `
    Generate a concise, professional Python script using scikit-learn and XGBoost for Telco Churn prediction.
    Also generate a README.md for a GitHub repository titled 'ChurnGuard-ML'.
    Format as JSON with keys 'pythonCode' and 'readme'.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pythonCode: { type: Type.STRING },
          readme: { type: Type.STRING }
        }
      }
    }
  });

  // Extract text using response.text property safely
  const jsonStr = response.text || "{}";
  return JSON.parse(jsonStr);
};
