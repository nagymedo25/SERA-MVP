import React, { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Play, CheckCircle, XCircle, AlertTriangle, Timer, Lock, ShieldCheck } from 'lucide-react'
import { technicalQuestions } from '../data/mockData'
import useSimulationStore from '../store/simulationStore'
import gsap from 'gsap'
import { useLanguage } from '../contexts/LanguageContext'
import { useSearchParams, useNavigate } from 'react-router-dom'

const AssessmentPage = () => {
    const { t } = useLanguage()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const isFinalExam = searchParams.get('mode') === 'final'

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [userCode, setUserCode] = useState('')
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [score, setScore] = useState(0)
    const [completed, setCompleted] = useState(false)
    
    // مؤقتات ومراقبة التوتر
    const [timeOnQuestion, setTimeOnQuestion] = useState(0)
    const [totalTime, setTotalTime] = useState(0)
    const [warnings, setWarnings] = useState(0)

    const { addAssessmentResult, triggerBreathingExercise, showBreathingExercise } = useSimulationStore()
    const editorRef = useRef(null)
    const containerRef = useRef(null)

    const question = technicalQuestions[currentQuestion] || technicalQuestions[0]

    // --- منطق الأمان ومراقبة التوتر --- //
    useEffect(() => {
        // منع القائمة المنسدلة والنسخ واللصق
        const handleContextMenu = (e) => e.preventDefault()
        const handleCopyPaste = (e) => {
            e.preventDefault()
            if (containerRef.current) {
                gsap.to(containerRef.current, { x: 5, duration: 0.1, yoyo: true, repeat: 3 })
            }
        }

        // كشف الخروج من التبويب
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setWarnings(prev => prev + 1)
            }
        }

        document.addEventListener('contextmenu', handleContextMenu)
        document.addEventListener('copy', handleCopyPaste)
        document.addEventListener('paste', handleCopyPaste)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
            document.removeEventListener('copy', handleCopyPaste)
            document.removeEventListener('paste', handleCopyPaste)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    // المؤقت وكشف التوتر
    useEffect(() => {
        if (completed || showBreathingExercise) return

        const timer = setInterval(() => {
            setTimeOnQuestion(prev => prev + 1)
            setTotalTime(prev => prev + 1)
        }, 1000)

        // لو طول في السؤال (أكثر من 45 ثانية) -> استراحة تنفس
        if (timeOnQuestion > 45 && !showResult) {
            triggerBreathingExercise()
            setTimeOnQuestion(0)
        }

        return () => clearInterval(timer)
    }, [timeOnQuestion, completed, showBreathingExercise, showResult, triggerBreathingExercise])

    // تهيئة حالة السؤال الجديد
    useEffect(() => {
        setShowResult(false)
        setSelectedAnswer(null)
        setTimeOnQuestion(0)

        if (question.type === 'algorithm') {
            setUserCode(question.starterCode || '')
        } else if (question.type === 'debug') {
            setUserCode(question.code || '')
        } else {
            setUserCode('')
        }
    }, [currentQuestion, question])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleRunCode = () => {
        // محاكاة التحقق من الكود
        const correct = question.type === 'algorithm'
            ? userCode.includes('max') || userCode.includes('Math.max')
            : userCode.includes(question.correctCode?.slice(0, 20)) // تحقق بسيط

        setIsCorrect(correct)
        setShowResult(true)
        if (correct) setScore(prev => prev + 1)
    }

    const handleMCQSubmit = () => {
        const correct = selectedAnswer === question.correctAnswer
        setIsCorrect(correct)
        setShowResult(true)
        if (correct) setScore(prev => prev + 1)
    }

    const handleNext = () => {
        if (currentQuestion < technicalQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1)
        } else {
            // إنهاء الاختبار
            const finalScore = ((score / technicalQuestions.length) * 100).toFixed(0)
            
            if (isFinalExam) {
                // منطق الامتحان النهائي
                // سنفترض النجاح دائماً للعرض (أو ضع شرط >= 80)
                if (true) { 
                    setCompleted(true)
                    setTimeout(() => {
                        navigate('/certificate')
                    }, 2500)
                } else {
                    alert(`نتيجتك ${finalScore}%. تحتاج لمراجعة الدروس مرة أخرى.`)
                    navigate('/courses')
                }
            } else {
                // منطق تحديد المستوى (Onboarding)
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
    }

    // شاشة الانتهاء (تظهر قبل التوجيه للشهادة أو التقرير)
    if (completed) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
                <div className="glass rounded-3xl p-12 max-w-2xl w-full text-center border border-white/10 animate-fade-in">
                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-12 h-12 text-green-400 animate-pulse" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">
                        {isFinalExam ? 'جاري توثيق النتيجة...' : 'تم تحليل المستوى!'}
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        {isFinalExam ? 'يتم الآن إصدار شهادتك المعتمدة' : 'تم حفظ بيانات أدائك بنجاح'}
                    </p>
                    
                    {!isFinalExam && (
                        <div className="space-y-6">
                            <div className="text-6xl font-bold bg-gradient-to-r from-neon-blue to-neon-violet bg-clip-text text-transparent">
                                {((score / technicalQuestions.length) * 100).toFixed(0)}%
                            </div>
                            <button
                                onClick={() => navigate('/reports')}
                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-violet font-semibold hover:scale-105 transition-transform"
                            >
                                عرض التقرير التفصيلي
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-12 px-6">
            {/* الشريط العلوي الآمن */}
            <div className="fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-b border-white/10 z-40 px-6 py-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-2 text-red-400 animate-pulse">
                    <Lock className="w-5 h-5" />
                    <span className="font-mono text-sm font-bold tracking-wider">
                        {isFinalExam ? 'FINAL EXAM MODE' : 'SECURE ENVIRONMENT'}
                    </span>
                </div>
                <div className="flex items-center gap-6 font-mono">
                    <div className="flex items-center gap-2 text-neon-blue">
                        <Timer className="w-5 h-5" />
                        <span className="text-lg">{formatTime(totalTime)}</span>
                    </div>
                    {warnings > 0 && (
                        <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm font-bold">{warnings} Warnings</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-20">
                {/* شريط التقدم */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400 font-medium">
                            السؤال {currentQuestion + 1} <span className="text-gray-600">/</span> {technicalQuestions.length}
                        </span>
                        <span className="text-sm text-neon-violet font-bold">Front-End Engineering</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-neon-blue to-neon-violet transition-all duration-700 ease-out"
                            style={{ width: `${((currentQuestion + 1) / technicalQuestions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* حاوية السؤال */}
                <div ref={containerRef} className="glass rounded-3xl p-8 md:p-10 border border-white/10 mb-8 relative overflow-hidden shadow-2xl">
                    {/* شريط علوي ملون */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-purple-500 to-neon-violet" />

                    <div className="mb-8">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                question.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                question.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                                {question.difficulty}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-bold uppercase border border-white/5">
                                {question.type.replace('_', ' ')}
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold leading-relaxed" dir="auto">
                            {question.question}
                        </h2>
                    </div>

                    {/* المحتوى التفاعلي */}
                    {question.type === 'mcq' ? (
                        <div className="space-y-6">
                            {question.code && (
                                <div className="bg-[#1e1e1e] rounded-xl p-6 border border-white/10 shadow-inner overflow-x-auto">
                                    <pre className="text-sm font-mono text-gray-300" dir="ltr">
                                        <code>{question.code}</code>
                                    </pre>
                                </div>
                            )}
                            
                            <div className="grid gap-4">
                                {question.options.map((option) => {
                                    const isSelected = selectedAnswer === option.value
                                    const isCorrectOpt = question.correctAnswer === option.value
                                    
                                    let btnClass = 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                    if (showResult) {
                                        if (isCorrectOpt) btnClass = 'bg-green-500/20 border-green-500 text-green-400'
                                        else if (isSelected) btnClass = 'bg-red-500/20 border-red-500 text-red-400'
                                    } else if (isSelected) {
                                        btnClass = 'bg-neon-blue/20 border-neon-blue text-white ring-1 ring-neon-blue'
                                    }

                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => !showResult && setSelectedAnswer(option.value)}
                                            disabled={showResult}
                                            className={`w-full text-left px-6 py-5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${btnClass}`}
                                        >
                                            <span className="font-medium text-lg">{option.label}</span>
                                            {isSelected && !showResult && <div className="w-3 h-3 rounded-full bg-neon-blue shadow-[0_0_10px_rgba(0,217,255,0.8)]" />}
                                        </button>
                                    )
                                })}
                            </div>

                            {!showResult && selectedAnswer && (
                                <button 
                                    onClick={handleMCQSubmit} 
                                    className="w-full mt-4 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-violet font-bold text-lg hover:scale-[1.01] transition-transform shadow-lg shadow-neon-blue/20"
                                >
                                    تأكيد الإجابة
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                                <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-white/5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    <span className="ml-2 text-xs text-gray-500 font-mono">editor.js</span>
                                </div>
                                <Editor
                                    height="400px"
                                    defaultLanguage="javascript"
                                    theme="vs-dark"
                                    value={userCode}
                                    onChange={(value) => setUserCode(value || '')}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 15,
                                        fontFamily: "'Space Grotesk', monospace",
                                        lineNumbers: 'on',
                                        padding: { top: 20, bottom: 20 },
                                        scrollBeyondLastLine: false,
                                        cursorBlinking: 'smooth',
                                        smoothScrolling: true,
                                    }}
                                />
                            </div>
                            
                            {!showResult && (
                                <div className="flex justify-end">
                                    <button 
                                        onClick={handleRunCode} 
                                        className="flex items-center gap-2 px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all shadow-lg shadow-green-900/20 hover:shadow-green-500/20 hover:-translate-y-1"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        تشغيل واختبار الكود
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* النتيجة والتغذية الراجعة */}
                    {showResult && (
                        <div className={`mt-8 p-6 rounded-2xl border animate-slide-up ${isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-full ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                    {isCorrect ? <CheckCircle className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-lg font-bold mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                        {isCorrect ? 'إجابة صحيحة!' : 'حاول مرة أخرى'}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                        {question.explanation || (isCorrect ? 'أحسنت! المنطق البرمجي صحيح.' : 'تأكد من مراجعة المفاهيم الأساسية.')}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <button 
                                    onClick={handleNext} 
                                    className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-bold transition-all hover:scale-105"
                                >
                                    {currentQuestion < technicalQuestions.length - 1 ? 'السؤال التالي' : isFinalExam ? 'إنهاء واستلام الشهادة' : 'إنهاء التقييم'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AssessmentPage