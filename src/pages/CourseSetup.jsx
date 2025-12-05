import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { Clock, Calendar, Zap, AlertTriangle, Loader, BookOpen } from 'lucide-react'
import Navbar from '../components/Navbar'
import useSimulationStore from '../store/simulationStore'

const CourseSetup = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { courses, generateCourseSchedule } = useSimulationStore()
    
    // جلب الـ ID من الـ State
    const courseId = location.state?.courseId
    // البحث عن الكورس
    const targetCourse = courses.find(c => c.id === courseId)

    const [dailyDesc, setDailyDesc] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const containerRef = useRef(null)

    // التحقق من صحة الكورس والتوجيه إذا كان غير موجود
    useEffect(() => {
        if (!courseId || !targetCourse) {
            console.warn("No course selected, redirecting to courses page.");
            navigate('/courses', { replace: true });
            return;
        }

        // أنيميشن الدخول (فقط إذا كان العنصر موجوداً)
        if (containerRef.current) {
            gsap.fromTo(containerRef.current, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            )
        }
    }, [courseId, targetCourse, navigate])

    const handleStart = async () => {
        if (!dailyDesc.trim()) return

        setIsLoading(true)
        
        if (targetCourse) {
            // توليد جدول لهذا الكورس
            await generateCourseSchedule(targetCourse.id, dailyDesc)
        }

        setIsLoading(false)
        navigate('/initializing', { state: { nextPath: `/lesson/${targetCourse?.id}_1_1` } })
    }

    // إذا لم يتم تحميل الكورس بعد (أو جاري التوجيه)، لا تعرض شيئاً لتجنب الأخطاء
    if (!targetCourse) return null;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6 flex items-center justify-center">
                <div ref={containerRef} className="max-w-2xl w-full opacity-0"> {/* نبدأ بـ opacity-0 لمنع الوميض */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-blue/10 text-neon-blue mb-4">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">
                            تخصيص مسار: {targetCourse.title}
                        </h1>
                        <p className="text-gray-400">
                            الذكاء الاصطناعي سيقوم بدمج <span className="text-white font-bold">{targetCourse.lessonsCount || 'الدروس'}</span> داخل جدولك اليومي بدقة.
                        </p>
                    </div>

                    <div className="glass rounded-3xl p-8 border border-white/10 space-y-8">
                        {/* معلومات الكورس */}
                        <div className="bg-white/5 p-4 rounded-xl flex items-center gap-4 border border-white/10">
                            <div className="p-3 bg-neon-violet/20 rounded-lg">
                                <BookOpen className="w-6 h-6 text-neon-violet" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">الكورس المختار</div>
                                <div className="font-bold">{targetCourse.title}</div>
                                <div className="text-xs text-gray-500 mt-1">{targetCourse.duration} • {targetCourse.difficulty}</div>
                            </div>
                        </div>

                        {/* وصف اليوم */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-neon-blue" />
                                كيف يبدو يومك؟ (أوقات العمل، الفراغ، النوم)
                            </label>
                            <textarea
                                value={dailyDesc}
                                onChange={(e) => setDailyDesc(e.target.value)}
                                placeholder="مثلاً: أعمل من 9 صباحاً لـ 5 مساءً، وأذهب للنادي من 6 لـ 8. أفضل المذاكرة في الليل بهدوء..."
                                className="w-full h-32 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-neon-blue focus:outline-none transition-colors resize-none leading-relaxed"
                            />
                            <p className="text-xs text-gray-500">
                                كلما كنت دقيقاً، كان الجدول أكثر واقعية وقابلية للتنفيذ.
                            </p>
                        </div>

                        {/* زر البدء */}
                        <button
                            onClick={handleStart}
                            disabled={!dailyDesc.trim() || isLoading}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                                !dailyDesc.trim() || isLoading
                                    ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-neon-blue to-neon-violet hover:scale-[1.02] shadow-lg shadow-neon-blue/20'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    جاري تحليل الروتين وبناء الجدول...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    بناء الجدول الذكي
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseSetup