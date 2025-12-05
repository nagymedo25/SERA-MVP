import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import * as AI from '../services/gemini'
import { coursesData as defaultCourses } from '../data/mockData' // بيانات احتياطية للبداية

const useSimulationStore = create(
    persist(
        (set, get) => ({
            // =================================================
            // 1. الحالة العامة (State)
            // =================================================
            user: null,
            registeredUsers: [],
            
            // إدارة الكورسات
            courses: defaultCourses || [], // قائمة الكورسات (الافتراضية + المولدة)
            enrolledCourses: [], // الكورسات التي اشترك فيها المستخدم
            
            // بيانات التعلم والتقدم
            completedLessons: [],
            assessmentHistory: [],
            dailyTasks: [], // المهام اليومية من الـ AI
            
            // حالات واجهة المستخدم والتحميل
            isAnalyzing: false, // لعمليات التوليد الطويلة
            isGeneratingQuestions: false,
            isEvaluating: false,
            showBreathingExercise: false, // للتدخل النفسي
            currentMode: 'neutral', // neutral, highFocus, burnout, anxiety

            // حالات التقييم الذكي
            currentAssessmentQuestions: [],
            assessmentSession: [],

            // =================================================
            // 2. إدارة الكورسات (Course CRUD & AI)
            // =================================================
            
            // إضافة كورس جديد بالذكاء الاصطناعي
            addNewCourseAI: async (topic) => {
                set({ isAnalyzing: true });
                const newCourse = await AI.generateNewCourseAI(topic);
                
                if (newCourse) {
                    // إضافة صورة عشوائية لجمالية التصميم
                    newCourse.image = `/course-${Math.floor(Math.random() * 3) + 1}.jpg`;
                    // علامة لتحديد أن هذا الكورس لم تتم جدولته بعد
                    newCourse.isScheduled = false; 
                    
                    set(state => ({
                        courses: [newCourse, ...state.courses],
                        isAnalyzing: false
                    }));
                    return true;
                }
                set({ isAnalyzing: false });
                return false;
            },

            // حذف كورس
            deleteCourse: (courseId) => {
                set(state => ({
                    courses: state.courses.filter(c => c.id !== courseId),
                    enrolledCourses: state.enrolledCourses.filter(id => id !== courseId)
                }));
            },

            // تعديل بيانات كورس
            updateCourse: (courseId, updatedData) => {
                set(state => ({
                    courses: state.courses.map(c => 
                        c.id === courseId ? { ...c, ...updatedData } : c
                    )
                }));
            },

            // توليد جدول زمني ذكي للكورس (ربط الكورس بروتين المستخدم)
            generateCourseSchedule: async (courseId, routineDescription) => {
                const { user, courses } = get();
                const course = courses.find(c => c.id === courseId);
                
                if (!course) return false;

                // استدعاء Gemini لدمج الكورس مع الروتين
                const schedule = await AI.generateCourseScheduleAI(course, routineDescription, user);

                if (schedule) {
                    set(state => ({
                        courses: state.courses.map(c => 
                            c.id === courseId 
                            ? { ...c, schedule: schedule, isScheduled: true } // حفظ الجدول وتحديث الحالة
                            : c
                        ),
                        // تسجيل المستخدم في الكورس تلقائياً بعد الجدولة
                        enrolledCourses: [...state.enrolledCourses, courseId]
                    }));
                    return true;
                }
                return false;
            },

            // =================================================
            // 3. المصادقة (Auth)
            // =================================================
            signup: (email, password, name) => {
                const { registeredUsers } = get();
                if (registeredUsers.find(u => u.email === email)) {
                    return { success: false, message: 'البريد الإلكتروني مسجل بالفعل' };
                }
                const newUser = {
                    id: Date.now(),
                    email,
                    password,
                    name,
                    joinedAt: new Date().toISOString(),
                    hasCompletedOnboarding: false,
                    mindprint: {},
                    codingGenome: { level: 'beginner' }, // قيمة افتراضية
                    lifeTrajectory: {}
                };
                set((state) => ({
                    registeredUsers: [...state.registeredUsers, newUser],
                    user: newUser
                }));
                return { success: true };
            },

            login: (email, password) => {
                const { registeredUsers } = get();
                const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
                if (foundUser) {
                    set({ user: foundUser });
                    return { success: true };
                }
                return { success: false, message: 'بيانات الدخول غير صحيحة' };
            },

            logout: () => {
                set({ user: null, currentMode: 'neutral', dailyTasks: [] });
                window.location.href = '/';
            },

            // =================================================
            // 4. الذكاء الاصطناعي (Dashboard & Assessment)
            // =================================================
            
            // تحليل Onboarding
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
                        const updatedRegistry = state.registeredUsers.map(u => 
                            u.id === updatedUser.id ? updatedUser : u
                        );
                        return {
                            user: updatedUser,
                            registeredUsers: updatedRegistry,
                            isAnalyzing: false
                        };
                    });
                    return true;
                }
                set({ isAnalyzing: false });
                return false;
            },

            // تحديث مهام الداشبورد
            refreshDashboard: async () => {
                const { user, currentMode } = get();
                if (!user) return;
                // إذا كانت المهام موجودة لنفس المود لا داعي لإعادة الطلب (توفير للكوتة)
                if (get().dailyTasks.length > 0) return;

                set({ isAnalyzing: true });
                const tasks = await AI.generateDailyTasksAI(user, currentMode);
                if (tasks && tasks.length > 0) set({ dailyTasks: tasks });
                set({ isAnalyzing: false });
            },

            // بدء تقييم تقني جديد
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

            // تصحيح إجابة
            submitAnswerToAI: async (qId, ans, time) => {
                set({ isEvaluating: true });
                const question = get().currentAssessmentQuestions.find(q => q.id === qId);
                const result = await AI.evaluateAnswerAI(question, ans, time);

                // كشف التوتر وتشغيل التدخل
                if (result.stressDetected) {
                    set({ showBreathingExercise: true, currentMode: 'anxiety' });
                }

                set(state => ({
                    assessmentSession: [...state.assessmentSession, { ...result, qId, timeTaken: time }],
                    isEvaluating: false
                }));
                return result;
            },

            // إنهاء التقييم
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
                        // تحديث السجل الدائم
                        const updatedRegistry = state.registeredUsers.map(u => 
                            u.id === updatedUser.id ? updatedUser : u
                        );
                        return {
                            user: updatedUser,
                            registeredUsers: updatedRegistry,
                            assessmentHistory: [...state.assessmentHistory, { 
                                date: new Date().toISOString(), 
                                score: analysis.finalScore, 
                                summary: analysis.summary 
                            }],
                            isAnalyzing: false
                        }
                    });
                    return analysis;
                }
                set({ isAnalyzing: false });
                return null;
            },

            // =================================================
            // 5. إجراءات مساعدة (Helpers)
            // =================================================
            enrollCourse: (id) => set(state => ({ enrolledCourses: [...state.enrolledCourses, id] })),
            completeLesson: (id) => set(state => ({ completedLessons: [...state.completedLessons, id] })),
            triggerBreathingExercise: () => set({ showBreathingExercise: true }),
            closeBreathingExercise: () => set({ showBreathingExercise: false }),
            setCurrentMode: (mode) => {
                set({ currentMode: mode, dailyTasks: [] }); // مسح المهام لإجبار التحديث
                get().refreshDashboard();
            },
        }),
        {
            name: 'sera-storage', // مفتاح LocalStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export default useSimulationStore