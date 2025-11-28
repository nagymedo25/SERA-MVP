import React, { useState } from 'react'
import { psychologicalQuestions, technicalQuestions, lifeTrajectoryQuestions } from '../data/mockData'
import useSimulationStore from '../store/simulationStore'
import { useLanguage } from '../contexts/LanguageContext'
import MindprintScanner from '../components/onboarding/MindprintScanner'
import OnboardingResults from '../components/onboarding/OnboardingResults'
import { ChevronRight, Brain, Code, Target } from 'lucide-react'

const Onboarding = () => {
    const { t } = useLanguage()
    const [currentStep, setCurrentStep] = useState(0)
    const [showScanner, setShowScanner] = useState(false)
    const [answers, setAnswers] = useState({})
    const [showResults, setShowResults] = useState(false)
    const [results, setResults] = useState(null)

    const { completeOnboarding } = useSimulationStore()

    const steps = [
        {
            id: 'psychological',
            title: t('onboarding.psychological.title'),
            subtitle: t('onboarding.psychological.subtitle'),
            icon: Brain,
            questions: psychologicalQuestions,
            color: 'from-neon-violet to-purple-600',
        },
        {
            id: 'technical',
            title: t('onboarding.technical.title'),
            subtitle: t('onboarding.technical.subtitle'),
            icon: Code,
            questions: technicalQuestions,
            color: 'from-neon-blue to-cyan-500',
        },
        {
            id: 'trajectory',
            title: t('onboarding.trajectory.title'),
            subtitle: t('onboarding.trajectory.subtitle'),
            icon: Target,
            questions: lifeTrajectoryQuestions,
            color: 'from-green-400 to-emerald-500',
        },
    ]

    const currentStepData = steps[currentStep]
    const CurrentIcon = currentStepData.icon
    const progress = ((currentStep + 1) / steps.length) * 100

    const handleAnswer = (questionId, value) => {
        setAnswers({
            ...answers,
            [`${currentStepData.id}_${questionId}`]: value,
        })
    }

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setShowScanner(true)
        } else {
            // Final step - process results
            processResults()
        }
    }

    const handleScannerComplete = () => {
        setShowScanner(false)
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const processResults = () => {
        // Calculate mindprint
        const mindprint = {
            energyPattern: 'morning_person',
            stressResponse: 'moderate',
            focusDuration: 2.5,
            copingStyle: 'problem_solving',
            traits: {
                openness: 75,
                conscientiousness: 68,
                resilience: 72,
            },
        }

        // Calculate coding genome
        const codingGenome = {
            level: 'beginner',
            strengths: ['HTML', 'CSS', 'JavaScript'],
            weaknesses: ['Algorithms', 'Debugging'],
            preferredLearningStyle: 'visual',
            codingSpeed: 55,
            problemSolvingScore: 62,
        }

        // Life trajectory from answers
        const lifeTrajectory = {
            goal: 'web_developer',
            timeframe: '6 أشهر',
            field: 'Web Development',
            motivation: 'job',
        }

        setResults({ mindprint, codingGenome, lifeTrajectory })
        completeOnboarding(mindprint, codingGenome, lifeTrajectory)
        setShowScanner(true)
        setTimeout(() => {
            setShowScanner(false)
            setShowResults(true)
        }, 5000)
    }

    const canProceed = currentStepData.questions.every(
        (q) => answers[`${currentStepData.id}_${q.id}`] !== undefined
    )

    if (showScanner) {
        return <MindprintScanner onComplete={handleScannerComplete} stage={currentStepData.id} />
    }

    if (showResults && results) {
        return <OnboardingResults {...results} />
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12 px-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-96 h-96 gradient-orb-1 animate-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 gradient-orb-2 animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-400">
                            {t('onboarding.step')} {currentStep + 1} {t('onboarding.of')} {steps.length}
                        </span>
                        <span className="text-sm font-semibold text-neon-blue">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${currentStepData.color} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Step Header */}
                <div className="text-center mb-12">
                    <div className="inline-block mb-6">
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentStepData.color} flex items-center justify-center glow-blue`}>
                            <CurrentIcon className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">{currentStepData.title}</h1>
                    <p className="text-xl text-gray-400">{currentStepData.subtitle}</p>
                </div>

                {/* Questions */}
                <div className="space-y-8 mb-12">
                    {currentStepData.questions.map((question, index) => (
                        <div key={question.id} className="glass rounded-2xl p-8 border border-white/10">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-4">{t(question.question)}</h3>

                                    {/* Multiple Choice */}
                                    {question.type === 'multiple' && (
                                        <div className="space-y-3">
                                            {question.options.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => handleAnswer(question.id, option.value)}
                                                    className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-300 ${answers[`${currentStepData.id}_${question.id}`] === option.value
                                                        ? `bg-gradient-to-r ${currentStepData.color} border-transparent text-white shadow-lg`
                                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    {t(option.label)}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Scale */}
                                    {question.type === 'scale' && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between gap-2">
                                                {question.options.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => handleAnswer(question.id, option.value)}
                                                        className={`flex-1 px-4 py-6 rounded-xl border transition-all duration-300 ${answers[`${currentStepData.id}_${question.id}`] === option.value
                                                            ? `bg-gradient-to-r ${currentStepData.color} border-transparent text-white shadow-lg scale-105`
                                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                            }`}
                                                    >
                                                        <div className="text-2xl font-bold mb-2">{option.value}</div>
                                                        <div className="text-xs">{t(option.label)}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* MCQ for Technical */}
                                    {question.type === 'mcq' && (
                                        <div>
                                            {question.code && (
                                                <pre className="bg-slate-900 rounded-lg p-4 mb-4 overflow-x-auto">
                                                    <code className="text-sm text-green-400">{question.code}</code>
                                                </pre>
                                            )}
                                            <div className="space-y-3">
                                                {question.options.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => handleAnswer(question.id, option.value)}
                                                        className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-300 ${answers[`${currentStepData.id}_${question.id}`] === option.value
                                                            ? `bg-gradient-to-r ${currentStepData.color} border-transparent text-white shadow-lg`
                                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                            }`}
                                                    >
                                                        {t(option.label)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Debug Questions */}
                                    {question.type === 'debug' && (
                                        <div>
                                            {question.code && (
                                                <>
                                                    <p className="text-sm text-red-400 mb-2">{t('onboarding.currentCode')}</p>
                                                    <pre className="bg-slate-900 rounded-lg p-4 mb-4 overflow-x-auto border-2 border-red-500/30">
                                                        <code className="text-sm text-red-300">{question.code}</code>
                                                    </pre>
                                                </>
                                            )}
                                            {question.correctCode && (
                                                <>
                                                    <p className="text-sm text-green-400 mb-2">{t('onboarding.chooseCorrect')}</p>
                                                    <div className="space-y-3">
                                                        <button
                                                            onClick={() => handleAnswer(question.id, 'correct')}
                                                            className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-300 ${answers[`${currentStepData.id}_${question.id}`] === 'correct'
                                                                ? `bg-gradient-to-r ${currentStepData.color} border-transparent text-white shadow-lg`
                                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                                }`}
                                                        >
                                                            <pre className="text-sm">
                                                                <code className="text-green-400">{question.correctCode}</code>
                                                            </pre>
                                                        </button>
                                                        <button
                                                            onClick={() => handleAnswer(question.id, 'skip')}
                                                            className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-300 ${answers[`${currentStepData.id}_${question.id}`] === 'skip'
                                                                ? `bg-gradient-to-r ${currentStepData.color} border-transparent text-white shadow-lg`
                                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                                }`}
                                                        >
                                                            {t('onboarding.dontKnow')}
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Algorithm Questions */}
                                    {question.type === 'algorithm' && (
                                        <div>
                                            {question.starterCode && (
                                                <>
                                                    <p className="text-sm text-blue-400 mb-2">{t('onboarding.requiredCode')}</p>
                                                    <pre className="bg-slate-900 rounded-lg p-4 mb-4 overflow-x-auto border-2 border-blue-500/30">
                                                        <code className="text-sm text-blue-300">{t(question.starterCode)}</code>
                                                    </pre>
                                                </>
                                            )}
                                            {question.solutionCode && (
                                                <>
                                                    <p className="text-sm text-green-400 mb-2">{t('onboarding.chooseSolution')}</p>
                                                    <div className="space-y-3">
                                                        <button
                                                            onClick={() => handleAnswer(question.id, 'solution')}
                                                            className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-300 ${answers[`${currentStepData.id}_${question.id}`] === 'solution'
                                                                ? `bg-gradient-to-r ${currentStepData.color} border-transparent text-white shadow-lg`
                                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                                }`}
                                                        >
                                                            <pre className="text-sm">
                                                                <code className="text-green-400">{question.solutionCode}</code>
                                                            </pre>
                                                        </button>
                                                        <button
                                                            onClick={() => handleAnswer(question.id, 'skip')}
                                                            className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-300 ${answers[`${currentStepData.id}_${question.id}`] === 'skip'
                                                                ? `bg-gradient-to-r ${currentStepData.color} border-transparent text-white shadow-lg`
                                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                                }`}
                                                        >
                                                            {t('onboarding.dontKnowSolution')}
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Next Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleNext}
                        disabled={!canProceed}
                        className={`group relative px-10 py-5 text-lg font-semibold rounded-2xl transition-all duration-300 ${canProceed
                            ? `bg-gradient-to-r ${currentStepData.color} glow-blue hover:scale-105`
                            : 'bg-gray-700 cursor-not-allowed opacity-50'
                            }`}
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {currentStep === steps.length - 1 ? t('onboarding.finishAnalysis') : t('onboarding.continue')}
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        {canProceed && (
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${currentStepData.color} opacity-0 group-hover:opacity-100 transition-opacity blur-xl`} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Onboarding
