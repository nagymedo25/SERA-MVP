import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import * as AI from '../services/gemini'

const useSimulationStore = create(
    persist(
        (set, get) => ({
            // =================================================
            // 1. الحالة العامة (State)
            // =================================================
            user: null,
            registeredUsers: [],
            courses: [], 
            enrolledCourses: [], 
            completedLessons: [],
            assessmentHistory: [],
            dailyTasks: [], 
            
            // حالات واجهة المستخدم
            isAnalyzing: false, 
            isGeneratingQuestions: false,
            isEvaluating: false,
            showBreathingExercise: false, 
            currentMode: 'neutral',
            
            // حالات التقييم والامتحانات
            currentAssessmentQuestions: [],
            assessmentSession: [],
            onboardingQuestions: [],
            
            // ✅ حالة التقرير النهائي (Exam)
            finalReport: null,
            // ✅ حالة نتيجة الـ Onboarding (نقلت للستور لدعم المطور)
            onboardingResult: null,

            // =================================================
            // 2. وظائف المطور (Dev Tools) - المحدثة
            // =================================================
// ✅ تحديث دالة المطور لتجاوز الـ Onboarding بقوة
            forcePassExam: () => {
                const { user, courses } = get();

                // السيناريو 1: المستخدم في Onboarding
                if (user && !user.hasCompletedOnboarding) {
                    const fakeExpertProfile = {
                        mindprint: { traits: { focus: 95, resilience: 90, openness: 85 } },
                        codingGenome: { level: 'advanced', strengths: ['Algorithms', 'System Design', 'React'], problemSolvingScore: 98 },
                        lifeTrajectory: { goal: 'Senior Architect', timeframe: 'Immediate', field: 'Full Stack' },
                        recommendation: {
                            isEligibleForExam: true,
                            reason: "Developer Override: تم رصد مستوى خبير. تجاوز المسار التعليمي."
                        }
                    };

                    set(state => ({
                        user: { 
                            ...state.user, 
                            hasCompletedOnboarding: true,
                            ...fakeExpertProfile
                        },
                        onboardingResult: fakeExpertProfile.recommendation,
                        isAnalyzing: false,
                        isGeneratingQuestions: false
                    }));
                    return; 
                }

                // السيناريو 2: المستخدم في كورس (اجتياز الامتحان)
                const activeCourse = courses.find(c => c.isScheduled) || courses[0];
                if (!activeCourse) return;

                const fakeSuccessReport = {
                    score: 100,       
                    finalScore: 100,
                    passed: true,
                    summary: "Developer Override: Outstanding performance demonstrated across all modules.",
                    feedback: "تم اجتياز الاختبار بنجاح تام عبر وضع المطور. الأداء مثالي.",
                    emotionalState: "Confident"
                };

                set(state => {
                    const newHistory = {
                        date: new Date().toISOString(),
                        type: 'Dev Override',
                        courseTitle: activeCourse.title,
                        score: 100,
                        passed: true,
                        summary: fakeSuccessReport.summary
                    };

                    const updatedCourses = state.courses.map(c => 
                        c.id === activeCourse.id 
                        ? { ...c, hasCertificate: true, completedAt: new Date().toISOString() } 
                        : c
                    );

                    return {
                        assessmentHistory: [...state.assessmentHistory, newHistory],
                        courses: updatedCourses,
                        finalReport: fakeSuccessReport,
                        isAnalyzing: false,
                        isGeneratingQuestions: false
                    };
                });
            },

            clearFinalReport: () => set({ finalReport: null }),
            // دالة لتنظيف الـ Onboarding عند الخروج
            clearOnboardingResult: () => set({ onboardingResult: null }),

            // =================================================
            // 3. إدارة الكورسات وباقي الدوال (كما هي)
            // =================================================
            addNewCourseAI: async (topic) => {
                set({ isAnalyzing: true });
                const newCourse = await AI.generateNewCourseAI(topic);
                if (newCourse) {
                    newCourse.image = `/course-${Math.floor(Math.random() * 3) + 1}.jpg`;
                    newCourse.isScheduled = false; 
                    set(state => ({ courses: [newCourse, ...state.courses], isAnalyzing: false }));
                    return true;
                }
                set({ isAnalyzing: false });
                return false;
            },

            deleteCourse: (courseId) => {
                set(state => ({
                    courses: state.courses.filter(c => c.id !== courseId || !c.hasCertificate),
                    enrolledCourses: state.enrolledCourses.filter(id => id !== courseId)
                }));
            },

            updateCourse: (courseId, updatedData) => {
                set(state => ({
                    courses: state.courses.map(c => c.id === courseId ? { ...c, ...updatedData } : c)
                }));
            },

            generateCourseSchedule: async (courseId, routineDescription) => {
                const { user, courses } = get();
                const course = courses.find(c => c.id === courseId);
                if (!course) return false;
                const schedule = await AI.generateCourseScheduleAI(course, routineDescription, user);
                if (schedule) {
                    set(state => ({
                        courses: state.courses.map(c => c.id === courseId ? { ...c, schedule: schedule, isScheduled: true } : c),
                        enrolledCourses: [...state.enrolledCourses, courseId]
                    }));
                    return true;
                }
                return false;
            },

            completeLesson: (lessonId) => {
                const parts = lessonId.split('_');
                const lessonIndexStr = parts.pop(); 
                const courseId = parts.join('_');   
                const lIdx = parseInt(lessonIndexStr); 
                set(state => {
                    const newCompleted = [...state.completedLessons, lessonId];
                    const updatedCourses = state.courses.map(c => {
                        if (c.id !== courseId || !c.schedule) return c;
                        const newRoadmap = c.schedule.roadmap.map(node => {
                            if (node.lessonIndex === lIdx) return { ...node, status: 'unlocked' };
                            if (node.lessonIndex === lIdx - 1) return { ...node, status: 'completed' };
                            return node;
                        });
                        return { ...c, schedule: { ...c.schedule, roadmap: newRoadmap } };
                    });
                    return { completedLessons: newCompleted, courses: updatedCourses };
                });
            },

             simulateCompleteLesson: (courseId, lessonIndex) => {
                const lessonId = `${courseId}_1_${lessonIndex + 1}`; 
                set(state => {
                    const newCompleted = [...state.completedLessons, lessonId];
                    const updatedCourses = state.courses.map(c => {
                        if (c.id !== courseId || !c.schedule) return c;
                        const newRoadmap = c.schedule.roadmap.map(node => {
                            if (node.lessonIndex === lessonIndex) return { ...node, status: 'completed' };
                            if (node.lessonIndex === lessonIndex + 1) return { ...node, status: 'unlocked' }; 
                            return node;
                        });
                        return { ...c, schedule: { ...c.schedule, roadmap: newRoadmap } };
                    });
                    return { completedLessons: newCompleted, courses: updatedCourses };
                });
            },
            
            startFinalExam: async (courseId) => {
                const course = get().courses.find(c => c.id === courseId);
                set({ isGeneratingQuestions: true, currentAssessmentQuestions: [], assessmentSession: [] });
                const questions = await AI.generateCourseFinalExam(course.title, course.lessons);
                if (questions && questions.length > 0) {
                    set({ currentAssessmentQuestions: questions, isGeneratingQuestions: false });
                } else {
                    console.warn("AI failed to generate specific exam.");
                    set({ isGeneratingQuestions: false });
                }
            },

            submitFinalExam: async (courseId, userAnswers, totalTime) => {
                set({ isAnalyzing: true });
                const course = get().courses.find(c => c.id === courseId);
                const questions = get().currentAssessmentQuestions;

                const sessionData = questions.map(q => ({
                    ...q,
                    userAnswer: userAnswers[q.id]?.answer,
                    isCorrect: userAnswers[q.id]?.answer === q.correctAnswer
                }));
                
                set({ assessmentSession: sessionData });

                const result = await AI.evaluateFinalExamSession(course.title, questions, userAnswers, totalTime);

                if (result) {
                    set(state => {
                        const newHistory = {
                            date: new Date().toISOString(),
                            type: 'Final Exam',
                            courseTitle: course.title,
                            score: result.score,
                            passed: result.passed,
                            summary: result.feedback
                        };
                        
                        let updatedCourses = state.courses;
                        if (result.passed) {
                            updatedCourses = state.courses.map(c => 
                                c.id === courseId 
                                ? { ...c, hasCertificate: true, completedAt: new Date().toISOString() } 
                                : c
                            );
                        }

                        return {
                            assessmentHistory: [...state.assessmentHistory, newHistory],
                            courses: updatedCourses,
                            finalReport: result,
                            isAnalyzing: false
                        };
                    });
                    return result;
                }
                
                set({ isAnalyzing: false });
                return null;
            },

            activateRemedialMode: async (courseId, score) => {
                set({ isAnalyzing: true });
                const course = get().courses.find(c => c.id === courseId);
                const session = get().assessmentSession;
                const wrongAnswers = session.filter(s => !s.isCorrect);
                
                const remedialLessons = await AI.generateRemedialPlan(course.title, wrongAnswers, "General Weakness"); 

                if (remedialLessons && remedialLessons.length > 0) {
                    set(state => {
                        const updatedCourses = state.courses.map(c => {
                            if (c.id !== courseId) return c;
                            const failedExamNode = {
                                type: 'failed_exam',
                                score: score,
                                date: new Date().toISOString().split('T')[0],
                                status: 'completed', 
                                lessonIndex: -1 
                            };
                            const currentLessonsCount = c.lessons.length;
                            const newLessons = remedialLessons.map((l, idx) => ({ ...l, id: `remedial_${Date.now()}_${idx}`, isRemedial: true }));
                            const allLessons = [...c.lessons, ...newLessons];
                            const newRoadmapNodes = newLessons.map((_, idx) => ({
                                lessonIndex: currentLessonsCount + idx, 
                                date: new Date().toISOString().split('T')[0], 
                                time: "Urgent",
                                status: idx === 0 ? 'unlocked' : 'locked', 
                                type: 'remedial'
                            }));
                            return {
                                ...c,
                                lessons: allLessons,
                                schedule: {
                                    ...c.schedule,
                                    roadmap: [...c.schedule.roadmap, failedExamNode, ...newRoadmapNodes]
                                }
                            };
                        });
                        return { courses: updatedCourses, isAnalyzing: false };
                    });
                    return true;
                }
                set({ isAnalyzing: false });
                return false;
            },

            finalizeAssessmentAI: async () => {
                set({ isAnalyzing: true });
                const analysis = await AI.generateFinalAnalysis(get().assessmentSession, get().user);
                if (analysis) {
                    set(state => {
                        const updatedUser = { 
                            ...state.user, 
                            codingGenome: { ...state.user.codingGenome, ...analysis.updatedCodingGenome },
                            mindprint: { ...state.user.mindprint, ...analysis.updatedMindprint }
                        };
                        return {
                            user: updatedUser,
                            assessmentHistory: [...state.assessmentHistory, { 
                                date: new Date().toISOString(), 
                                score: analysis.finalScore, 
                                summary: analysis.summary 
                            }],
                            finalReport: analysis,
                            isAnalyzing: false
                        }
                    });
                    return analysis;
                }
                set({ isAnalyzing: false });
                return null;
            },

            // --- دوال الـ Onboarding ---
            fetchOnboardingQuestions: async () => {
                set({ isGeneratingQuestions: true });
                const questions = await AI.generateOnboardingQuestionsAI();
                if (questions) {
                    set({ onboardingQuestions: questions, isGeneratingQuestions: false });
                } else {
                    set({ isGeneratingQuestions: false });
                }
            },

            startAIAnalysis: async (answers) => {
                set({ isAnalyzing: true });
                const analysis = await AI.generateUserAnalysis(answers);
                if (analysis) {
                    set((state) => {
                        const updatedUser = { 
                            ...state.user, 
                            hasCompletedOnboarding: true,
                            ...analysis 
                        };
                        return {
                            user: updatedUser,
                            onboardingResult: analysis.recommendation, // ✅ حفظ النتيجة في الستور
                            isAnalyzing: false
                        };
                    });
                    return analysis.recommendation; 
                }
                set({ isAnalyzing: false });
                return null;
            },

            // --- المصادقة ---
            signup: (email, password, name) => { set(state => ({ user: { id: Date.now(), name, email } })); return { success: true }; },
            login: (email, password) => { set(state => ({ user: { id: 1, name: 'User', email } })); return { success: true }; },
            logout: () => { set({ user: null }); window.location.href = '/'; },

            refreshDashboard: async () => {
                const { user, currentMode, courses, enrolledCourses } = get();
                if (!user || enrolledCourses.length === 0) { set({ dailyTasks: [] }); return; }
                if (get().dailyTasks.length > 0) return;
                set({ isAnalyzing: true });
                const today = new Date().toISOString().split('T')[0];
                const dueLessons = [];
                enrolledCourses.forEach(courseId => {
                    const course = courses.find(c => c.id === courseId);
                    if (course && course.schedule && course.schedule.roadmap) {
                        const todaysNodes = course.schedule.roadmap.filter(node => node.date === today && node.type !== 'failed_exam');
                        todaysNodes.forEach(node => {
                            if (node.lessonIndex !== undefined && course.lessons[node.lessonIndex]) {
                                dueLessons.push({
                                    title: `${course.title}: ${course.lessons[node.lessonIndex].title}`,
                                    duration: course.lessons[node.lessonIndex].duration
                                });
                            }
                        });
                    }
                });
                const tasks = await AI.generateDailyTasksAI(user, currentMode, dueLessons);
                if (tasks && tasks.length > 0) set({ dailyTasks: tasks });
                set({ isAnalyzing: false });
            },

            // ممارسة عادية (Practice)
            startNewAssessment: async () => {
                const { user } = get();
                set({ isGeneratingQuestions: true, currentAssessmentQuestions: [], assessmentSession: [] });
                const questions = await AI.generateTechnicalQuestions(user?.codingGenome || { level: 'beginner' });
                if (questions && questions.length > 0) {
                    set({ currentAssessmentQuestions: questions, isGeneratingQuestions: false });
                    return true;
                }
                set({ isGeneratingQuestions: false });
                return false;
            },

            submitAnswerToAI: async (qId, ans, time) => {
                set({ isEvaluating: true });
                const question = get().currentAssessmentQuestions.find(q => q.id === qId);
                const result = await AI.evaluateAnswerAI(question, ans, time);
                if (result.stressDetected) set({ showBreathingExercise: true, currentMode: 'anxiety' });
                set(state => ({ assessmentSession: [...state.assessmentSession, { ...result, qId, timeTaken: time }], isEvaluating: false }));
                return result;
            },

            enrollCourse: (id) => set(state => ({ enrolledCourses: [...state.enrolledCourses, id] })),
            triggerBreathingExercise: () => set({ showBreathingExercise: true }),
            closeBreathingExercise: () => set({ showBreathingExercise: false }),
            setCurrentMode: (mode) => { set({ currentMode: mode, dailyTasks: [] }); get().refreshDashboard(); },
            resetDemo: () => { localStorage.removeItem('sera-storage-v2'); window.location.href = '/'; }
        }),
        {
            name: 'sera-storage-v2', 
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export default useSimulationStore