import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY?.trim();

export const geminiClient = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

export const isGeminiConfigured = Boolean(apiKey && apiKey.length > 5);

export const defaultModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
