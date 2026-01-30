import { GoogleGenAI } from "@google/genai";
import { UserProfile, DailyLog, HealthMetrics, Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHealthAdvice = async (
  profile: UserProfile,
  recentLogs: DailyLog[],
  metrics: HealthMetrics,
  lang: Language
): Promise<string> => {
  const model = "gemini-3-flash-preview";

  const langInstruction = lang === 'pt' ? 'português do Brasil' : 'English';

  const prompt = `
    Act as a sports nutrition, endocrinology, and physical education expert.
    Analyze the user data below and provide 3 practical and motivational suggestions (short and direct) to help reach the goal.
    
    Profile:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Height: ${profile.height} cm
    - Start Weight: ${profile.currentWeight} kg
    - Goal Weight: ${profile.targetWeight} kg
    - BMR: ${metrics.bmr} kcal
    - TDEE: ${metrics.tdee} kcal
    - Daily Deficit Needed: ${metrics.dailyDeficitRequired} kcal
    - Is on track? ${metrics.isOnTrack ? "Yes" : "No"}
    
    Recent Logs (Last 5 days):
    ${JSON.stringify(recentLogs.slice(-5))}
    
    If there is sleep data, comment on recovery. If there are caloric deviations, suggest gentle corrections.
    IMPORTANT: Respond in ${langInstruction}. Use markdown to format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || (lang === 'pt' ? "Não foi possível gerar sugestões no momento." : "Could not generate advice at the moment.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'pt' 
      ? "Ocorreu um erro ao tentar conectar com a IA. Tente novamente mais tarde." 
      : "An error occurred while connecting to AI. Please try again later.";
  }
};