import { GoogleGenerativeAI } from "@google/generative-ai";
import { Result } from "./types";
import * as dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

// Fallback explanation if API fails or key is missing
const FALLBACK_EXPLANATION =
  "This option was recommended based on the highest overlap of participant availability and location preferences. It aims to maximize attendance while keeping travel distance reasonable for the majority of the group.";

export async function generateExplanation(result: Result): Promise<string> {
  if (!API_KEY) {
    console.warn("GEMINI_API_KEY is missing. Using fallback explanation.");
    return FALLBACK_EXPLANATION;
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const bestOption = result.bestOption;
    const alternatives = result.alternatives.map(a => `${a.title} (${a.fairnessScore}% fairness)`).join(", ");

    const prompt = `
        You are an AI assistant for a group decision support app called 'Common Ground Finder'.
        
        Task: Explain why this specific option was recommended to the group.
        
        Recommendation Data (Mocked):
        - Title: ${bestOption.title}
        - Time: ${bestOption.day} ${bestOption.time}
        - Venue: ${bestOption.location}
        - Fairness Score: ${bestOption.fairnessScore} (out of 100)
        - Attendees: ${bestOption.attendees.length} people
        - Pros: ${bestOption.pros.join(", ")}
        - Alternatives considered: ${alternatives}

        Instructions:
        1. Explain the decision in clear, non-technical language.
        2. Reference fairness, availability, and location balance.
        3. Mention trade-offs honestly if relevant.
        4. Do NOT invent new data or facts not present here.
        5. Do NOT sound promotional. Keep the tone neutral, calm, and transparent.
        6. Do NOT say "AI decided". Say "This option was recommended because..." or "The system selected...".
        7. Keep it under 3 sentences.

        Output:
        `;

    const resultGen = await model.generateContent(prompt);
    const response = await resultGen.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Error generating explanation with Gemini:", error);
    return FALLBACK_EXPLANATION;
  }
}
