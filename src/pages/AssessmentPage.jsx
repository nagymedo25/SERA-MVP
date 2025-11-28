import React, { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Play, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import { technicalQuestions } from '../data/mockData'
import useSimulationStore from '../store/simulationStore'
import gsap from 'gsap'
import Navbar from '../components/Navbar'
import { useLanguage } from '../contexts/LanguageContext'

const AssessmentPage = () => {
    const { t } = useLanguage()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [userCode, setUserCode] = useState('')
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [score, setScore] = useState(0)
    const [completed, setCompleted] = useState(false)
    const [timeOnQuestion, setTimeOnQuestion] = useState(0)

    const { addAssessmentResult, triggerBreathingExercise, stressLevel } = useSimulationStore()
    const editorRef = useRef(null)
    const containerRef = useRef(null)

    const question = technicalQuestions[currentQuestion]

    // Stress detection simulation
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeOnQuestion((prev) => prev + 1)
        }, 1000)

        // Trigger intervention if stuck on question for too long
        if (timeOnQuestion > 60 && currentQuestion > 0) {
            triggerBreathingExercise()
            setTimeOnQuestion(0)
        }

        return () => clearInterval(timer)
    }, [timeOnQuestion, currentQuestion, triggerBreathingExercise])

    // Initialize code editor and reset states when question changes
    useEffect(() => {
        // Reset states for new question
        setShowResult(false)
        setSelectedAnswer(null)
        setTimeOnQuestion(0)

        // Initialize code for code-based questions
        if (question.type === 'algorithm') {
            setUserCode(question.starterCode || '')
        } else if (question.type === 'debug') {
            setUserCode(question.code || '')
        } else {
            setUserCode('')
        }
    }, [currentQuestion, question])

    const handleRunCode = () => {
        // Simulated code execution
        const correct = question.type === 'algorithm'
            ? userCode.includes('max') || userCode.includes('Math.max')
            : userCode.includes(question.correctCode?.slice(0, 20))

        setIsCorrect(correct)
        setShowResult(true)

        if (correct) {
            setScore(score + 1)
        } else {
            // Shake effect on wrong answer
            if (containerRef.current) {
                gsap.fromTo(
                    containerRef.current,
                    { x: -10 },
                    { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power1.inOut' }
                )
            }
        }
    }

    const handleMCQSubmit = () => {
        const correct = selectedAnswer === question.correctAnswer
        setIsCorrect(correct)
        setShowResult(true)

        if (correct) {
            setScore(score + 1)
        } else {
            if (containerRef.current) {
                gsap.fromTo(
                    containerRef.current,
                    { x: -10 },
                    { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power1.inOut' }
                )
            }
        }
    }

    const handleNext = () => {
        if (currentQuestion < technicalQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            // State resets are now handled in useEffect
        } else {
            // Complete assessment
            const finalScore = ((score / technicalQuestions.length) * 100).toFixed(0)
            addAssessmentResult({
                score: finalScore,
                date: new Date().toISOString(),
                heatmap: {
                    javascript_basic: finalScore > 70 ? 80 : 50,
                    algorithms: finalScore > 60 ? 70 : 40,
                    debugging: finalScore > 50 ? 65 : 45,
                },
            })
            setCompleted(true)
        }
    }

    if (completed) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
                <div className="glass rounded-3xl p-12 max-w-2xl w-full text-center border border-white/10">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-4xl font-bold mb-4">{t('assessment.completed')}</h2>
                    <p className="text-xl text-gray-400 mb-8">{t('assessment.finalScore')}</p>

                    <div className="text-6xl font-bold mb-8 bg-gradient-to-r from-neon-blue to-neon-violet bg-clip-text text-transparent">
                        {((score / technicalQuestions.length) * 100).toFixed(0)}%
                    </div>

                    <p className="text-lg text-gray-400 mb-8">
                        {t('assessment.resultSummary', { score, total: technicalQuestions.length })}
                    </p>

                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-violet font-semibold hover:scale-105 transition-transform"
                    >
                        {t('assessment.backToDashboard')}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-400">
                                {t('assessment.question')} {currentQuestion + 1} {t('assessment.of')} {technicalQuestions.length}
                            </span>
                            <span className="text-sm font-semibold text-neon-blue">
                                {t('assessment.score')}: {score}/{technicalQuestions.length}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-neon-blue to-neon-violet transition-all duration-500"
                                style={{ width: `${((currentQuestion + 1) / technicalQuestions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Question */}
                    <div ref={containerRef} className="glass rounded-3xl p-8 border border-white/10 mb-8">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-sm font-semibold capitalize">
                                    {question.difficulty}
                                </div>
                                <div className="px-3 py-1 rounded-full bg-white/10 text-gray-400 text-sm">
                                    {question.type === 'mcq' && t('assessment.types.mcq')}
                                    {question.type === 'debug' && t('assessment.types.debug')}
                                    {question.type === 'algorithm' && t('assessment.types.algorithm')}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mb-4">{question.question}</h2>
                        </div>

                        {/* MCQ Type */}
                        {question.type === 'mcq' && (
                            <div className="space-y-4">
                                {question.code && (
                                    <pre className="bg-slate-900 rounded-lg p-4 mb-6 overflow-x-auto">
                                        <code className="text-sm text-green-400">{question.code}</code>
                                    </pre>
                                )}

                                <div className="space-y-3">
                                    {question.options.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => !showResult && setSelectedAnswer(option.value)}
                                            disabled={showResult}
                                            className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-300 ${showResult && option.value === question.correctAnswer
                                                ? 'bg-green-500/20 border-green-500'
                                                : showResult && option.value === selectedAnswer
                                                    ? 'bg-red-500/20 border-red-500'
                                                    : selectedAnswer === option.value
                                                        ? 'bg-neon-blue/20 border-neon-blue'
                                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                {!showResult && selectedAnswer && (
                                    <button
                                        onClick={handleMCQSubmit}
                                        className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-violet font-semibold hover:scale-105 transition-transform mt-6"
                                    >
                                        {t('assessment.submit')}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Code Editor Type */}
                        {(question.type === 'algorithm' || question.type === 'debug') && (
                            <div>
                                {/* Show the code to debug if it's a debug question */}
                                {question.type === 'debug' && question.code && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-400 mb-2">{t('assessment.currentCode')}</p>
                                        <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto border border-white/10">
                                            <code className="text-sm text-green-400">{question.code}</code>
                                        </pre>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <p className="text-sm text-gray-400 mb-2">
                                        {question.type === 'debug' ? t('assessment.debugPrompt') : t('assessment.writeCodePrompt')}
                                    </p>
                                    <div className="bg-slate-900 rounded-lg overflow-hidden border border-white/10">
                                        <Editor
                                            height="300px"
                                            defaultLanguage="javascript"
                                            theme="vs-dark"
                                            value={userCode}
                                            onChange={(value) => setUserCode(value || '')}
                                            options={{
                                                minimap: { enabled: false },
                                                fontSize: 14,
                                                lineNumbers: 'on',
                                                scrollBeyondLastLine: false,
                                                automaticLayout: true,
                                            }}
                                            onMount={(editor) => (editorRef.current = editor)}
                                        />
                                    </div>
                                </div>

                                {!showResult && (
                                    <button
                                        onClick={handleRunCode}
                                        className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 font-semibold hover:scale-105 transition-transform"
                                    >
                                        <Play className="w-5 h-5" />
                                        {t('assessment.runCode')}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Result Feedback */}
                        {showResult && (
                            <div
                                className={`mt-6 p-6 rounded-xl ${isCorrect ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    {isCorrect ? (
                                        <>
                                            <CheckCircle className="w-6 h-6 text-green-400" />
                                            <span className="text-lg font-semibold text-green-400">{t('assessment.correct')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-6 h-6 text-red-400" />
                                            <span className="text-lg font-semibold text-red-400">{t('assessment.incorrect')}</span>
                                        </>
                                    )}
                                </div>

                                {question.explanation && (
                                    <p className="text-gray-300 mb-4">{question.explanation}</p>
                                )}

                                <button
                                    onClick={handleNext}
                                    className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-colors"
                                >
                                    {currentQuestion < technicalQuestions.length - 1 ? t('assessment.next') : t('assessment.finish')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AssessmentPage
