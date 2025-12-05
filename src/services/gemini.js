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

// --- 5. التحليل النهائي (تحديث بسيط) ---
export const generateFinalAnalysis = async (session, oldProfile) => {
  // ... (نفس الكود القديم)
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

// --- 7. توليد كورس جديد (Create Course) ---
export const generateNewCourseAI = async (topic) => {
  // ... (نفس الكود القديم)
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

// --- 8. توليد جدول الرحلة (Journey Map) ---
export const generateCourseScheduleAI = async (courseDetails, userRoutine, userProfile) => {
  const prompt = `
    Act as a strict time-management coach.
    
    Context:
    - Course: "${courseDetails.title}" (${courseDetails.lessons.length} lessons)
    - User Routine: "${userRoutine}"
    - Today's Date: ${new Date().toISOString().split('T')[0]}
    
    Task: 
    Create a realistic schedule starting from TOMORROW.
    Assign each lesson a specific Date (YYYY-MM-DD) and Time (HH:MM AM/PM).
    Spread lessons logically (e.g., 1-2 lessons per day depending on routine).
    
    Return a strictly valid JSON object:
    {
      "roadmap": [
        {
          "lessonIndex": 0,
          "date": "YYYY-MM-DD",
          "time": "HH:MM AM/PM",
          "status": "unlocked",
          "type": "lesson"
        },
        {
           "lessonIndex": 1,
           "date": "YYYY-MM-DD",
           "time": "HH:MM AM/PM",
           "status": "locked",
           "type": "lesson"
        }
        // ... map ALL lessons
      ],
      "finalExamDate": "YYYY-MM-DD"
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

// --- 9. توليد الامتحان النهائي للكورس ---
export const generateCourseFinalExam = async (courseTitle, lessons) => {
  const prompt = `
      Generate a comprehensive final exam for the course: "${courseTitle}".
      Topics: ${lessons ? lessons.map(l => l.title).join(', ') : 'General topics'}.
      
      Return a JSON array of 10 questions:
      [
        {
          "id": "final_1",
          "type": "mcq",
          "question": "...",
          "options": [{"value":"a", "label":"..."}, ...],
          "correctAnswer": "a",
          "difficulty": "hard"
        }
        // ... 10 questions
      ]
    `;
  try {
    const res = await model.generateContent(prompt);
    return JSON.parse(res.response.text().replace(/```json|```/g, "").trim());
  } catch (e) { return []; }
};