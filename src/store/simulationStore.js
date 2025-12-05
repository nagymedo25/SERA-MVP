import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { generateUserAnalysis } from '../services/gemini'

const useSimulationStore = create(
    persist(
        (set, get) => ({
            // --- البيانات (Data) ---
            user: null, // المستخدم الحالي المسجل دخوله
            registeredUsers: [], // "قاعدة البيانات" المحلية للمستخدمين
            
            // حالة التطبيق
            isAnalyzing: false,
            currentMode: 'neutral', // neutral, highFocus, burnout, anxiety
            
            // بيانات التعلم
            enrolledCourses: [],
            completedLessons: [],
            assessmentHistory: [],
            
            // --- المصادقة (Authentication Actions) ---
            
            // 1. إنشاء حساب جديد
            signup: (email, password, name) => {
                const { registeredUsers } = get();
                
                // التحقق من عدم وجود البريد مسبقاً
                if (registeredUsers.find(u => u.email === email)) {
                    return { success: false, message: 'البريد الإلكتروني مسجل بالفعل' };
                }

                const newUser = {
                    id: Date.now(),
                    email,
                    password, // في التطبيق الحقيقي يجب تشفير هذا
                    name,
                    joinedAt: new Date().toISOString(),
                    hasCompletedOnboarding: false,
                    // بيانات افتراضية حتى يتم التحليل
                    mindprint: {},
                    codingGenome: {},
                    lifeTrajectory: {}
                };

                set((state) => ({
                    registeredUsers: [...state.registeredUsers, newUser],
                    user: newUser // تسجيل الدخول تلقائياً بعد الإنشاء
                }));

                return { success: true };
            },

            // 2. تسجيل الدخول
            login: (email, password) => {
                const { registeredUsers } = get();
                const foundUser = registeredUsers.find(u => u.email === email && u.password === password);

                if (foundUser) {
                    set({ user: foundUser });
                    return { success: true };
                }
                return { success: false, message: 'البريد أو كلمة المرور غير صحيحة' };
            },

            // 3. تسجيل الخروج
            logout: () => {
                set({ 
                    user: null, 
                    currentMode: 'neutral' 
                    // لا نمسح registeredUsers لنحافظ على البيانات
                });
                window.location.href = '/';
            },

            // --- الذكاء الاصطناعي (AI Actions) ---

            startAIAnalysis: async (answers) => {
                set({ isAnalyzing: true });
                const analysis = await generateUserAnalysis(answers);
                
                if (analysis) {
                    // تحديث المستخدم الحالي وفي "قاعدة البيانات" أيضاً
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

            // --- إجراءات أخرى (Helpers) ---
            
            enrollCourse: (courseId) => set((state) => ({
                enrolledCourses: [...state.enrolledCourses, courseId]
            })),

            completeLesson: (lessonId) => set((state) => ({
                completedLessons: [...state.completedLessons, lessonId]
            })),

            addAssessmentResult: (result) => set((state) => ({
                assessmentHistory: [...state.assessmentHistory, result]
            })),
            
            triggerBreathingExercise: () => set({ showBreathingExercise: true }),
            closeBreathingExercise: () => set({ showBreathingExercise: false }),
        }),
        {
            name: 'sera-storage', // اسم التخزين في LocalStorage
            storage: createJSONStorage(() => localStorage),
            // نحدد ما نريد حفظه فقط (اختياري، هنا نحفظ الكل)
        }
    )
)

export default useSimulationStore