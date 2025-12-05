import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import useSimulationStore from '../store/simulationStore'
import MindprintScanner from '../components/onboarding/MindprintScanner'
import { ChevronRight, Brain, Sparkles, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SecurityMonitor from '../components/assessment/SecurityMonitor'
import ExamIntro from '../components/assessment/ExamIntro'

const Onboarding = () => {
    const { t } = useLanguage()
    const navigate = useNavigate()
    const { fetchOnboardingQuestions, onboardingQuestions, isGeneratingQuestions, startAIAnalysis, user, isAnalyzing, onboardingResult, clearOnboardingResult } = useSimulationStore()
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showScanner, setShowScanner] = useState(true)
    const [introComplete, setIntroComplete] = useState(false)

    useEffect(() => { return () => clearOnboardingResult(); }, []);
    useEffect(() => {
        const init = async () => {
            if (user?.hasCompletedOnboarding && onboardingResult) { setShowScanner(false); return; }
            if (onboardingQuestions.length === 0) await fetchOnboardingQuestions();
            setTimeout(() => setShowScanner(false), 2000); 
        }
        init();
    }, [user, onboardingResult]);

    const handleAnswer = (questionId, value) => setAnswers({ ...answers, [questionId]: value });
    const handleNext = () => { if (currentStep < onboardingQuestions.length - 1) setCurrentStep(currentStep + 1); else handleFinalSubmit(); }
    const handleFinalSubmit = async () => { setShowScanner(true); await startAIAnalysis(answers); setShowScanner(false); }

    if (onboardingResult && user) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="glass max-w-2xl w-full p-12 rounded-[3rem] border border-white/10 text-center relative z-10 animate-scale-up shadow-2xl">
                    <div className="w-24 h-24 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,217,255,0.3)]"><Sparkles className="w-12 h-12 text-neon-blue" /></div>
                    <h1 className="text-5xl font-black mb-6 tracking-tight">ANALYSIS COMPLETE</h1>
                    <div className="bg-white/5 rounded-3xl p-8 mb-8 text-right border border-white/5 shadow-inner"><h3 className="text-neon-violet font-bold mb-3 text-xl">التوصية الاستراتيجية:</h3><p className="text-gray-300 text-lg leading-relaxed">{onboardingResult.reason}</p></div>
                    {onboardingResult.isEligibleForExam ? (
                        <div className="space-y-6">
                            <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 font-bold text-lg flex items-center justify-center gap-3"><CheckCircle className="w-6 h-6" /> نظام متميز! تم تجاوز المسار التعليمي.</div>
                            <button onClick={() => navigate('/assessment?mode=final')} className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-xl rounded-2xl hover:scale-105 transition-transform w-full shadow-xl shadow-orange-500/30">بدء تحدي الشهادة الفوري 🏆</button>
                        </div>
                    ) : (
                        <button onClick={() => navigate('/dashboard')} className="px-10 py-5 bg-gradient-to-r from-neon-blue to-neon-violet text-white font-black text-xl rounded-2xl hover:scale-105 transition-transform w-full shadow-xl shadow-neon-blue/30">الذهاب للوحة التحكم 🚀</button>
                    )}
                </div>
            </div>
        )
    }

    if (!showScanner && !introComplete && !isGeneratingQuestions && onboardingQuestions.length > 0) return <ExamIntro onComplete={() => setIntroComplete(true)} />
    if (showScanner || isGeneratingQuestions || isAnalyzing) return <MindprintScanner stage={isAnalyzing ? 'psychological' : 'technical'} />;

    if (onboardingQuestions.length > 0) {
        const currentQ = onboardingQuestions[currentStep];
        return (
            <div className="min-h-screen bg-slate-950 text-white py-12 px-6 relative overflow-hidden font-sans">
                <SecurityMonitor isActive={true} onViolation={() => {}} />
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-900"><div className="h-full bg-gradient-to-r from-neon-blue to-neon-violet transition-all duration-700 ease-out" style={{ width: `${((currentStep + 1) / onboardingQuestions.length) * 100}%` }} /></div>
                
                <div className="relative z-10 max-w-4xl mx-auto mt-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10"><Brain className="w-8 h-8 text-white" /></div>
                        <div><div className="text-gray-400 font-bold uppercase tracking-wider text-sm">PHASE {currentStep + 1}</div><div className="text-xl font-bold text-white capitalize">{currentQ.category || 'تحليل'}</div></div>
                    </div>
                    
                    <div className="glass rounded-[2.5rem] p-10 md:p-14 border border-white/10 animate-fade-in shadow-2xl bg-slate-900/60 backdrop-blur-xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-10 leading-relaxed" dir="auto">{currentQ.question}</h2>
                        <div className="space-y-4">
                            {currentQ.options?.map((option, idx) => {
                                const val = option.value || option;
                                const label = option.label || option;
                                const isSelected = answers[currentQ.id] === val;
                                return (
                                    <button key={idx} onClick={() => handleAnswer(currentQ.id, val)} className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex justify-between items-center group ${isSelected ? 'bg-gradient-to-r from-neon-blue/20 to-neon-violet/20 border-neon-blue text-white shadow-lg scale-[1.02]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}>
                                        <span className="text-xl font-medium">{label}</span>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-neon-blue bg-neon-blue' : 'border-gray-500 group-hover:border-white'}`}>{isSelected && <CheckCircle className="w-4 h-4 text-black" />}</div>
                                    </button>
                                )
                            })}
                        </div>
                        <div className="mt-12 flex justify-end">
                            <button onClick={handleNext} disabled={!answers[currentQ.id]} className="group px-12 py-5 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                {currentStep === onboardingQuestions.length - 1 ? 'إنهاء التحليل' : 'التالي'}
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Loader className="animate-spin w-12 h-12" /></div>;
}

export default Onboarding