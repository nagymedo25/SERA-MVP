import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { 
    X, Calendar, CheckCircle, Lock, PlayCircle, 
    Clock, FastForward, Trophy, ArrowLeft 
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Navbar from '../components/Navbar'
import useSimulationStore from '../store/simulationStore'

// --- مكون نافذة الدرس (مدمج هنا للسهولة) ---
const LessonModal = ({ lesson, courseId, lessonIndex, onClose, onComplete }) => {
    const [isCompleting, setIsCompleting] = useState(false);

    const handleComplete = () => {
        setIsCompleting(true);
        setTimeout(() => {
            onComplete(courseId, lessonIndex);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in">
            <div className="glass w-full max-w-4xl h-[85vh] rounded-3xl border border-white/10 flex flex-col overflow-hidden relative shadow-2xl transform scale-100 transition-all">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h3 className="text-neon-blue text-sm font-bold uppercase tracking-wider mb-1">درس تعليمي</h3>
                        <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400 hover:text-white" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
                    <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                        <ReactMarkdown>
                            {lesson.content || lesson.description || "محتوى الدرس..."}
                        </ReactMarkdown>
                    </div>
                </div>
                <div className="p-6 border-t border-white/10 bg-slate-900/80 backdrop-blur flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration || '15m'}</span>
                    </div>
                    <button 
                        onClick={handleComplete}
                        disabled={isCompleting}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-all font-bold text-white shadow-lg shadow-green-500/20 flex items-center gap-2"
                    >
                        {isCompleting ? 'جاري الحفظ...' : <>إتمام الدرس والمتابعة <CheckCircle className="w-5 h-5" /></>}
                    </button>
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
    const scrollRef = useRef(null)
    const nodesRef = useRef([]) // مصفوفة لحفظ مراجع العناصر (Nodes)

    // لتتبع التغييرات وتشغيل الأنيميشن
    const prevCompletedCount = useRef(0)

    // التأكد من وجود الكورس
    useEffect(() => {
        if (!course) navigate('/courses')
    }, [course, navigate])

    const roadmap = course?.schedule?.roadmap || []
    const completedCount = roadmap.filter(n => n.status === 'completed').length

    // --- أنيميشن الدخول الأولي ---
    useEffect(() => {
        gsap.fromTo('.journey-node', 
            { scale: 0, opacity: 0, y: 20 }, 
            { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' }
        );
        
        // التمرير لأول درس نشط
        setTimeout(() => {
            const activeNode = document.querySelector('.node-active');
            if (activeNode) activeNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);

        prevCompletedCount.current = completedCount;
    }, []);

    // --- أنيميشن عند إكمال درس جديد (السحر هنا) ---
    useEffect(() => {
        if (completedCount > prevCompletedCount.current) {
            // تم إكمال درس جديد! لنقم بتشغيل الاحتفال
            const justFinishedIndex = completedCount - 1; // آخر واحد اكتمل
            const nextIndex = completedCount; // الدرس الذي فُتح للتو

            const tl = gsap.timeline();

            // 1. احتفال الدرس المكتمل (نبضة خضراء)
            if (nodesRef.current[justFinishedIndex]) {
                tl.to(nodesRef.current[justFinishedIndex], { 
                    scale: 1.2, 
                    borderColor: '#22c55e', // green
                    boxShadow: '0 0 30px rgba(34,197,94,0.6)',
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            }

            // 2. تحرك الخط المضيء (Path) - محاكاة بصرية
            // (يتم تحديث الـ SVG تلقائياً عبر الـ State، لكن يمكننا إضافة تأثير وميض)
            
            // 3. فتح الدرس التالي (Pop effect)
            if (nodesRef.current[nextIndex]) {
                tl.fromTo(nodesRef.current[nextIndex], 
                    { scale: 1, borderColor: '#334155' },
                    { 
                        scale: 1.3, 
                        borderColor: '#00d9ff', // neon blue
                        boxShadow: '0 0 50px rgba(0,217,255,0.8)',
                        duration: 0.6, 
                        ease: 'elastic.out(1, 0.5)' 
                    },
                    "-=0.2"
                );
                tl.to(nodesRef.current[nextIndex], { scale: 1.1, duration: 0.4 }); // استقرار على حجم أكبر قليلاً
                
                // تمرير الشاشة للدرس الجديد
                setTimeout(() => {
                    nodesRef.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 800);
            }

            prevCompletedCount.current = completedCount;
        }
    }, [completedCount]);

    if (!course) return null;

    const progress = (completedCount / roadmap.length) * 100;
    const isFinalUnlocked = completedCount === roadmap.length;

    const handleSimulate = (cId, lIdx) => {
        simulateCompleteLesson(cId, lIdx);
    };

    const handleStartFinal = async () => {
        await startFinalExam(course.id);
        navigate('/assessment?mode=final');
    };

    return (
        <>
            <Navbar />
            
            {/* الدرس المنبثق */}
            {viewingLesson && (
                <LessonModal 
                    lesson={viewingLesson.data}
                    courseId={course.id}
                    lessonIndex={viewingLesson.index}
                    onClose={() => setViewingLesson(null)}
                    onComplete={handleSimulate}
                />
            )}

            <div className="min-h-screen bg-slate-950 text-white pt-24 pb-10 px-6 relative overflow-hidden">
                
                {/* خلفية جمالية */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-neon-violet/5 rounded-full blur-[120px]" />
                </div>

                {/* الهيدر */}
                <div className="max-w-3xl mx-auto mb-12 relative z-10">
                    <button onClick={() => navigate('/courses')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-5 h-5" /> العودة للمكتبة
                    </button>
                    
                    <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                            <div className="flex items-center gap-3">
                                <div className="w-48 h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-neon-blue to-neon-violet transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                                </div>
                                <span className="font-mono text-neon-blue">{Math.round(progress)}%</span>
                            </div>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">الخطة الزمنية</p>
                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                                <Calendar className="w-4 h-4 text-neon-violet" />
                                <span className="font-mono text-sm">{course.schedule?.finalExamDate || 'غير محدد'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* الخريطة */}
                <div ref={scrollRef} className="max-w-lg mx-auto relative min-h-[60vh] pb-32">
                    
                    {/* خط المسار المتصل */}
                    <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                        {/* المسار الرمادي (الخلفية) */}
                        <path 
                            d={`M 0 0 ${roadmap.map((_, i) => `L ${i % 2 === 0 ? -80 : 80} ${i * 160 + 100}`).join(' ')} L 0 ${(roadmap.length) * 160 + 150}`}
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="4"
                            strokeDasharray="12 12"
                            strokeLinecap="round"
                        />
                        {/* المسار الملون (المكتمل) */}
                        <path 
                            d={`M 0 0 ${roadmap.slice(0, completedCount + 1).map((_, i) => `L ${i % 2 === 0 ? -80 : 80} ${i * 160 + 100}`).join(' ')}`}
                            fill="none"
                            stroke="url(#journeyGradient)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_15px_rgba(0,217,255,0.5)] transition-all duration-1000 ease-in-out"
                        />
                        <defs>
                            <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#00d9ff" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* نقطة البداية */}
                    <div className="flex justify-center mb-24 relative z-10">
                        <div className="bg-slate-900 border-2 border-neon-blue/50 text-neon-blue px-8 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(0,217,255,0.2)] animate-float">
                            START 🚩
                        </div>
                    </div>

                    {/* العقد (Nodes) */}
                    {roadmap.map((node, index) => {
                        const lesson = course.lessons[node.lessonIndex];
                        const isLeft = index % 2 === 0;
                        const isActive = node.status === 'unlocked' || node.status === 'current';
                        const isCompleted = node.status === 'completed';
                        const isLocked = node.status === 'locked' || !node.status;

                        return (
                            <div 
                                key={index}
                                ref={el => nodesRef.current[index] = el} // ربط المرجع للأنيميشن
                                className={`journey-node flex items-center justify-center relative mb-32 ${isActive ? 'node-active' : ''}`}
                                style={{ transform: `translateX(${isLeft ? '-80px' : '80px'})` }}
                            >
                                {/* بطاقة المعلومات الجانبية */}
                                <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'left-full ml-8 text-left' : 'right-full mr-8 text-right'} w-56 transition-all duration-500 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-50'}`}>
                                    <div className={`text-xs font-mono mb-2 px-2 py-1 rounded inline-block ${isActive ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30' : 'text-gray-600 border border-gray-800'}`}>
                                        {node.date}
                                    </div>
                                    <h4 className={`font-bold text-lg leading-tight ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                        {lesson.title}
                                    </h4>
                                    <div className="text-xs text-gray-500 mt-1">{lesson.duration}</div>
                                </div>

                                {/* الدائرة الرئيسية */}
                                <div className="relative group">
                                    {/* هالة مضيئة للعنصر النشط */}
                                    {isActive && <div className="absolute inset-0 bg-neon-blue rounded-full blur-xl opacity-50 animate-pulse" />}
                                    
                                    <button
                                        disabled={isLocked}
                                        onClick={() => !isLocked && setViewingLesson({ data: lesson, index: node.lessonIndex })}
                                        className={`
                                            w-24 h-24 rounded-full border-[6px] flex items-center justify-center transition-all duration-500 relative z-10 bg-slate-950
                                            ${isCompleted 
                                                ? 'border-green-500 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
                                                : isActive 
                                                    ? 'border-neon-blue text-white shadow-[0_0_50px_rgba(0,217,255,0.4)] scale-110' 
                                                    : 'border-slate-800 text-slate-700'
                                            }
                                        `}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle size={40} className="animate-bounce" />
                                        ) : isLocked ? (
                                            <Lock size={28} />
                                        ) : (
                                            <PlayCircle size={48} fill="white" className="text-blue-600" />
                                        )}
                                    </button>

                                    {/* زر التجاوز السريع (يظهر فقط عند التحويم على النشط) */}
                                    {isActive && !isCompleted && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSimulate(course.id, node.lessonIndex);
                                            }}
                                            className="absolute -top-4 -right-4 w-10 h-10 bg-slate-800 border border-white/20 rounded-full flex items-center justify-center hover:bg-neon-violet hover:text-white hover:border-neon-violet transition-all z-20 shadow-xl hover:scale-110 group-hover:opacity-100 opacity-0 translate-y-2 group-hover:translate-y-0"
                                            title="تخطي سريع (محاكاة)"
                                        >
                                            <FastForward size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {/* عقدة النهاية (الكأس) */}
                    <div className="flex flex-col items-center mt-12 relative z-10 journey-node">
                        <div className={`w-1 h-24 bg-gradient-to-b from-slate-800 to-transparent mb-6 ${isFinalUnlocked ? 'from-neon-violet' : ''}`} />
                        
                        <button
                            onClick={() => isFinalUnlocked && handleStartFinal()}
                            disabled={!isFinalUnlocked}
                            className={`
                                relative group w-40 h-40 rounded-3xl border-[6px] flex flex-col items-center justify-center gap-3 transition-all duration-500 bg-slate-950
                                ${isFinalUnlocked
                                    ? 'border-yellow-400 text-yellow-400 shadow-[0_0_80px_rgba(250,204,21,0.4)] scale-110 rotate-3 hover:rotate-0'
                                    : 'border-slate-800 text-slate-700 grayscale'
                                }
                            `}
                        >
                            {isFinalUnlocked && <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full animate-pulse" />}
                            
                            <Trophy size={64} strokeWidth={1.5} className={isFinalUnlocked ? 'drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]' : ''} />
                            
                            <span className="text-xs font-black uppercase tracking-[0.3em] bg-slate-900 px-3 py-1 rounded-full border border-current">
                                Final Exam
                            </span>
                            
                            {!isFinalUnlocked && (
                                <div className="absolute -bottom-8 text-xs text-slate-500 flex items-center gap-1 font-mono">
                                    <Lock size={10} /> Locked
                                </div>
                            )}
                        </button>
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default CourseJourneyPage