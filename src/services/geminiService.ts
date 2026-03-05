import { GoogleGenAI, Type } from "@google/genai";
import { PriceHistoryPoint, PlatformPrice } from "../components/Charts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface MacroSignal {
  title: string;
  subtitle: string;
  iconType: 'sale' | 'surplus' | 'launch';
}

export interface ProductData {
  name: string;
  description: string;
  rating: number;
  priceHistory: PriceHistoryPoint[];
  platformPrices: PlatformPrice[];
  confidenceScore: number;
  priceForecast: {
    dropAmount: number;
    days: number;
    sparkline: number[];
  };
  inventoryRisk: 'Low' | 'Medium' | 'High';
  macroSignals: MacroSignal[];
  bestDeal: {
    store: string;
    price: number;
  };
  savings: number;
  avgPrice: number;
  imageUrl: string;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    rating: { type: Type.NUMBER },
    priceHistory: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.STRING },
          price: { type: Type.NUMBER }
        },
        required: ["month", "price"]
      }
    },
    platformPrices: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          price: { type: Type.NUMBER },
          color: { type: Type.STRING }
        },
        required: ["name", "price", "color"]
      }
    },
    confidenceScore: { type: Type.NUMBER },
    priceForecast: {
      type: Type.OBJECT,
      properties: {
        dropAmount: { type: Type.NUMBER },
        days: { type: Type.NUMBER },
        sparkline: {
          type: Type.ARRAY,
          items: { type: Type.NUMBER }
        }
      },
      required: ["dropAmount", "days", "sparkline"]
    },
    inventoryRisk: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
    macroSignals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          iconType: { type: Type.STRING, enum: ["sale", "surplus", "launch"] }
        },
        required: ["title", "subtitle", "iconType"]
      }
    },
    bestDeal: {
      type: Type.OBJECT,
      properties: {
        store: { type: Type.STRING },
        price: { type: Type.NUMBER }
      },
      required: ["store", "price"]
    },
    savings: { type: Type.NUMBER },
    avgPrice: { type: Type.NUMBER },
    imageUrl: { type: Type.STRING }
  },
  required: [
    "name", "description", "rating", "priceHistory", "platformPrices", 
    "confidenceScore", "priceForecast", "inventoryRisk", "macroSignals", 
    "bestDeal", "savings", "avgPrice", "imageUrl"
  ]
};

export async function fetchProductData(query: string): Promise<ProductData> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate realistic e-commerce analytics data for the product: "${query}". 
    The data should include price history for the last 6 months, current prices on major Indian platforms (Amazon, Flipkart, Croma, Reliance), 
    AI predictions, and market signals. Prices should be in Indian Rupees (₹).
    For imageUrl, provide a relevant high-quality Unsplash URL if possible, or a picsum URL with a relevant seed.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema as any
    }
  });

  return JSON.parse(response.text);
}
