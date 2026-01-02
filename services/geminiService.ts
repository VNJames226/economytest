import { GoogleGenAI } from "@google/genai";
import { PlayerData } from "../types";

export const getFinancialAdvice = async (player: PlayerData): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "KI-Berater ist deaktiviert (Kein API Key konfiguriert).";
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Du bist der Finanzberater des Voidnest.de Minecraft Servers. 
      Analysiere das Vermögen von Spieler "${player.username}".
      Aktuelles Guthaben: ${player.balance} Euro (€).
      Gib dem Spieler 3 kurze, motivierende Tipps im Minecraft-Stil, wie er mehr Euro verdienen kann (Jobs, Handel, Farmen).`,
    });
    
    return response.text || "Farme fleißig weiter, um dein Imperium zu vergrößern!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Die Void-Energie stört gerade meine Vorhersagen. Komm später wieder!";
  }
};