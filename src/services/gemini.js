import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // يفضل استخدام موديل سريع وذكي

// --- Helper: Safe JSON Extractor ---
// دالة لتنظيف ردود الـ AI واستخراج الـ JSON فقط لمنع الأخطاء
const parseAIResponse = (text) => {
    try {
        // 1. إزالة كتل الكود Markdown
        let clean = text.replace(/```json|```/g, "");
        
        // 2. تحديد بداية ونهاية الـ JSON
        const firstBracket = clean.indexOf('[');
        const firstBrace = clean.indexOf('{');
        
        let startIndex = -1;
        let endIndex = -1;

        // تحديد ما إذا كان الرد مصفوفة أم كائن
        if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
            startIndex = firstBracket;
            endIndex = clean.lastIndexOf(']') + 1;
        } else if (firstBrace !== -1) {
            startIndex = firstBrace;
            endIndex = clean.lastIndexOf('}') + 1;
        }

        // 3. القص والتحليل
        if (startIndex !== -1 && endIndex !== -1) {
            clean = clean.substring(startIndex, endIndex);
            return JSON.parse(clean);
        } else {
            return JSON.parse(clean.trim());
        }
    } catch (error) {
        console.error("AI JSON Parsing Failed:", error);
        console.log("Original Text:", text); 
        return null; 
    }
};

// 1. Onboarding معقد
export const generateOnboardingQuestionsAI = async () => {
    const prompt = `
        Act as a Psychological & Technical Profiler.
        Generate 5 diverse onboarding questions.
        
        Mix these types:
        1. "psychology": Behavior/Stress check (MCQ).
        2. "logic_puzzle": A conceptual problem solving question (No code needed, just logic MCQ).
        3. "spot_concept": A technical concept question (e.g., "What principle is violated here?").
        4. "career_goal": Future path.

        Format (JSON Array):
        [{ "id": "q1", "category": "psychology", "type": "mcq", "question": "...", "options": [...] }]
    `;
    try {
        const res = await model.generateContent(prompt);
        return parseAIResponse(res.response.text()) || [];
    } catch (e) { return []; }
};

// --- 2. تحليل الإجابات وتحديد المسار (محدث) ---
export const generateUserAnalysis = async (answers) => {
  const prompt = `
    Analyze these onboarding answers: ${JSON.stringify(answers)}
    
    Task:
    1. Create a "Mindprint" (Psychological Profile).
    2. Create a "Coding Genome" (Technical Level).
    3. CRITICAL: Decide if the user is "eligibleForFinalExam" (Advanced/Expert) or needs the "learningPath" (Beginner/Intermediate).
    
    Return valid JSON: 
    { 
        "mindprint": { "traits": { "focus": 80, "resilience": 70, "openness": 90 } }, 
        "codingGenome": { "level": "beginner" | "intermediate" | "advanced", "strengths": ["..."] }, 
        "lifeTrajectory": { "goal": "...", "timeframe": "..." },
        "recommendation": {
            "isEligibleForExam": boolean,
            "reason": "Brief reason in Arabic why they are eligible or need to learn first."
        }
    }
  `;
  try {
    const res = await model.generateContent(prompt);
    return parseAIResponse(res.response.text());
  } catch (e) { return null; }
};

// --- 2. توليد المهام اليومية (محدث) ---
export const generateDailyTasksAI = async (userProfile, mood, dueLessons = []) => {
  // صياغة سياق الدروس المستحقة اليوم
  const lessonsContext = dueLessons.length > 0 
    ? `IMPORTANT: The user has these SPECIFIC technical lessons scheduled for today: ${JSON.stringify(dueLessons.map(l => l.title))}. You MUST include them as the first tasks in the list with type 'technical'.` 
    : "No specific course lessons scheduled for today. Suggest general revision or skill practice.";

  const prompt = `
    Act as a Smart Productivity Assistant.
    User Context: Level "${userProfile.codingGenome.level}", Current Mood "${mood}".
    ${lessonsContext}
    
    Task: Generate a balanced daily to-do list (3-5 items).
    1. If there are scheduled lessons, put them FIRST.
    2. Add complementary tasks (wellness, psychology, or review) based on the mood.
    
    Return JSON array:
    [
      { "id": 1, "title": "Task Title (Arabic)", "type": "technical" | "wellness" | "psychology" | "learning", "duration": number (minutes) }
    ]
  `;
  try {
    const res = await model.generateContent(prompt);
    return parseAIResponse(res.response.text()) || [];
  } catch (e) { return []; }
};

// 3. تحديث الأسئلة التقنية (التدريب) لتكون متنوعة
export const generateTechnicalQuestions = async (userProfile) => {
  const prompt = `
    Generate 5 technical questions for a ${userProfile.level} developer.
    CRITICAL: Do NOT just use MCQs. VARY the types to test depth.
    
    Types to include:
    1. "mcq": Conceptual.
    2. "spot_bug": Provide a small code snippet with a bug.
    3. "fill_code": Code with a blank.
    
    JSON Format:
    [
      { "id": "1", "type": "spot_bug", "question": "Find the error", "codeSnippet": "...", "correctAnswer": "..." },
      { "id": "2", "type": "mcq", "question": "...", "options": [...] }
    ]
  `;
  try {
    const res = await model.generateContent(prompt);
    return parseAIResponse(res.response.text()) || [];
  } catch (e) { return []; }
};

// --- 4. Evaluate Answer ---
export const evaluateAnswerAI = async (question, answer, time) => {
  const prompt = `
    Evaluate answer: Question: "${question.question}", Answer: "${answer}", Time: ${time}s.
    Return JSON: { "isCorrect": bool, "score": number, "feedback": "...", "stressDetected": bool }
  `;
  try {
    const res = await model.generateContent(prompt);
    return parseAIResponse(res.response.text()) || { isCorrect: false, score: 0, stressDetected: false };
  } catch (e) { return { isCorrect: false, score: 0, stressDetected: false }; }
};

