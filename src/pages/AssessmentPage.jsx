import React, { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Play, CheckCircle, XCircle, Timer, Brain, Loader, Cpu } from 'lucide-react'
import useSimulationStore from '../store/simulationStore'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

const AssessmentPage = () => {
    const navigate = useNavigate()
    const { 
        startNewAssessment, 
        currentAssessmentQuestions, 
        isGeneratingQuestions, 
        submitAnswerToAI, 
        isEvaluating,
        finalizeAssessmentAI,
        isAnalyzing 
    } = useSimulationStore()

    const [currentIndex, setCurrentIndex] = useState(0)
    const [userCode, setUserCode] = useState('')
    const [selectedOption, setSelectedOption] = useState(null)
    const [feedback, setFeedback] = useState(null)
    const [timeOnQuestion, setTimeOnQuestion] = useState(0)
    const [finalReport, setFinalReport] = useState(null)

    // ✅ التعديل هنا: استخدام Optional Chaining (?.) لمنع الخطأ إذا كانت المصفوفة فارغة
    const question = currentAssessmentQuestions?.[currentIndex]

    // 1. تحميل الأسئلة عند فتح الصفحة
    useEffect(() => {
        // نتأكد أننا لا نولد أسئلة إذا كانت موجودة بالفعل أو إذا كان هناك عملية توليد جارية
        if ((!currentAssessmentQuestions || currentAssessmentQuestions.length === 0) && !isGeneratingQuestions) {
            startNewAssessment();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // 2. المؤقت لكل سؤال
    useEffect(() => {
        let interval;
        if (!feedback && !finalReport && question) {
            interval = setInterval(() => setTimeOnQuestion(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [feedback, finalReport, question]);

    // 3. تهيئة السؤال الجديد
    useEffect(() => {
        if (question) {
            setUserCode(question.starterCode || '');
            setSelectedOption(null);
            setFeedback(null);
            setTimeOnQuestion(0);
        }
    }, [question]);

    const handleSubmit = async () => {
        let answer = selectedOption;
        if (question.type !== 'mcq') answer = userCode;

        if (!answer) return;

        const result = await submitAnswerToAI(question.id, answer, timeOnQuestion);
        setFeedback(result);
    };

    const handleNext = async () => {
        if (currentAssessmentQuestions && currentIndex < currentAssessmentQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            const report = await finalizeAssessmentAI();
            setFinalReport(report);
        }
    };

    // --- شاشات التحميل ---
    // ✅ التأكد من عرض شاشة التحميل إذا لم يكن هناك سؤال بعد
    if (isGeneratingQuestions || !question && !finalReport) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <Brain className="w-16 h-16 text-neon-blue animate-pulse mb-4" />
                <h2 className="text-2xl font-bold">الذكاء الاصطناعي يحلل ملفك...</h2>
                <p className="text-gray-400">جاري صياغة أسئلة تتحدى نقاط ضعفك 🧠</p>
            </div>
        );
    }

    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <Cpu className="w-16 h-16 text-neon-violet animate-spin mb-4" />
                <h2 className="text-2xl font-bold">جاري تحليل الأداء النفسي والتقني...</h2>
                <p className="text-gray-400">يتم تحديث الجينوم البرمجي الخاص بك 🧬</p>
            </div>
        );
    }

    // --- شاشة التقرير النهائي ---
    if (finalReport) {
        return (
            <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
                <div className="glass max-w-2xl w-full p-8 rounded-3xl border border-neon-violet/30 text-center">
                    <div className="w-20 h-20 bg-neon-violet/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-neon-violet" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">تم تحديث ملفك بنجاح!</h1>
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet my-6">
                        {finalReport.finalScore}%
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                        {finalReport.summary}
                    </p>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
                    >
                        العودة للوحة التحكم
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header & Timer */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-gray-400">
                            سؤال {currentIndex + 1} من {currentAssessmentQuestions?.length || 0}
                        </div>
                        <div className="flex items-center gap-2 text-neon-blue font-mono text-xl">
                            <Timer className="w-5 h-5" />
                            {Math.floor(timeOnQuestion / 60)}:{String(timeOnQuestion % 60).padStart(2, '0')}
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="glass rounded-3xl p-8 border border-white/10 mb-8">
                        <div className="mb-6">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wide
                                ${question.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {question.difficulty} | {question.type}
                            </span>
                            <h2 className="text-2xl font-bold leading-relaxed" dir="auto">{question.question}</h2>
                        </div>

                        {/* Interactive Area */}
                        {question.type === 'mcq' ? (
                            <div className="grid gap-3">
                                {question.options?.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => !feedback && setSelectedOption(opt.value)}
                                        disabled={!!feedback}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                                            selectedOption === opt.value 
                                                ? 'bg-neon-blue/20 border-neon-blue text-white' 
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="border border-white/10 rounded-xl overflow-hidden">
                                <Editor
                                    height="400px"
                                    defaultLanguage="javascript"
                                    theme="vs-dark"
                                    value={userCode}
                                    onChange={(val) => !feedback && setUserCode(val)}
                                    options={{ readOnly: !!feedback, minimap: { enabled: false }, fontSize: 16 }}
                                />
                            </div>
                        )}

                        {/* Actions Area */}
                        <div className="mt-8 flex justify-end">
                            {!feedback ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isEvaluating}
                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-violet rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50"
                                >
                                    {isEvaluating ? <Loader className="animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                                    {isEvaluating ? 'جاري التحليل...' : 'إرسال وتحليل'}
                                </button>
                            ) : (
                                <div className="w-full animate-fade-in">
                                    <div className={`p-6 rounded-xl border mb-6 ${feedback.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            {feedback.isCorrect ? <CheckCircle className="text-green-400" /> : <XCircle className="text-red-400" />}
                                            <h3 className="font-bold text-lg">{feedback.isCorrect ? 'إجابة صحيحة' : 'تحتاج لمراجعة'}</h3>
                                        </div>
                                        <p className="text-gray-300 mb-2">{feedback.explanation}</p>
                                        
                                        {/* AI Psychological Note */}
                                        {feedback.psychologicalNote && (
                                            <div className="mt-3 pt-3 border-t border-white/10 text-sm text-neon-blue flex items-start gap-2">
                                                <Brain className="w-4 h-4 mt-1 shrink-0" />
                                                <p>ملاحظة الذكاء الاصطناعي: {feedback.psychologicalNote}</p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors"
                                    >
                                        {currentIndex < (currentAssessmentQuestions?.length || 0) - 1 ? 'السؤال التالي' : 'إنهاء وعرض التقرير'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AssessmentPage