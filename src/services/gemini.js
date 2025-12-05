import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- 1. تحليل البداية (Onboarding) ---
export const generateUserAnalysis = async (answers) => {
  const prompt = `
    Analyze these onboarding answers: ${JSON.stringify(answers)}
    Return valid JSON with: { mindprint: {...}, codingGenome: {...}, lifeTrajectory: {...} }
    Ensure "codingGenome.level" is one of: "beginner", "intermediate", "advanced".
  `;
  try {
    const res = await model.generateContent(prompt);
    return JSON.parse(res.response.text().replace(/```json|```/g, "").trim());
  } catch (e) { return null; }
};

// --- 2. توليد المهام اليومية (Dashboard) ---
export const generateDailyTasksAI = async (userProfile, mood) => {
  const prompt = `
    Based on user level "${userProfile.codingGenome.level}" and current mood "${mood}",
    Generate 4 daily tasks. Return JSON array:
    [
      { "id": 1, "title": "Arabic Title", "type": "technical" | "wellness" | "psychology" | "learning", "duration": number }
    ]
  `;
  try {
    const res = await model.generateContent(prompt);
    return JSON.parse(res.response.text().replace(/```json|```/g, "").trim());
  } catch (e) { return []; }
};

// --- 3. توليد الأسئلة (Assessment) ---
export const generateTechnicalQuestions = async (userProfile) => {
  const prompt = `
    Generate 5 technical questions for a ${userProfile.level} level developer.
    Return JSON array: [{ "id": "unique", "type": "mcq" | "debug", "question": "...", "options": [...], "correctAnswer": "...", "difficulty": "..." }]
  `;
  try {
    const res = await model.generateContent(prompt);
    return JSON.parse(res.response.text().replace(/```json|```/g, "").trim());
  } catch (e) { return []; }
};

// --- 4. تصحيح الإجابة (Intervention Controller) ---
export const evaluateAnswerAI = async (question, answer, time) => {
  const prompt = `
    Evaluate answer: Question: "${question.question}", Answer: "${answer}", Time: ${time}s.
    Return JSON: { "isCorrect": bool, "score": number, "feedback": "...", "stressDetected": bool }
  `;
  try {
    const res = await model.generateContent(prompt);
    return JSON.parse(res.response.text().replace(/```json|```/g, "").trim());
  } catch (e) { return { isCorrect: false, score: 0, stressDetected: false }; }
};

// --- 5. التحليل النهائي (Final Report) ---
export const generateFinalAnalysis = async (session, oldProfile) => {
  const prompt = `
    Analyze session: ${JSON.stringify(session)}. Update profile: ${JSON.stringify(oldProfile)}.
    Return JSON: { "finalScore": number, "summary": "...", "updatedCodingGenome": {...}, "updatedMindprint": {...} }
  `;
  try {
    const res = await model.generateContent(prompt);
    return JSON.parse(res.response.text().replace(/```json|```/g, "").trim());
  } catch (e) { return null; }
};

// --- 6. بناء المنهج (Course Setup) ---
export const generateCurriculumAI = async (hours, days, profile) => {
  const prompt = `
    Create a study plan for ${profile.level} developer for ${days} days, ${hours} total hours.
    Return JSON array of days: [{ "day": 1, "topics": ["..."], "focus": "..." }]
  `;
  try {
    const res = await model.generateContent(prompt);
    return JSON.parse(res.response.text().replace(/```json|```/g, "").trim());
  } catch (e) { return []; }
};

// --- 7. توليد كورس جديد كامل (Create Course) ---
export const generateNewCourseAI = async (topic) => {
  const prompt = `
    Act as a professional curriculum designer.
    Create a detailed course structure for the topic: "${topic}".
    Return a strictly valid JSON object with this structure:
    {
      "id": "generated_${Date.now()}",
      "title": "Professional Course Title",
      "description": "Brief engaging description (max 20 words)",
      "difficulty": "beginner" | "intermediate" | "advanced",
      "duration": "XX hours",
      "lessonsCount": number,
      "lessons": [
        { "title": "Lesson 1 Title", "duration": "15m", "content": "Brief content summary" },
        { "title": "Lesson 2 Title", "duration": "20m", "content": "Brief content summary" }
      ]
    }
    Make sure the content is educational and structured. Translate titles/descriptions to Arabic if the input was Arabic.
  `;
  
  try {
    const res = await model.generateContent(prompt);
    return JSON.parse(res.response.text().replace(/```json|```/g, "").trim());
  } catch (e) {
    console.error("Course Generation Error", e);
    return null;
  }
};

// --- 8. توليد مسار زمني مفصل للكورس (Smart Schedule) ---
export const generateCourseScheduleAI = async (courseDetails, userRoutine, userProfile) => {
  const prompt = `
    Act as a personal productivity coach and curriculum expert.
    
    Context:
    - User Profile: ${JSON.stringify(userProfile)}
    - User's Daily Routine/Constraints: "${userRoutine}"
    - Target Course: "${courseDetails.title}" (Difficulty: ${courseDetails.difficulty})
    - Course Lessons: ${JSON.stringify(courseDetails.lessons)}

    Task:
    Create a realistic, day-by-day study path to complete this course.
    The schedule MUST respect the user's routine (e.g., if they work 9-5, schedule tasks in the evening).
    
    Return a strictly valid JSON object with this structure:
    {
      "startDate": "YYYY-MM-DD (assume tomorrow)",
      "estimatedCompletionDate": "YYYY-MM-DD",
      "dailyIntensity": "Low/Medium/High",
      "roadmap": [
        {
          "day": 1,
          "topic": "Focus of the day",
          "tasks": [
            { "time": "HH:MM (e.g., 19:00)", "activity": "Study: Lesson Name", "duration": "45m" },
            { "time": "HH:MM", "activity": "Practical Exercise / Quiz", "duration": "20m" }
          ],
          "note": "Brief motivation or tip based on user profile"
        }
        // ... Generate enough days to cover all lessons
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Schedule Generation Error", error);
    return null;
  }
};