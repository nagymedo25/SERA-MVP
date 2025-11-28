// Psychological Assessment Questions
export const psychologicalQuestions = [
    {
        id: 'psych_1',
        question: 'onboarding.questions.psych_1.question',
        type: 'scale',
        options: [
            { value: 1, label: 'onboarding.questions.psych_1.options.veryLow' },
            { value: 2, label: 'onboarding.questions.psych_1.options.low' },
            { value: 3, label: 'onboarding.questions.psych_1.options.medium' },
            { value: 4, label: 'onboarding.questions.psych_1.options.high' },
            { value: 5, label: 'onboarding.questions.psych_1.options.veryHigh' },
        ],
        category: 'energy',
    },
    {
        id: 'psych_2',
        question: 'onboarding.questions.psych_2.question',
        type: 'multiple',
        options: [
            { value: 'excited', label: 'onboarding.questions.psych_2.options.excited', score: { focus: 5 } },
            { value: 'anxious', label: 'onboarding.questions.psych_2.options.anxious', score: { stress: 4 } },
            { value: 'curious', label: 'onboarding.questions.psych_2.options.curious', score: { focus: 4 } },
            { value: 'overwhelmed', label: 'onboarding.questions.psych_2.options.overwhelmed', score: { stress: 5 } },
        ],
        category: 'stress_response',
    },
    {
        id: 'psych_3',
        question: 'onboarding.questions.psych_3.question',
        type: 'scale',
        options: [
            { value: 1, label: 'onboarding.questions.psych_3.options.lessThan1' },
            { value: 2, label: 'onboarding.questions.psych_3.options.1to2' },
            { value: 3, label: 'onboarding.questions.psych_3.options.2to3' },
            { value: 4, label: 'onboarding.questions.psych_3.options.3to4' },
            { value: 5, label: 'onboarding.questions.psych_3.options.moreThan4' },
        ],
        category: 'focus',
    },
    {
        id: 'psych_4',
        question: 'onboarding.questions.psych_4.question',
        type: 'multiple',
        options: [
            { value: 'break', label: 'onboarding.questions.psych_4.options.break', score: { wellness: 5 } },
            { value: 'push', label: 'onboarding.questions.psych_4.options.push', score: { stress: 3 } },
            { value: 'breathe', label: 'onboarding.questions.psych_4.options.breathe', score: { wellness: 4 } },
            { value: 'avoid', label: 'onboarding.questions.psych_4.options.avoid', score: { stress: 4 } },
        ],
        category: 'coping',
    },
    {
        id: 'psych_5',
        question: 'onboarding.questions.psych_5.question',
        type: 'scale',
        options: [
            { value: 5, label: 'onboarding.questions.psych_5.options.veryAnxious' },
            { value: 4, label: 'onboarding.questions.psych_5.options.anxious' },
            { value: 3, label: 'onboarding.questions.psych_5.options.neutral' },
            { value: 2, label: 'onboarding.questions.psych_5.options.optimistic' },
            { value: 1, label: 'onboarding.questions.psych_5.options.veryOptimistic' },
        ],
        category: 'anxiety',
    },
]

