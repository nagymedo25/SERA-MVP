import { create } from 'zustand'

const useSimulationStore = create((set, get) => ({
    // User Profile - Mock Data
    user: {
        name: 'محمود ناجي',
        hasCompletedOnboarding: true,
        mindprint: {
            energyPattern: 'morning_person',
            stressResponse: 'moderate',
            focusDuration: 2.5,
            copingStyle: 'problem_solving',
            traits: {
                openness: 75,
                conscientiousness: 68,
                resilience: 72,
            },
        },
        codingGenome: {
            level: 'beginner',
            strengths: ['HTML', 'CSS', 'JavaScript'],
            weaknesses: ['Algorithms', 'Debugging'],
            preferredLearningStyle: 'visual',
            codingSpeed: 55,
            problemSolvingScore: 62,
        },
        lifeTrajectory: {
            goal: 'web_developer',
            timeframe: '6 أشهر',
            field: 'Web Development',
            motivation: 'job',
        },
    },

    // Current State
    currentMode: 'neutral', // neutral, highFocus, burnout, anxiety, stressed
    energyLevel: 50,
    stressLevel: 0,
    focusLevel: 50,

    // Onboarding
    onboardingStep: 0,
    onboardingData: {
        psychological: {},
        technical: {},
        lifeGoals: {},
    },

    // Courses & Learning
    enrolledCourses: [],
    completedLessons: [],
    currentLesson: null,

    // Assessments
    assessmentHistory: [],
    currentAssessment: null,
    skillHeatmap: {},

    // Daily Journey
    dailyTasks: [],
    completedTasks: [],
    dailyCheckIn: null,

    // Interventions
    showBreathingExercise: false,
    interventionHistory: [],

    // Actions
    setUser: (userData) => set({ user: { ...get().user, ...userData } }),

    setCurrentMode: (mode) => set({ currentMode: mode }),

    updateOnboarding: (step, data) =>
        set((state) => ({
            onboardingStep: step,
            onboardingData: {
                ...state.onboardingData,
                ...data,
            },
        })),

    completeOnboarding: (mindprint, codingGenome, lifeTrajectory) =>
        set((state) => ({
            user: {
                ...state.user,
                hasCompletedOnboarding: true,
                mindprint,
                codingGenome,
                lifeTrajectory,
            },
            onboardingStep: 0,
        })),

    enrollCourse: (courseId) =>
        set((state) => ({
            enrolledCourses: [...state.enrolledCourses, courseId],
        })),

    completeLesson: (lessonId) =>
        set((state) => ({
            completedLessons: [...state.completedLessons, lessonId],
        })),

    setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

    addAssessmentResult: (result) =>
        set((state) => ({
            assessmentHistory: [...state.assessmentHistory, result],
            skillHeatmap: result.heatmap || state.skillHeatmap,
        })),

    setCurrentAssessment: (assessment) => set({ currentAssessment: assessment }),

    completeDailyTask: (taskId) =>
        set((state) => ({
            completedTasks: [...state.completedTasks, taskId],
            dailyTasks: state.dailyTasks.filter((t) => t.id !== taskId),
        })),

    setDailyTasks: (tasks) => set({ dailyTasks: tasks }),

    triggerBreathingExercise: () => set({ showBreathingExercise: true }),

    closeBreathingExercise: () => set({ showBreathingExercise: false }),

    addIntervention: (intervention) =>
        set((state) => ({
            interventionHistory: [...state.interventionHistory, intervention],
        })),

    updateEnergyLevel: (level) => set({ energyLevel: level }),

    updateStressLevel: (level) => set({ stressLevel: level }),

    updateFocusLevel: (level) => set({ focusLevel: level }),

    setDailyCheckIn: (checkIn) => set({ dailyCheckIn: checkIn }),

    // Demo/Simulation Controls
    triggerStressScenario: () =>
        set({
            currentMode: 'stressed',
            stressLevel: 85,
            showBreathingExercise: true,
        }),

    triggerHighFocusScenario: () =>
        set({
            currentMode: 'highFocus',
            energyLevel: 90,
            focusLevel: 95,
            stressLevel: 20,
        }),

    triggerBurnoutScenario: () =>
        set({
            currentMode: 'burnout',
            energyLevel: 15,
            focusLevel: 30,
            stressLevel: 90,
        }),

    resetDemo: () =>
        set({
            currentMode: 'neutral',
            energyLevel: 50,
            stressLevel: 0,
            focusLevel: 50,
            showBreathingExercise: false,
            completedTasks: [],
            dailyCheckIn: null,
        }),
}))

export default useSimulationStore
