import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { 
    X, Calendar, CheckCircle, Lock, PlayCircle, 
    Clock, FastForward, Trophy, ArrowLeft, Loader, AlertCircle, MapPin, Award 
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Navbar from '../components/Navbar'
import useSimulationStore from '../store/simulationStore'

const LessonModal = ({ lesson, courseId, lessonIndex, onClose, onComplete }) => {
    const [isCompleting, setIsCompleting] = useState(false);
    const handleComplete = () => {
        setIsCompleting(true);
        setTimeout(() => { onComplete(courseId, lessonIndex); onClose(); }, 1000);
    };
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in">
            <div className="glass w-full max-w-4xl h-[85vh] rounded-3xl border border-white/10 flex flex-col overflow-hidden relative shadow-2xl transform scale-100 transition-all">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h3 className="text-neon-blue text-sm font-bold uppercase tracking-wider mb-1">درس تعليمي</h3>
                        <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400 hover:text-white" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
                    <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed"><ReactMarkdown>{lesson.content || lesson.description || "محتوى الدرس..."}</ReactMarkdown></div>
                </div>
                <div className="p-6 border-t border-white/10 bg-slate-900/80 backdrop-blur flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-400"><Clock className="w-4 h-4" /><span>{lesson.duration || '15m'}</span></div>
                    <button onClick={handleComplete} disabled={isCompleting} className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-all font-bold text-white shadow-lg shadow-green-500/20 flex items-center gap-2">{isCompleting ? 'جاري الحفظ...' : <>إتمام الدرس والمتابعة <CheckCircle className="w-5 h-5" /></>}</button>
                </div>
            </div>
        </div>
    );
};

