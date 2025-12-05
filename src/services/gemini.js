import { GoogleGenerativeAI } from "@google/generative-ai";

// تهيئة الاتصال بـ Google Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateUserAnalysis = async (answers) => {
  const prompt = `
    Act as an expert AI in Psychology and Software Engineering Education.
    Analyze the following user answers collected during an onboarding process:
    ${JSON.stringify(answers)}

    Based on these answers, generate a strictly valid JSON object (no markdown, no plain text) representing the user's profile with the following structure:
    {
      "mindprint": {
        "energyPattern": "string (e.g., morning_person, night_owl)",
        "stressResponse": "string (e.g., moderate, high, low)",
        "focusDuration": number (in hours),
        "traits": {
          "openness": number (0-100),
          "conscientiousness": number (0-100),
          "resilience": number (0-100)
        }
      },
      "codingGenome": {
        "level": "string (Beginner, Intermediate, Advanced)",
        "strengths": ["string", "string", "string"],
        "weaknesses": ["string", "string"],
        "preferredLearningStyle": "string",
        "codingSpeed": number (0-100),
        "problemSolvingScore": number (0-100)
      },
      "lifeTrajectory": {
        "goal": "string",
        "timeframe": "string",
        "field": "string",
        "motivation": "string"
      }
    }
    
    Ensure the analysis is realistic and derived from the provided answers.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // تنظيف النص من أي علامات Markdown قد يضيفها النموذج
    const jsonString = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating analysis:", error);
    // بيانات احتياطية في حالة الفشل (Fallback)
    return null;
  }
};

export const generateDailyTasks = async (userProfile, currentMood) => {
    const prompt = `
      Based on the user profile: ${JSON.stringify(userProfile)}
      And their current mood: "${currentMood}"
      Generate 3 specific daily tasks (1 technical, 1 wellness, 1 psychological) in JSON format:
      [
        { "id": 1, "title": "task title", "type": "technical", "duration": 30 },
        { "id": 2, "title": "task title", "type": "wellness", "duration": 10 },
        { "id": 3, "title": "task title", "type": "psychology", "duration": 15 }
      ]
      Translate titles to Arabic if possible or keep concise English.
    `;
    
    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, "").trim();
        return JSON.parse(text);
    } catch (e) {
        return [];
    }
};  