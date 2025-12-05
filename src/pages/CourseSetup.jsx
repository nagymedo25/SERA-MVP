import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { Clock, Calendar, Zap, AlertTriangle, Loader, BookOpen, AlertOctagon } from 'lucide-react'
import Navbar from '../components/Navbar'
import useSimulationStore from '../store/simulationStore'

const CourseSetup = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { courses, generateCourseSchedule } = useSimulationStore()

    const courseId = location.state?.courseId
    const targetCourse = courses.find(c => c.id === courseId)

    const [hours, setHours] = useState(20)
    const [days, setDays] = useState(7)
    const [dailyDesc, setDailyDesc] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [planStatus, setPlanStatus] = useState({ valid: true, message: '', intensity: 0 })

    const containerRef = useRef(null)

    useEffect(() => {
        if (!targetCourse && !location.state?.isGeneral) {
            navigate('/courses')
        }
        gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 })
    }, [targetCourse, navigate])

    // --- التحقق من المنطق (Logic Validation) ---
    useEffect(() => {
        const dailyHours = hours / days;

        if (dailyHours > 16) {
            setPlanStatus({
                valid: false,
                message: 'مستحيل بيولوجياً! لا يوجد بشر يستطيع الدراسة والتركيز لهذه المدة يومياً.',
                color: 'text-red-500 bg-red-500/10 border-red-500/50'
            });
        } else if (dailyHours > 8) {
            setPlanStatus({
                valid: true,
                message: 'تحذير: هذا الجدول "انتحاري". يتطلب تفرغاً تاماً وقوة ذهنية هائلة.',
                intensity: 'Extreme',
                color: 'text-orange-400 bg-orange-500/10 border-orange-500/50'
            });
        } else if (dailyHours > 4) {
            setPlanStatus({
                valid: true,
                message: 'خطة مكثفة (Hardcore). ممتازة للمحترفين المتفرغين.',
                intensity: 'High',
                color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/50'
            });
        } else {
            setPlanStatus({
                valid: true,
                message: 'خطة متوازنة ومثالية للاستمرارية والتعلم العميق.',
                intensity: 'Balanced',
                color: 'text-green-400 bg-green-500/10 border-green-500/50'
            });
        }
    }, [hours, days]);

    const handleStart = async () => {
        if (!planStatus.valid || !dailyDesc.trim()) return

        setIsLoading(true)

        // دمج البيانات لإرسالها للـ AI
        const fullRoutine = `
            User Routine: ${dailyDesc}.
            Constraints: Must finish ${hours} hours of content in ${days} days.
            Daily Intensity: ${planStatus.intensity}.
        `;

        if (targetCourse) {
            await generateCourseSchedule(targetCourse.id, fullRoutine)
        }

        setIsLoading(false)
        // التوجيه لصفحة التهيئة، ومنها للكورسات لفتح الخريطة مباشرة
        navigate('/initializing', { state: { nextPath: `/journey/${targetCourse?.id}` } })
    }

    if (!targetCourse) return null;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6 flex items-center justify-center">
                <div ref={containerRef} className="max-w-2xl w-full">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold mb-4">ضبط إيقاع الرحلة ⏱️</h1>
                        <p className="text-gray-400">دع الذكاء الاصطناعي يوزع الجهد بناءً على قدرتك.</p>
                    </div>

                    <div className="glass rounded-3xl p-8 border border-white/10 space-y-8">
                        {/* Sliders */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <label className="flex items-center gap-2 text-sm font-semibold">
                                        <BookOpen className="w-4 h-4 text-neon-blue" /> حجم المحتوى
                                    </label>
                                    <span className="text-neon-blue font-mono">{hours} ساعة</span>
                                </div>
                                <input type="range" min="5" max="100" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-neon-blue h-2 bg-slate-800 rounded-lg cursor-pointer" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <label className="flex items-center gap-2 text-sm font-semibold">
                                        <Calendar className="w-4 h-4 text-neon-violet" /> المدة المستهدفة
                                    </label>
                                    <span className="text-neon-violet font-mono">{days} يوم</span>
                                </div>
                                <input type="range" min="1" max="90" value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full accent-neon-violet h-2 bg-slate-800 rounded-lg cursor-pointer" />
                            </div>
                        </div>

                        {/* Status Box */}
                        <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all duration-500 ${planStatus.color}`}>
                            {planStatus.valid ? <Zap className="w-5 h-5 mt-1" /> : <AlertOctagon className="w-5 h-5 mt-1" />}
                            <div>
                                <p className="font-bold text-sm mb-1">المعدل اليومي: {(hours / days).toFixed(1)} ساعة/يوم</p>
                                <p className="text-sm opacity-90">{planStatus.message}</p>
                            </div>
                        </div>

                        {/* Routine Description */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-300">روتينك اليومي (لضبط المواعيد بدقة)</label>
                            <textarea
                                value={dailyDesc}
                                onChange={(e) => setDailyDesc(e.target.value)}
                                placeholder="أعمل حتى الـ 4 مساءً، وأفضل المذاكرة بعد العشاء..."
                                className="w-full h-24 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-neon-blue focus:outline-none resize-none"
                            />
                        </div>

                        <button
                            onClick={handleStart}
                            disabled={!planStatus.valid || !dailyDesc.trim() || isLoading}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${!planStatus.valid || !dailyDesc.trim()
                                    ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-neon-blue to-neon-violet hover:scale-[1.02] shadow-lg shadow-neon-blue/20'
                                }`}
                        >
                            {isLoading ? <><Loader className="animate-spin" /> جاري بناء الجدول...</> : 'إطلاق المسار 🚀'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseSetup