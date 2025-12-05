import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import useSimulationStore from '../store/simulationStore'
import MindprintScanner from '../components/onboarding/MindprintScanner'
import { ChevronRight, Brain, Sparkles, Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Onboarding = () => {
    const { t } = useLanguage()
    const navigate = useNavigate()
    
    const { 
        fetchOnboardingQuestions, 
        onboardingQuestions, 
        isGeneratingQuestions,
        startAIAnalysis, 
        user, 
        isAnalyzing,
        onboardingResult, // ✅ استخدام الحالة من الستور
        clearOnboardingResult // ✅ دالة للتنظيف
    } = useSimulationStore()

    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showScanner, setShowScanner] = useState(true) 

    // تنظيف عند الخروج
    useEffect(() => {
        return () => clearOnboardingResult();
    }, []);

    useEffect(() => {
        const init = async () => {
            // إذا كان المستخدم قد أنهى الـ onboarding بالفعل (مثلاً عبر زر المطور)، لا تجلب الأسئلة
            if (user?.hasCompletedOnboarding && onboardingResult) {
                setShowScanner(false);
                return;
            }

            if (onboardingQuestions.length === 0) {
                await fetchOnboardingQuestions();
            }
            setTimeout(() => setShowScanner(false), 2000); 
        }
        init();
    }, [user, onboardingResult]); // ✅ إعادة التشغيل عند تغير حالة المستخدم

    const handleAnswer = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    }

    const handleNext = () => {
        if (currentStep < onboardingQuestions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleFinalSubmit();
        }
    }

    const handleFinalSubmit = async () => {
        setShowScanner(true); 
        await startAIAnalysis(answers); // الستور سيحدث onboardingResult تلقائياً
        setShowScanner(false);
    }

    // --- شاشة النتائج (تعتمد على الستور الآن) ---
    if (onboardingResult && user) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black z-0" />
                <div className="glass max-w-2xl w-full p-10 rounded-3xl border border-white/10 text-center relative z-10 animate-scale-up">
                    <div className="w-24 h-24 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-12 h-12 text-neon-blue" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">تحليل الذكاء الاصطناعي مكتمل</h1>
                    
                    <div className="bg-white/5 rounded-2xl p-6 mb-8 text-right border border-white/5">
                        <h3 className="text-neon-violet font-bold mb-2">التوصية:</h3>
                        <p className="text-gray-300 text-lg leading-relaxed">{onboardingResult.reason}</p>
                    </div>

                    {onboardingResult.isEligibleForExam ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 font-bold">
                                🌟 مذهل! مستواك يؤهلك لتخطي الدروس ودخول الامتحان النهائي مباشرة.
                            </div>
                            <button 
                                onClick={() => navigate('/assessment?mode=final')} 
                                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:scale-105 transition-transform w-full shadow-lg shadow-orange-500/20"
                            >
                                بدء تحدي الشهادة الفوري 🏆
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-blue-400 font-bold">تم إعداد خطة تعليمية مخصصة لك.</p>
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-violet text-white font-bold rounded-xl hover:scale-105 transition-transform w-full"
                            >
                                الذهاب للوحة التحكم 🚀
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (showScanner || isGeneratingQuestions || isAnalyzing) {
        return <MindprintScanner stage={isAnalyzing ? 'psychological' : 'technical'} />;
    }

    if (onboardingQuestions.length > 0) {
        const currentQ = onboardingQuestions[currentStep];
        const progress = ((currentStep + 1) / onboardingQuestions.length) * 100;

        return (
            <div className="min-h-screen bg-slate-950 text-white py-12 px-6 relative overflow-hidden">
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-20 left-10 w-96 h-96 gradient-orb-1 animate-float" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 gradient-orb-2 animate-float" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-400">سؤال {currentStep + 1} من {onboardingQuestions.length}</span>
                            <span className="text-sm font-semibold text-neon-blue">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-neon-blue to-neon-violet transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    <div className="glass rounded-3xl p-10 border border-white/10 animate-fade-in">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider text-gray-400">{currentQ.category || 'تحليل'}</span>
                        </div>
                        
                        <h2 className="text-3xl font-bold mb-8 leading-relaxed" dir="auto">{currentQ.question}</h2>

                        <div className="space-y-4">
                            {currentQ.options?.map((option, idx) => {
                                const val = option.value || option;
                                const label = option.label || option;
                                const isSelected = answers[currentQ.id] === val;

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(currentQ.id, val)}
                                        className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex justify-between items-center ${
                                            isSelected 
                                            ? 'bg-gradient-to-r from-neon-blue/20 to-neon-violet/20 border-neon-blue text-white shadow-lg' 
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        <span className="text-lg">{label}</span>
                                        {isSelected && <div className="w-4 h-4 rounded-full bg-neon-blue shadow-[0_0_10px_rgba(0,217,255,0.8)]" />}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="mt-10 flex justify-end">
                            <button
                                onClick={handleNext}
                                disabled={!answers[currentQ.id]}
                                className="group px-10 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {currentStep === onboardingQuestions.length - 1 ? 'إنهاء التحليل' : 'التالي'}
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
}

export default Onboarding