// --- 5. Final Analysis (Practice) ---
export const generateFinalAnalysis = async (session, oldProfile) => {
  const prompt = `
    Analyze session: ${JSON.stringify(session)}. Update profile: ${JSON.stringify(oldProfile)}.
    Return JSON: { "finalScore": number, "summary": "...", "updatedCodingGenome": {...}, "updatedMindprint": {...} }
  `;
  try {
    const res = await model.generateContent(prompt);
    return parseAIResponse(res.response.text());
  } catch (e) { return null; }
};

// --- 6. Curriculum ---
export const generateCurriculumAI = async (hours, days, profile) => {
  const prompt = `
    Create a study plan for ${profile.level} developer for ${days} days, ${hours} total hours.
    Return JSON array of days: [{ "day": 1, "topics": ["..."], "focus": "..." }]
  `;
  try {
    const res = await model.generateContent(prompt);
    return parseAIResponse(res.response.text()) || [];
  } catch (e) { return []; }
};

// --- 7. New Course ---
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
  `;
  try {
    const res = await model.generateContent(prompt);
    return parseAIResponse(res.response.text());
  } catch (e) { return null; }
};

// --- 8. Schedule (محدث ليبدأ من اليوم) ---
export const generateCourseScheduleAI = async (courseDetails, userRoutine, userProfile) => {
  const prompt = `
    Act as a strict time-management coach.
    Context:
    - Course: "${courseDetails.title}"
    - User Routine: "${userRoutine}"
    - Today's Date: ${new Date().toISOString().split('T')[0]}
    
    Task: Create a realistic schedule starting from TODAY.
    Return a strictly valid JSON object:
    {
      "roadmap": [
        {
          "lessonIndex": 0,
          "date": "YYYY-MM-DD",
          "time": "HH:MM AM/PM",
          "status": "unlocked",
          "type": "lesson"
        }
      ],
      "finalExamDate": "YYYY-MM-DD"
    }
  `;
  try {
    const result = await model.generateContent(prompt);
    return parseAIResponse(result.response.text());
  } catch (error) { return null; }
};

// --- 9. Complex Final Exam Generation (Updated) ---
export const generateCourseFinalExam = async (courseTitle, lessons) => {
  const topics = lessons ? lessons.map(l => l.title).join(', ') : 'Core concepts';
  const prompt = `
      Act as a Brutal Senior Technical Interviewer & Cognitive Psychologist.
      Generate a high-intensity final exam for: "${courseTitle}".
      Topics: ${topics}.
      
      Generate 5-7 questions. You MUST vary the "type" to squeeze the user's brain.
      
      Supported Types:
      1. "mcq": Hard multiple choice with tricky distractors.
      2. "spot_bug": Provide code with a subtle logic/syntax error. User must find the line number or fix it.
      3. "fill_code": Code with missing critical parts (____).
      4. "logic_order": A list of steps/code lines that need to be arranged correctly.
      
      Response Format (Strict JSON Array):
      [
        {
          "id": "q1",
          "type": "spot_bug",
          "question": "Find the bug in this memory management code. It causes a leak.",
          "codeSnippet": "function create() {\\n  const data = new Array(1000);\\n  // ... missing cleanup\\n  return () => console.log(data);\\n}",
          "correctAnswer": "Closure retains 'data' indefinitely",
          "difficulty": "hard"
        },
        {
          "id": "q2",
          "type": "logic_order",
          "question": "Arrange these lines to fetch data and handle errors correctly.",
          "items": ["try {", "const res = await fetch(url);", "const data = await res.json();", "} catch(e) { console.error(e) }"],
          "correctOrder": [0, 1, 2, 3] // Indices
        }
        // ... more questions
      ]
    `;
  try {
    const res = await model.generateContent(prompt);
    return parseAIResponse(res.response.text()) || [];
  } catch (e) { return []; }
};

// --- 10. Evaluate Final Exam ---
export const evaluateFinalExamSession = async (courseTitle, questions, userAnswers, totalTime) => {
    const prompt = `
      Act as a Final Exam Examiner for: "${courseTitle}".
      Data:
      Questions: ${JSON.stringify(questions)}
      User Answers: ${JSON.stringify(userAnswers)}
      
      Return STRICT JSON:
      {
        "score": number (0-100),
        "passed": boolean,
        "emotionalState": "Confident" | "Hesitant" | "Anxious",
        "feedback": "Summary string.",
        "strengths": ["..."],
        "weaknesses": ["..."]
      }
    `;
    try {
        const res = await model.generateContent(prompt);
        return parseAIResponse(res.response.text());
    } catch (e) {
        return { score: 0, passed: false, feedback: "Error in grading." };
    }
};

// --- 11. Remedial Plan (Recovery) ---
export const generateRemedialPlan = async (courseTitle, examResults, weaknesses) => {
    const prompt = `
      Act as an AI Tutor. The student failed the final exam for "${courseTitle}".
      Weaknesses: ${JSON.stringify(weaknesses)}
      
      Task: Create a "Recovery Path" of 2 lessons.
      IMPORTANT: Return ONLY the JSON Array. No intro text.
      
      Return JSON:
      [
        {
          "title": "Remedial: Topic",
          "duration": "10m",
          "description": "...",
          "content": "..."
        }
      ]
    `;
    try {
        const res = await model.generateContent(prompt);
        const result = parseAIResponse(res.response.text());
        return Array.isArray(result) ? result : [];
    } catch (e) { return []; }
};