// Technical Assessment Questions
export const technicalQuestions = [
    {
        id: 'tech_1',
        type: 'mcq',
        difficulty: 'beginner',
        question: 'onboarding.questions.tech_1.question',
        options: [
            { value: 'a', label: '1' },
            { value: 'b', label: '2' },
            { value: 'c', label: '3' },
            { value: 'd', label: 'undefined' },
        ],
        correctAnswer: 'c',
        explanation: 'onboarding.questions.tech_1.explanation',
        category: 'javascript_basics',
    },
    {
        id: 'tech_2',
        type: 'debug',
        difficulty: 'intermediate',
        question: 'onboarding.questions.tech_2.question',
        code: `function sum(a, b) {
  return a + b
}

console.log(sum(5))`,
        correctCode: `function sum(a, b) {
  return a + b
}

console.log(sum(5, 3))`,
        explanation: 'onboarding.questions.tech_2.explanation',
        category: 'debugging',
    },
    {
        id: 'tech_3',
        type: 'algorithm',
        difficulty: 'intermediate',
        question: 'onboarding.questions.tech_3.question',
        starterCode: `function findMax(arr) {
  // onboarding.questions.tech_3.comment
}`,
        solutionCode: `function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
        testCases: [
            { input: [1, 5, 3, 9, 2], expected: 9 },
            { input: [-1, -5, -3], expected: -1 },
        ],
        category: 'algorithms',
    },
    {
        id: 'tech_4',
        type: 'mcq',
        difficulty: 'advanced',
        question: 'onboarding.questions.tech_4.question',
        options: [
            { value: 'a', label: '1' },
            { value: 'b', label: '2' },
            { value: 'c', label: 'undefined' },
            { value: 'd', label: 'null' },
        ],
        correctAnswer: 'b',
        explanation: 'onboarding.questions.tech_4.explanation',
        category: 'javascript_advanced',
    },
]

// Life Trajectory Questions
export const lifeTrajectoryQuestions = [
    {
        id: 'life_1',
        question: 'onboarding.questions.life_1.question',
        type: 'multiple',
        options: [
            { value: 'job', label: 'onboarding.questions.life_1.options.job' },
            { value: 'freelance', label: 'onboarding.questions.life_1.options.freelance' },
            { value: 'startup', label: 'onboarding.questions.life_1.options.startup' },
            { value: 'knowledge', label: 'onboarding.questions.life_1.options.knowledge' },
        ],
    },
    {
        id: 'life_2',
        question: 'onboarding.questions.life_2.question',
        type: 'multiple',
        options: [
            { value: 'web', label: 'onboarding.questions.life_2.options.web' },
            { value: 'mobile', label: 'onboarding.questions.life_2.options.mobile' },
            { value: 'ai', label: 'onboarding.questions.life_2.options.ai' },
            { value: 'data', label: 'onboarding.questions.life_2.options.data' },
            { value: 'game', label: 'onboarding.questions.life_2.options.game' },
        ],
    },
    {
        id: 'life_3',
        question: 'onboarding.questions.life_3.question',
        type: 'multiple',
        options: [
            { value: '3m', label: 'onboarding.questions.life_3.options.3m' },
            { value: '6m', label: 'onboarding.questions.life_3.options.6m' },
            { value: '1y', label: 'onboarding.questions.life_3.options.1y' },
            { value: '2y', label: 'onboarding.questions.life_3.options.2y' },
        ],
    },
]

// Courses Data
export const coursesData = [
    {
        id: 'course_1',
        title: 'courses.jsBeginner.title',
        description: 'courses.jsBeginner.description',
        difficulty: 'beginner',
        duration: 'courses.jsBeginner.duration',
        lessonsCount: 15,
        image: '/course-js.jpg',
        recommendedFor: ['beginner', 'web'],
    },
    {
        id: 'course_2',
        title: 'courses.algo.title',
        description: 'courses.algo.description',
        difficulty: 'intermediate',
        duration: 'courses.algo.duration',
        lessonsCount: 20,
        image: '/course-algo.jpg',
        recommendedFor: ['intermediate', 'algorithms'],
    },
    {
        id: 'course_3',
        title: 'courses.reactAdvanced.title',
        description: 'courses.reactAdvanced.description',
        difficulty: 'advanced',
        duration: 'courses.reactAdvanced.duration',
        lessonsCount: 25,
        image: '/course-react.jpg',
        recommendedFor: ['advanced', 'web'],
    },
]

// Motivational Messages
export const motivationalMessages = {
    highEnergy: [
        'messages.highEnergy.1',
        'messages.highEnergy.2',
        'messages.highEnergy.3',
    ],
    lowEnergy: [
        'messages.lowEnergy.1',
        'messages.lowEnergy.2',
        'messages.lowEnergy.3',
    ],
    stressed: [
        'messages.stressed.1',
        'messages.stressed.2',
        'messages.stressed.3',
    ],
    progress: [
        'messages.progress.1',
        'messages.progress.2',
        'messages.progress.3',
    ],
}

// User Scenarios (for Demo)
export const userScenarios = {
    mahmoud: {
        name: 'Mahmoud',
        initialMode: 'lowEnergy',
        mindprint: {
            energyPattern: 'morning_person',
            stressResponse: 'moderate',
            focusDuration: 2.5,
            copingStyle: 'problem_solving',
            traits: {
                openness: 75,
                conscientiousness: 60,
                resilience: 55,
            },
        },
        codingGenome: {
            level: 'beginner',
            strengths: ['html', 'css', 'javascript_basic'],
            weaknesses: ['algorithms', 'debugging', 'async'],
            preferredLearningStyle: 'visual',
            codingSpeed: 45,
            problemSolvingScore: 52,
        },
        lifeTrajectory: {
            goal: 'web_developer',
            timeframe: '6_months',
            field: 'web',
            motivation: 'job',
        },
    },
}

// Skill Categories for Heatmap
export const skillCategories = [
    { id: 'html', name: 'HTML', color: '#e34c26' },
    { id: 'css', name: 'CSS', color: '#264de4' },
    { id: 'javascript_basic', name: 'JS Basics', color: '#f0db4f' },
    { id: 'javascript_advanced', name: 'JS Advanced', color: '#f0db4f' },
    { id: 'algorithms', name: 'Algorithms', color: '#61dafb' },
    { id: 'data_structures', name: 'Data Structures', color: '#61dafb' },
    { id: 'debugging', name: 'Debugging', color: '#ff6b6b' },
    { id: 'async', name: 'Async Programming', color: '#4ecdc4' },
    { id: 'react', name: 'React', color: '#61dafb' },
    { id: 'node', name: 'Node.js', color: '#68a063' },
]

// Daily Task Templates
export const dailyTaskTemplates = {
    highFocus: [
        { id: 1, title: 'tasks.highFocus.1', type: 'technical', duration: 45 },
        { id: 2, title: 'tasks.highFocus.2', type: 'technical', duration: 30 },
        { id: 3, title: 'tasks.highFocus.3', type: 'learning', duration: 25 },
        { id: 4, title: 'tasks.highFocus.4', type: 'wellness', duration: 10 },
    ],
    lowEnergy: [
        { id: 1, title: 'tasks.lowEnergy.1', type: 'wellness', duration: 5 },
        { id: 2, title: 'tasks.lowEnergy.2', type: 'learning', duration: 10 },
        { id: 3, title: 'tasks.lowEnergy.3', type: 'technical', duration: 15 },
        { id: 4, title: 'tasks.lowEnergy.4', type: 'wellness', duration: 10 },
    ],
    burnout: [
        { id: 1, title: 'tasks.burnout.1', type: 'wellness', duration: 30 },
        { id: 2, title: 'tasks.burnout.2', type: 'wellness', duration: 10 },
        { id: 3, title: 'tasks.burnout.3', type: 'psychology', duration: 20 },
        { id: 4, title: 'tasks.burnout.4', type: 'psychology', duration: 15 },
    ],
    anxiety: [
        { id: 1, title: 'tasks.anxiety.1', type: 'wellness', duration: 10 },
        { id: 2, title: 'tasks.anxiety.2', type: 'technical', duration: 15 },
        { id: 3, title: 'tasks.anxiety.3', type: 'psychology', duration: 20 },
        { id: 4, title: 'tasks.anxiety.4', type: 'wellness', duration: 15 },
    ],
}
