import React, { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { CheckCircle, XCircle, Timer, Brain, Loader, ArrowRight, Award, Hammer, AlertOctagon, Bug, ListOrdered, Code2, Lightbulb, ShieldAlert } from 'lucide-react'
import useSimulationStore from '../store/simulationStore'
import Navbar from '../components/Navbar'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SecurityMonitor from '../components/assessment/SecurityMonitor'
import ExamIntro from '../components/assessment/ExamIntro'

const AssessmentPage = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const isFinalMode = searchParams.get('mode') === 'final'

    const { 
        startNewAssessment, currentAssessmentQuestions, isGeneratingQuestions, 
        submitAnswerToAI, submitFinalExam, activateRemedialMode,
        isEvaluating, finalizeAssessmentAI, isAnalyzing, courses,
        finalReport, clearFinalReport, startFinalExam
    } = useSimulationStore()

    const [introComplete, setIntroComplete] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [userCode, setUserCode] = useState('')
    const [selectedOption, setSelectedOption] = useState(null)
    const [orderedItems, setOrderedItems] = useState([])
    const [feedback, setFeedback] = useState(null) 
    const [timeOnQuestion, setTimeOnQuestion] = useState(0)
    const [finalExamAnswers, setFinalExamAnswers] = useState({})
    const [violations, setViolations] = useState(0)

    const question = currentAssessmentQuestions?.[currentIndex]

    // ✅ منطق التهيئة الذكي (The Fix)
    useEffect(() => {
        const initExam = async () => {
            clearFinalReport();
            
            // إذا لم تكن هناك أسئلة محملة
            if (!currentAssessmentQuestions || currentAssessmentQuestions.length === 0) {
                if (isFinalMode) {
                    // محاولة العثور على كورس نشط
                    const activeCourse = courses.find(c => c.isScheduled) || courses[0];
                    
                    if (activeCourse) {
                        // سيناريو 1: يوجد كورس -> امتحان نهائي للكورس
                        await startFinalExam(activeCourse.id);
                    } else {
                        // سيناريو 2 (الإصلاح): مستخدم جديد خبير بدون كورسات -> امتحان تحديد مستوى عام
                        // نستخدم startNewAssessment لتوليد أسئلة بناءً على ملفه التقني
                        // لكننا نحافظ على isFinalMode في الواجهة
                        await startNewAssessment();
                    }
                } else {
                    // وضع التدريب العادي
                    await startNewAssessment();
                }
            }
        };

        if (!isGeneratingQuestions) {
            initExam();
        }
    }, [isFinalMode]);

    // ... (نفس كود المؤقت والأسئلة السابق)
    useEffect(() => {
        if (!introComplete) return;
        let interval;
        const shouldRunTimer = isFinalMode ? !finalReport : (!feedback && !finalReport);
        if (shouldRunTimer && question) {
            interval = setInterval(() => setTimeOnQuestion(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [feedback, finalReport, question, isFinalMode, introComplete]);

    useEffect(() => {
        if (question) {
            setUserCode(question.codeSnippet || question.starterCode || '');
            const savedAnswer = finalExamAnswers[question.id];
            if (question.type === 'logic_order') {
                setOrderedItems(question.items ? [...question.items].sort(() => Math.random() - 0.5) : []);
            } else {
                setSelectedOption(savedAnswer ? savedAnswer.answer : null);
            }
            if (!isFinalMode) setFeedback(null);
            setTimeOnQuestion(0);
        }
    }, [currentIndex, question]);

    const handleAnswerSubmit = async () => {
        let answer;
        if (question.type === 'logic_order') answer = orderedItems;
        else answer = selectedOption || userCode;

        if (isFinalMode) {
            setFinalExamAnswers(prev => ({ ...prev, [question.id]: { answer, time: timeOnQuestion } }));
            if (currentIndex < currentAssessmentQuestions.length - 1) setCurrentIndex(prev => prev + 1);
            else finishFinalExam();
        } else {
            const result = await submitAnswerToAI(question.id, answer, timeOnQuestion);
            setFeedback(result);
        }
    };

    // ✅ إصلاح منطق الإنهاء (للتعامل مع عدم وجود كورس)
    const finishFinalExam = async () => {
        const allAnswers = { ...finalExamAnswers };
        let currentAns;
        if (question.type === 'logic_order') currentAns = orderedItems;
        else currentAns = selectedOption || userCode;
        
        allAnswers[question.id] = { answer: currentAns, time: timeOnQuestion };
        
        const activeCourse = courses.find(c => c.isScheduled) || courses[0];
        
        if (activeCourse) {
            const totalTime = Object.values(allAnswers).reduce((acc, curr) => acc + curr.time, 0);
            await submitFinalExam(activeCourse.id, allAnswers, totalTime); 
        } else {
            // حالة خاصة: امتحان تحديد مستوى (بدون كورس)
            // نقوم بمعالجته كـ Assessment عادي ولكن نعرض النتيجة النهائية
            await finalizeAssessmentAI(); 
        }
    };

    // ... (نفس دالة renderQuestionContent والنصوص الملونة السابقة تماماً)
    const QuestionText = ({ text }) => {
        if (!text) return null;
        const highlightedText = text.split(/(\s+)/).map((word, index) => {
            if (/error|bug|fix|mistake/i.test(word)) return <span key={index} className="text-red-400 font-bold">{word}</span>;
            if (/function|array|object|class|const|let|var/i.test(word)) return <span key={index} className="text-purple-400 font-mono">{word}</span>;
            if (/calculate|find|analyze|optimize/i.test(word)) return <span key={index} className="text-neon-blue font-bold">{word}</span>;
            return word;
        });
        return <h2 className="text-2xl md:text-3xl font-bold leading-relaxed mb-6" dir="auto">{highlightedText}</h2>;
    };

    const renderQuestionContent = () => {
        switch (question.type) {
            case 'spot_bug':
                return (
                    <div className="space-y-6">
                        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-xl flex gap-3 items-start">
                            <Bug className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-red-400 mb-1">مهمة تصحيح (Debug)</h4>
                                <p className="text-sm text-gray-300">يوجد خطأ منطقي أو نحوي في الكود أدناه. اكتشفه واكتب الحل.</p>
                            </div>
                        </div>
                        <div className="border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-[#1e1e1e]">
                            <div className="bg-white/5 px-4 py-2 text-xs text-gray-500 font-mono border-b border-white/5 flex justify-between">
                                <span>source_code.js</span>
                                <span>READ ONLY</span>
                            </div>
                            <Editor height="300px" defaultLanguage="javascript" theme="vs-dark" value={userCode} options={{ readOnly: true, fontSize: 15, minimap: { enabled: false }, padding: { top: 20 } }} />
                        </div>
                        <textarea className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-5 text-white placeholder-gray-500 focus:border-neon-blue outline-none transition-all focus:ring-1 focus:ring-neon-blue/50 text-lg" rows="3" placeholder="اشرح الخطأ هنا أو اكتب الكود المصحح..." onChange={(e) => setSelectedOption(e.target.value)} />
                    </div>
                );
            case 'logic_order':
                return (
                    <div className="space-y-6">
                        <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-r-xl flex gap-3 items-start">
                            <ListOrdered className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-yellow-400 mb-1">ترتيب منطقي (Logic Order)</h4>
                                <p className="text-sm text-gray-300">رتب القطع البرمجية التالية لتكوين حل صحيح. اضغط للتحريك للأعلى.</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {orderedItems.map((item, idx) => (
                                <div key={idx} onClick={() => { const newItems = [...orderedItems]; if (idx > 0) { [newItems[idx], newItems[idx-1]] = [newItems[idx-1], newItems[idx]]; setOrderedItems(newItems); } }} className="group p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 hover:border-neon-blue transition-all flex items-center gap-4 active:scale-[0.98]">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-mono font-bold text-neon-blue group-hover:bg-neon-blue group-hover:text-black transition-colors">{idx + 1}</div>
                                    <code className="text-base text-blue-200 font-mono flex-1">{item}</code>
                                    <div className="opacity-0 group-hover:opacity-100 text-gray-400 text-xs">▲ تحريك</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'fill_code':
                return (
                    <div className="space-y-6">
                        <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded-r-xl flex gap-3 items-start">
                            <Code2 className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-purple-400 mb-1">إكمال الكود (Complete)</h4>
                                <p className="text-sm text-gray-300">الكود أدناه غير مكتمل. املأ الفراغات الناقصة ليعمل بشكل صحيح.</p>
                            </div>
                        </div>
                        <div className="border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-[#1e1e1e]">
                             <div className="bg-white/5 px-4 py-2 text-xs text-gray-500 font-mono border-b border-white/5">interactive_editor.js</div>
                            <Editor height="350px" defaultLanguage="javascript" theme="vs-dark" value={userCode} onChange={(val) => setUserCode(val)} options={{ fontSize: 16, minimap: { enabled: false }, padding: { top: 20 } }} />
                        </div>
                    </div>
                );
            default: // MCQ
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-xl flex gap-3 items-start">
                            <Lightbulb className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-blue-400 mb-1">تحليل ومفاهيم</h4>
                                <p className="text-sm text-gray-300">اختر الإجابة الدقيقة التي تعكس فهماً عميقاً للمفهوم.</p>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {question.options?.map((opt, idx) => { 
                                const val = opt.value || opt; 
                                const label = opt.label || opt; 
                                return (
                                    <button 
                                        key={idx} 
                                        onClick={() => !feedback && setSelectedOption(val)} 
                                        disabled={!!feedback} 
                                        className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 group flex justify-between items-center relative overflow-hidden ${selectedOption === val ? 'bg-gradient-to-r from-neon-blue/20 to-transparent border-neon-blue shadow-[0_0_20px_rgba(0,217,255,0.2)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${selectedOption === val ? 'border-neon-blue bg-neon-blue text-black' : 'border-gray-500 text-gray-500 group-hover:border-white group-hover:text-white'}`}>{String.fromCharCode(65 + idx)}</div>
                                        <span className="text-lg font-medium flex-1 text-gray-200 group-hover:text-white transition-colors">{label}</span>
                                        {selectedOption === val && <CheckCircle className="w-6 h-6 text-neon-blue animate-bounce" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                );
        }
    };

    if (!introComplete && !isGeneratingQuestions && !finalReport) {
        return <ExamIntro onComplete={() => setIntroComplete(true)} />
    }

    if (finalReport) {
        const isPass = isFinalMode ? finalReport.passed : true; 
        return (
            <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="glass max-w-3xl w-full p-12 rounded-[3rem] border border-white/10 text-center animate-scale-up relative z-10 shadow-2xl">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_currentColor] ${isPass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{isPass ? <Award className="w-16 h-16" /> : <XCircle className="w-16 h-16" />}</div>
                    <h1 className="text-5xl font-black mb-4 tracking-tight">{isFinalMode ? (isPass ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED') : 'ANALYSIS COMPLETE'}</h1>
                    <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-purple-500 to-neon-pink my-10 font-mono tracking-tighter drop-shadow-lg">{isFinalMode ? finalReport.score : finalReport.finalScore}%</div>
                    {violations > 0 && <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl mb-8 flex items-center justify-center gap-3 text-red-300 font-mono"><AlertOctagon className="w-6 h-6" /> SECURITY REPORT: {violations} Violations Detected</div>}
                    <div className="bg-white/5 rounded-3xl p-8 mb-10 text-right border border-white/10"><h3 className="text-neon-blue font-bold mb-4 flex items-center gap-2 text-xl"><Brain className="w-6 h-6" /> تحليل الذكاء الاصطناعي:</h3><p className="text-gray-300 leading-relaxed text-lg">{isFinalMode ? finalReport.feedback : finalReport.summary}</p></div>
                    <div className="flex justify-center gap-6">
                        <button onClick={() => navigate('/dashboard')} className="px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/10 text-white font-bold text-lg transition-all">الرئيسية</button>
                        {isFinalMode && !isPass && courses.length > 0 && <button onClick={() => activateRemedialMode(courses[0].id, finalReport.score).then(() => navigate(`/journey/${courses[0].id}`))} disabled={isAnalyzing} className="px-10 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-2xl hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 flex items-center gap-3 transition-all"><Hammer className="w-6 h-6" /> تفعيل بروتوكول الإنقاذ</button>}
                    </div>
                </div>
            </div>
        );
    }

    if (isGeneratingQuestions) return <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white"><Brain className="w-24 h-24 text-neon-blue animate-pulse mb-8" /><h2 className="text-3xl font-bold">جاري تحضير التحدي...</h2></div>;
    if (!question) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col font-sans">
            <SecurityMonitor isActive={!finalReport} onViolation={() => setViolations(prev => prev + 1)} />
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-900 z-50"><div className="h-full bg-gradient-to-r from-neon-blue to-neon-violet transition-all duration-1000 ease-linear" style={{ width: `${((currentIndex) / (currentAssessmentQuestions.length)) * 100}%` }} /></div>
            
            <div className="flex-1 py-12 px-6 flex items-center justify-center relative z-10">
                <div className="w-full max-w-6xl">
                    <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-black text-3xl shadow-lg">{String(currentIndex + 1).padStart(2, '0')}</div>
                            <div>
                                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em] mb-1">{isFinalMode ? 'FINAL EXAM' : 'SKILL CHECK'}</h3>
                                <div className="flex items-center gap-3"><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${question.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{question.difficulty || 'Medium'}</span><span className="font-bold text-white capitalize text-lg">{question.type?.replace('_', ' ')}</span></div>
                            </div>
                        </div>
                        <div className={`flex items-center gap-3 font-mono text-3xl bg-black/40 px-6 py-3 rounded-2xl border border-white/10 shadow-inner ${timeOnQuestion > 120 ? 'text-red-500 animate-pulse border-red-500/50' : 'text-neon-blue'}`}><Timer className="w-8 h-8" />{Math.floor(timeOnQuestion / 60)}:{String(timeOnQuestion % 60).padStart(2, '0')}</div>
                    </div>

                    <div className="glass rounded-[3rem] p-10 md:p-16 border border-white/10 relative overflow-hidden shadow-2xl bg-slate-900/50 backdrop-blur-3xl">
                        {isFinalMode && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 animate-gradient" />}
                        
                        <QuestionText text={question.question} />
                        {renderQuestionContent()}

                        <div className="mt-12 flex justify-end items-center pt-8 border-t border-white/5">
                            {!feedback ? (
                                <button onClick={handleAnswerSubmit} disabled={isEvaluating} className="group relative px-12 py-5 bg-gradient-to-r from-neon-blue to-neon-violet rounded-2xl font-bold text-white text-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)]">
                                    <span className="relative z-10 flex items-center gap-3">{isEvaluating ? <Loader className="animate-spin w-6 h-6" /> : isFinalMode ? (currentIndex === currentAssessmentQuestions.length - 1 ? 'إنهاء الامتحان' : 'التالي') : 'تأكيد الإجابة'} {!isEvaluating && <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}</span>
                                </button>
                            ) : (
                                <div className="w-full animate-fade-in-up">
                                    <div className={`p-6 rounded-2xl mb-6 border-l-8 ${feedback.isCorrect ? 'bg-green-950/30 border-green-500' : 'bg-red-950/30 border-red-500'}`}>
                                        <p className={`font-bold text-xl flex items-center gap-3 mb-2 ${feedback.isCorrect ? 'text-green-400' : 'text-red-400'}`}>{feedback.isCorrect ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}{feedback.isCorrect ? 'إجابة مثالية!' : 'تحتاج للمراجعة'}</p>
                                        <p className="text-gray-300 text-lg leading-relaxed pl-11">{feedback.feedback}</p>
                                    </div>
                                    <button onClick={() => { if(currentIndex < currentAssessmentQuestions.length - 1) setCurrentIndex(prev => prev+1); else finalizeAssessmentAI(); }} className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-xl transition-all border border-white/10 hover:border-white/30">الانتقال للسؤال التالي</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssessmentPage