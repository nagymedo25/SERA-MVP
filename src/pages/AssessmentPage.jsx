import React, { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Play, CheckCircle, XCircle, Timer, Brain, Loader, Cpu, ArrowRight, Award, Hammer } from 'lucide-react'
import useSimulationStore from '../store/simulationStore'
import Navbar from '../components/Navbar'
import { useNavigate, useSearchParams } from 'react-router-dom'

const AssessmentPage = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const isFinalMode = searchParams.get('mode') === 'final'

    const { 
        startNewAssessment, currentAssessmentQuestions, isGeneratingQuestions, 
        submitAnswerToAI, submitFinalExam, activateRemedialMode,
        isEvaluating, finalizeAssessmentAI, isAnalyzing, courses,
        finalReport, clearFinalReport // ✅ استخدام الستور
    } = useSimulationStore()

    const [currentIndex, setCurrentIndex] = useState(0)
    const [userCode, setUserCode] = useState('')
    const [selectedOption, setSelectedOption] = useState(null)
    const [feedback, setFeedback] = useState(null) 
    const [timeOnQuestion, setTimeOnQuestion] = useState(0)
    const [finalExamAnswers, setFinalExamAnswers] = useState({})

    const question = currentAssessmentQuestions?.[currentIndex]

    // عند الدخول: تنظيف التقرير القديم والبدء إذا لزم الأمر
    useEffect(() => {
        clearFinalReport();
        if ((!currentAssessmentQuestions || currentAssessmentQuestions.length === 0) && !isGeneratingQuestions) {
            if (!isFinalMode) startNewAssessment(); else navigate('/dashboard');
        }
        return () => clearFinalReport();
    }, []);

    useEffect(() => {
        let interval;
        const shouldRunTimer = isFinalMode ? !finalReport : (!feedback && !finalReport);
        if (shouldRunTimer && question) {
            interval = setInterval(() => setTimeOnQuestion(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [feedback, finalReport, question, isFinalMode]);

    useEffect(() => {
        if (question) {
            setUserCode(question.starterCode || '');
            const savedAnswer = finalExamAnswers[question.id];
            setSelectedOption(savedAnswer ? savedAnswer.answer : null);
            if (!isFinalMode) setFeedback(null);
            setTimeOnQuestion(0);
        }
    }, [currentIndex, question]);

    const handlePracticeSubmit = async () => {
        let answer = selectedOption || userCode;
        if (!answer) return;
        const result = await submitAnswerToAI(question.id, answer, timeOnQuestion);
        setFeedback(result);
    };

    const handleFinalNext = () => {
        let answer = selectedOption || userCode;
        if (answer) {
            setFinalExamAnswers(prev => ({ ...prev, [question.id]: { answer, time: timeOnQuestion } }));
        }
        if (currentIndex < currentAssessmentQuestions.length - 1) setCurrentIndex(prev => prev + 1);
        else finishFinalExam();
    };

    const finishFinalExam = async () => {
        const allAnswers = { ...finalExamAnswers };
        if (selectedOption || userCode) allAnswers[question.id] = { answer: selectedOption || userCode, time: timeOnQuestion };
        const totalTime = Object.values(allAnswers).reduce((acc, curr) => acc + curr.time, 0);
        const activeCourse = courses.find(c => c.isScheduled) || courses[0];
        
        await submitFinalExam(activeCourse.id, allAnswers, totalTime); 
    };

    const handleRemedialPlan = async () => {
        const activeCourse = courses.find(c => c.isScheduled) || courses[0];
        if (activeCourse) {
            const success = await activateRemedialMode(activeCourse.id, finalReport.score);
            if (success) navigate(`/journey/${activeCourse.id}`);
        }
    };

    const handlePracticeNext = async () => {
        if (currentIndex < currentAssessmentQuestions.length - 1) setCurrentIndex(prev => prev + 1);
        else await finalizeAssessmentAI();
    };

    // --- الشاشات ---

    // 1. التقرير النهائي (من الستور)
    if (finalReport) {
        const isPass = isFinalMode ? finalReport.passed : true; 
        return (
            <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
                <div className="glass max-w-2xl w-full p-10 rounded-3xl border border-white/10 text-center animate-scale-up">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ${isPass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{isPass ? <Award className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}</div>
                    <h1 className="text-4xl font-bold mb-2">{isFinalMode ? (isPass ? 'مبروك! لقد اجتزت الكورس' : 'تحتاج لمراجعة إضافية') : 'تم تحديث التحليل!'}</h1>
                    <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet my-8 font-mono">{isFinalMode ? finalReport.score : finalReport.finalScore}%</div>
                    <div className="bg-white/5 rounded-2xl p-6 mb-8 text-right"><h3 className="text-neon-blue font-bold mb-2 flex items-center gap-2"><Brain className="w-4 h-4" /> تحليل الذكاء الاصطناعي:</h3><p className="text-gray-300 leading-relaxed text-lg">{isFinalMode ? finalReport.feedback : finalReport.summary}</p></div>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <button onClick={() => navigate('/dashboard')} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300">الرئيسية</button>
                        {isFinalMode && isPass && <button onClick={() => navigate('/certificate')} className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:scale-105 flex items-center gap-2"><Award className="w-5 h-5" /> استلام الشهادة</button>}
                        {isFinalMode && !isPass && <button onClick={handleRemedialPlan} disabled={isAnalyzing} className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:scale-105 flex items-center gap-2"><Hammer className="w-5 h-5" /> خطة إنقاذ ذكية</button>}
                    </div>
                </div>
            </div>
        );
    }

    // 2. شاشات التحميل
    if (isGeneratingQuestions) return <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white"><Brain className="w-16 h-16 text-neon-blue animate-pulse mb-4" /><h2 className="text-2xl font-bold">جاري تحضير التحدي...</h2></div>;
    if (isAnalyzing) return <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">{finalReport ? <><Hammer className="w-16 h-16 text-pink-500 animate-bounce mb-4" /><h2 className="text-2xl font-bold text-pink-400">جاري بناء الخطة العلاجية...</h2></> : <><Cpu className="w-16 h-16 text-neon-violet animate-spin mb-4" /><h2 className="text-2xl font-bold">جاري التصحيح والتحليل...</h2></>}</div>;
    
    // 3. شاشة السؤال
    if (!question) return null;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-gray-400">{isFinalMode ? 'الامتحان النهائي' : 'تدريب المهارات'} • سؤال {currentIndex + 1} من {currentAssessmentQuestions?.length || 0}</div>
                        <div className={`flex items-center gap-2 font-mono text-xl ${timeOnQuestion > 60 ? 'text-red-400' : 'text-neon-blue'}`}><Timer className="w-5 h-5" />{Math.floor(timeOnQuestion / 60)}:{String(timeOnQuestion % 60).padStart(2, '0')}</div>
                    </div>
                    <div className="glass rounded-3xl p-8 border border-white/10 mb-8 relative overflow-hidden">
                        {isFinalMode && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-violet opacity-50" />}
                        <div className="mb-6"><span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-500/20 text-blue-400">{question.difficulty}</span><h2 className="text-2xl font-bold leading-relaxed" dir="auto">{question.question}</h2></div>
                        {question.type === 'mcq' ? (
                            <div className="grid gap-3">{question.options?.map((opt, idx) => { const val = opt.value || opt; const label = opt.label || opt; return (<button key={idx} onClick={() => (!feedback && !isFinalMode) ? setSelectedOption(val) : handleFinalSelect(val)} disabled={!!feedback} className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group flex justify-between items-center ${(selectedOption === val) ? 'bg-neon-blue/10 border-neon-blue text-white' : 'bg-white/5 border-white/10'}`}><span>{label}</span></button>)})}</div>
                        ) : (
                            <div className="border border-white/10 rounded-xl overflow-hidden relative"><Editor height="400px" defaultLanguage="javascript" theme="vs-dark" value={userCode} onChange={(val) => { setUserCode(val); if (isFinalMode) setSelectedOption('code_submitted'); }} options={{ readOnly: !!feedback, minimap: { enabled: false }, fontSize: 16 }} /></div>
                        )}
                        <div className="mt-8 flex justify-end">
                            {isFinalMode ? (
                                <button onClick={handleFinalNext} disabled={!selectedOption && !userCode} className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-transform">{currentIndex === currentAssessmentQuestions.length - 1 ? 'إنهاء الامتحان' : 'التالي'} <ArrowRight className="w-5 h-5" /></button>
                            ) : (
                                <>{!feedback ? (<button onClick={handlePracticeSubmit} disabled={isEvaluating || (!selectedOption && !userCode)} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-violet rounded-xl font-bold hover:scale-105">{isEvaluating ? <Loader className="animate-spin" /> : <Play className="w-5 h-5 fill-current" />} تحقق</button>) : (<button onClick={handlePracticeNext} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold">التالي</button>)}</>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AssessmentPage