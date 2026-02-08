import { GoogleGenerativeAI } from "@google/generative-ai";
import { Language } from "../types";

// Vite utilitza import.meta.env per accedir a les variables d'entorn
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateNewGame(lang: Language) {
  const prompt = `Start a new "What am I?" game in ${lang === Language.CATALAN ? 'Catalan' : 'Spanish'}. 
  Pick a common object, animal, or profession. 
  Provide the name of the object and an initial cryptic but fun clue. 
  Return as JSON.`;

  // Fem servir el model 1.5 Flash que és molt ràpid i estable
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

export async function evaluateGuess(lang: Language, secretObject: string, guess: string, history: any[]) {
  const prompt = `The user guessed "${guess}" for the secret object "${secretObject}" in ${lang === Language.CATALAN ? 'Catalan' : 'Spanish'}.
  Current history: ${JSON.stringify(history)}
  If the guess is correct (or very close), confirm it. 
  If incorrect, provide a helpful hint without giving away the answer.
  Return JSON with format: {"isCorrect": boolean, "feedback": "string"}`;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}