const CourseJourneyPage = () => {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const { courses, simulateCompleteLesson, startFinalExam } = useSimulationStore()
    const course = courses.find(c => c.id === courseId)
    
    const [viewingLesson, setViewingLesson] = useState(null)
    const [isGeneratingFinal, setIsGeneratingFinal] = useState(false)
    
    const scrollRef = useRef(null)
    const nodesRef = useRef([]) 
    const prevCompletedCount = useRef(0)

    useEffect(() => {
        if (!course) navigate('/courses')
    }, [course, navigate])

    // ========================================================
    // ✅ الإصلاح: تصفية الخريطة (Roadmap Filtering)
    // ========================================================
    const { validRoadmap, progress, isFinalUnlocked, hasCertificate } = useMemo(() => {
        if (!course) return { validRoadmap: [], progress: 0, isFinalUnlocked: false, hasCertificate: false };

        const rawRoadmap = course.schedule?.roadmap || [];
        const totalLessons = course.lessons.length;
        const hasCert = course.hasCertificate;

        // 1. نحتفظ فقط بالعقد التي تشير لدروس حقيقية موجودة في المصفوفة
        // (ونتجاهل أي عقد إضافية هلوس بها الذكاء الاصطناعي خارج النطاق)
        const validNodes = rawRoadmap.filter(node => {
            if (node.type === 'failed_exam') return true; // الاحتفاظ بسجل الرسوب
            return node.lessonIndex !== undefined && node.lessonIndex < totalLessons;
        });

        // 2. حساب عدد الدروس المكتملة من القائمة "الصحيحة" فقط
        const lessonsOnly = validNodes.filter(n => n.type !== 'failed_exam');
        const completedCount = lessonsOnly.filter(n => n.status === 'completed').length;
        const totalValidLessons = lessonsOnly.length;

        // 3. شرط الفتح: الشهادة موجودة، أو جميع الدروس الحقيقية مكتملة
        const unlocked = hasCert || (totalValidLessons > 0 && completedCount === totalValidLessons);
        
        // 4. النسبة المئوية الدقيقة
        const prog = hasCert ? 100 : (totalValidLessons === 0 ? 0 : (completedCount / totalValidLessons) * 100);

        return { 
            validRoadmap: validNodes, 
            progress: prog, 
            isFinalUnlocked: unlocked, 
            hasCertificate: hasCert,
            completedCount // نحتاجه للأنيميشن
        };
    }, [course]);

    // أنيميشن الدخول
    useEffect(() => {
        gsap.fromTo('.journey-node', 
            { scale: 0, opacity: 0, y: 20 }, 
            { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' }
        );
        setTimeout(() => {
            const activeNode = document.querySelector('.node-active');
            if (activeNode) activeNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
        prevCompletedCount.current = validRoadmap.filter(n => n.status === 'completed').length;
    }, [validRoadmap.length]); // إعادة التشغيل عند تغير طول الخريطة

    // أنيميشن التقدم
    useEffect(() => {
        const currentCompleted = validRoadmap.filter(n => n.status === 'completed').length;
        if (currentCompleted > prevCompletedCount.current) {
            const nextIndex = currentCompleted; // تقريبي
            const tl = gsap.timeline();
            if (nodesRef.current[nextIndex]) {
                tl.fromTo(nodesRef.current[nextIndex], 
                    { scale: 1, borderColor: '#334155' },
                    { scale: 1.3, borderColor: '#00d9ff', boxShadow: '0 0 50px rgba(0,217,255,0.8)', duration: 0.6, ease: 'elastic.out(1, 0.5)' },
                    "-=0.2"
                );
                tl.to(nodesRef.current[nextIndex], { scale: 1.1, duration: 0.4 });
                setTimeout(() => { nodesRef.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 800);
            }
            prevCompletedCount.current = currentCompleted;
        }
    }, [validRoadmap]);

    if (!course) return null;

    const handleSimulate = (cId, lIdx) => { simulateCompleteLesson(cId, lIdx); };

    const handleStartFinal = async () => {
        if (hasCertificate) {
            navigate('/certificate'); 
            return;
        }
        if (isGeneratingFinal) return;
        setIsGeneratingFinal(true);
        try {
            await startFinalExam(course.id);
            navigate('/assessment?mode=final');
        } catch (error) {
            console.error("Failed to start exam", error);
        } finally {
            setIsGeneratingFinal(false);
        }
    };

    return (
        <>
            <Navbar />
            {viewingLesson && (<LessonModal lesson={viewingLesson.data} courseId={course.id} lessonIndex={viewingLesson.index} onClose={() => setViewingLesson(null)} onComplete={handleSimulate} />)}

            <div className="min-h-screen bg-slate-950 text-white pt-24 pb-10 px-6 relative overflow-hidden">
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-neon-violet/5 rounded-full blur-[120px]" />
                </div>

                {/* Header */}
                <div className="max-w-3xl mx-auto mb-12 relative z-10">
                    <button onClick={() => navigate('/courses')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"><ArrowLeft className="w-5 h-5" /> العودة للمكتبة</button>
                    <div className={`glass p-8 rounded-3xl border flex flex-col md:flex-row justify-between items-center gap-6 ${hasCertificate ? 'border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.1)]' : 'border-white/10'}`}>
                        <div>
                            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                                {course.title}
                                {hasCertificate && <Award className="w-8 h-8 text-yellow-400 animate-bounce" />}
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="w-48 h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-1000 ease-out ${hasCertificate ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-neon-blue to-neon-violet'}`} style={{ width: `${progress}%` }} />
                                </div>
                                <span className={`font-mono ${hasCertificate ? 'text-yellow-400' : 'text-neon-blue'}`}>{Math.round(progress)}%</span>
                            </div>
                        </div>
                        {hasCertificate ? (
                            <div className="text-center px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                <span className="text-yellow-400 font-bold block">مكتمل بنجاح</span>
                                <span className="text-xs text-yellow-200/60">تم الاستحواذ على الشهادة</span>
                            </div>
                        ) : (
                            <div className="text-right hidden md:block">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">موعد النهاية المتوقع</p>
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10"><Calendar className="w-4 h-4 text-neon-violet" /><span className="font-mono text-sm">{course.schedule?.finalExamDate || 'غير محدد'}</span></div>
                            </div>
                        )}
                    </div>
                </div>

                <div ref={scrollRef} className="max-w-lg mx-auto relative min-h-[60vh] pb-32">
                    {/* SVG Line - يستخدم validRoadmap الآن لضمان عدم رسم خطوط فارغة */}
                    <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                        <path d={`M 0 0 ${validRoadmap.map((_, i) => `L ${i % 2 === 0 ? -80 : 80} ${i * 160 + 100}`).join(' ')} L 0 ${(validRoadmap.length) * 160 + 150}`} fill="none" stroke="#1e293b" strokeWidth="4" strokeDasharray="12 12" strokeLinecap="round" />
                        
                        {/* الخط الملون يتبع التقدم الفعلي */}
                        <path d={`M 0 0 ${validRoadmap.slice(0, validRoadmap.filter(n => n.status === 'completed').length + 1).map((_, i) => `L ${i % 2 === 0 ? -80 : 80} ${i * 160 + 100}`).join(' ')}`} fill="none" stroke={hasCertificate ? "url(#goldGradient)" : "url(#journeyGradient)"} strokeWidth="6" strokeLinecap="round" className={`drop-shadow-[0_0_15px_rgba(${hasCertificate ? '234,179,8' : '0,217,255'},0.5)] transition-all duration-1000 ease-in-out`} />
                        
                        <defs>
                            <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#00d9ff" /><stop offset="100%" stopColor="#a855f7" /></linearGradient>
                            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" /></linearGradient>
                        </defs>
                    </svg>

                    <div className="flex justify-center mb-24 relative z-10">
                        <div className={`bg-slate-900 border-2 px-8 py-3 rounded-full font-bold shadow-lg animate-float ${hasCertificate ? 'border-yellow-500 text-yellow-400 shadow-yellow-500/20' : 'border-neon-blue/50 text-neon-blue shadow-[0_0_30px_rgba(0,217,255,0.2)]'}`}>START 🚩</div>
                    </div>

                    {/* عرض العقد (Valid Nodes Only) */}
                    {validRoadmap.map((node, index) => {
                        const isLeft = index % 2 === 0;
                        const isActive = (node.status === 'unlocked' || node.status === 'current') && !hasCertificate;
                        const isCompleted = node.status === 'completed' || hasCertificate; 
                        const isLocked = node.status === 'locked' && !hasCertificate;

                        if (node.type === 'failed_exam') {
                            return (
                                <div key={index} ref={el => nodesRef.current[index] = el} className="journey-node flex items-center justify-center relative mb-32" style={{ transform: `translateX(${isLeft ? '-80px' : '80px'})` }}>
                                    <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'left-full ml-8 text-left' : 'right-full mr-8 text-right'} w-64`}>
                                        <div className="text-xs font-mono mb-2 px-2 py-1 rounded inline-block bg-red-500/20 text-red-400 border border-red-500/30">محاولة سابقة</div>
                                        <h4 className="font-bold text-lg leading-tight text-red-400">لم يتم الاجتياز</h4>
                                        <div className="text-xs text-gray-500 mt-1">تم تسجيل النتيجة: {node.score}%</div>
                                    </div>
                                    <div className="w-24 h-24 rounded-full border-[6px] border-red-500/30 bg-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)] relative z-10"><Trophy size={40} className="text-red-500 opacity-50" /><div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1"><AlertCircle size={16} className="text-white" /></div></div>
                                </div>
                            )
                        }

                        const lesson = node.lessonIndex !== undefined ? course.lessons[node.lessonIndex] : null;
                        if (!lesson) return null;

                        return (
                            <div key={index} ref={el => nodesRef.current[index] = el} className={`journey-node flex items-center justify-center relative mb-32 ${isActive ? 'node-active' : ''}`} style={{ transform: `translateX(${isLeft ? '-80px' : '80px'})` }}>
                                {/* تفاصيل الموعد والدرس */}
                                <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'left-full ml-8 text-left' : 'right-full mr-8 text-right'} w-64 transition-all duration-500 ${isActive || isCompleted ? 'opacity-100 translate-x-0' : 'opacity-50'}`}>
                                    <div className="flex items-center gap-2 mb-2 text-xs font-mono">
                                        <span className={`px-2 py-1 rounded border ${isActive ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/30' : hasCertificate ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' : 'text-gray-500 border-gray-800'}`}>
                                            {node.date}
                                        </span>
                                        <span className={`flex items-center gap-1 ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                            <Clock size={12} /> {node.time}
                                        </span>
                                    </div>
                                    <h4 className={`font-bold text-lg leading-tight mb-1 ${isActive ? 'text-white' : hasCertificate ? 'text-yellow-100' : 'text-gray-600'}`}>{lesson.title}</h4>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <MapPin size={12} /> درس {index + 1} • {lesson.duration}
                                    </div>
                                </div>

                                <div className="relative group">
                                    {isActive && <div className={`absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse ${node.type === 'remedial' ? 'bg-orange-500' : 'bg-neon-blue'}`} />}
                                    <button
                                        disabled={isLocked && !hasCertificate}
                                        onClick={() => (isActive || isCompleted) && setViewingLesson({ data: lesson, index: node.lessonIndex })}
                                        className={`
                                            w-24 h-24 rounded-full border-[6px] flex items-center justify-center transition-all duration-500 relative z-10 bg-slate-950
                                            ${isCompleted 
                                                ? (hasCertificate ? 'border-yellow-500 text-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]' : 'border-green-500 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]') 
                                                : isActive 
                                                    ? `${node.type === 'remedial' ? 'border-orange-500 text-white shadow-orange-500/40' : 'border-neon-blue text-white shadow-neon-blue/40'} scale-110` 
                                                    : 'border-slate-800 text-slate-700'
                                            }
                                        `}
                                    >
                                        {isCompleted ? ( <CheckCircle size={40} className="animate-bounce" /> ) : isLocked ? ( <Lock size={28} /> ) : ( <PlayCircle size={48} fill="white" className={node.type === 'remedial' ? 'text-orange-500' : 'text-blue-600'} /> )}
                                    </button>
                                    {isActive && !isCompleted && (
                                        <button onClick={(e) => { e.stopPropagation(); handleSimulate(course.id, node.lessonIndex); }} className="absolute -top-4 -right-4 w-10 h-10 bg-slate-800 border border-white/20 rounded-full flex items-center justify-center hover:bg-neon-violet hover:text-white hover:border-neon-violet transition-all z-20 shadow-xl hover:scale-110 group-hover:opacity-100 opacity-0 translate-y-2 group-hover:translate-y-0" title="تخطي سريع (محاكاة)">
                                            <FastForward size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {/* عقدة الكأس النهائي */}
                    <div className="flex flex-col items-center mt-12 relative z-10 journey-node">
                        <div className={`w-1 h-24 bg-gradient-to-b from-slate-800 to-transparent mb-6 ${isFinalUnlocked || hasCertificate ? (hasCertificate ? 'from-yellow-500' : 'from-neon-violet') : ''}`} />
                        
                        <button
                            onClick={() => (isFinalUnlocked || hasCertificate) && handleStartFinal()}
                            disabled={(!isFinalUnlocked && !hasCertificate) || isGeneratingFinal}
                            className={`
                                relative group w-44 h-44 rounded-[2rem] border-[6px] flex flex-col items-center justify-center gap-3 transition-all duration-500 bg-slate-950
                                ${hasCertificate 
                                    ? 'border-yellow-400 text-yellow-400 shadow-[0_0_100px_rgba(250,204,21,0.6)] scale-110' 
                                    : isFinalUnlocked
                                        ? 'border-neon-violet text-neon-violet shadow-[0_0_80px_rgba(168,85,247,0.4)] hover:scale-105 cursor-pointer'
                                        : 'border-slate-800 text-slate-700 grayscale cursor-not-allowed'
                                }
                                ${isGeneratingFinal ? 'cursor-wait opacity-80' : ''} 
                            `}
                        >
                            {(isFinalUnlocked || hasCertificate) && !isGeneratingFinal && <div className={`absolute inset-0 blur-3xl rounded-full animate-pulse ${hasCertificate ? 'bg-yellow-500/30' : 'bg-neon-violet/20'}`} />}
                            
                            {isGeneratingFinal ? (
                                <> <Loader size={48} className="animate-spin text-yellow-400" /> <span className="text-xs font-bold animate-pulse">جاري التوليد...</span> </>
                            ) : (
                                <>
                                    <Trophy size={72} strokeWidth={1.5} className={`${hasCertificate ? 'drop-shadow-[0_0_20px_rgba(250,204,21,1)] animate-pulse' : 'drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]'}`} />
                                    <span className={`text-xs font-black uppercase tracking-[0.2em] bg-slate-900 px-4 py-1.5 rounded-full border ${hasCertificate ? 'border-yellow-500 text-yellow-400' : 'border-current'}`}>
                                        {hasCertificate ? 'CERTIFIED' : 'Final Exam'}
                                    </span>
                                </>
                            )}
                            {!isFinalUnlocked && !hasCertificate && ( <div className="absolute -bottom-10 text-xs text-slate-500 flex items-center gap-1 font-mono"> <Lock size={10} /> Locked </div> )}
                        </button>
                        
                        {hasCertificate && (
                            <div className="mt-6 text-center animate-fade-in">
                                <p className="text-yellow-400 font-bold mb-2">🎉 مبروك! لقد أتممت هذا المسار</p>
                                <button onClick={() => navigate('/certificate')} className="text-sm underline text-gray-400 hover:text-white">عرض الشهادة مرة أخرى</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseJourneyPage