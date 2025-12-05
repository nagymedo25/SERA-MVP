import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Clock, Calendar, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'

const CourseSetup = () => {
    const navigate = useNavigate()
    const [hours, setHours] = useState(30)
    const [days, setDays] = useState(7)
    const [dailyDesc, setDailyDesc] = useState('')
    const [status, setStatus] = useState('neutral') // neutral, valid, invalid
    const [message, setMessage] = useState('')
    
    const containerRef = useRef(null)

    // حساب الكثافة اليومية
    const dailyLoad = (hours / days).toFixed(1)

    useEffect(() => {
        // أنيميشن دخول الصفحة
        gsap.fromTo(containerRef.current, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        )
    }, [])

    const validatePlan = () => {
        if (dailyLoad > 12) {
            setStatus('invalid')
            setMessage('مستحيل! لا يمكنك الدراسة أكثر من 12 ساعة يومياً بتركيز. زد عدد الأيام.')
            // اهتزاز للتحذير
            gsap.to('.status-box', { x: 5, duration: 0.1, yoyo: true, repeat: 3 })
        } else if (dailyLoad > 6) {
            setStatus('valid')
            setMessage('خطة مكثفة جداً (Hardcore). هل أنت مستعد للتحدي؟ 🔥')
        } else if (dailyLoad < 1) {
            setStatus('valid')
            setMessage('خطة مريحة جداً. ممتاز للاستمرارية. 🌱')
        } else {
            setStatus('valid')
            setMessage('خطة متوازنة وواقعية. 🚀')
        }
    }

    // التحقق عند تغيير القيم
    useEffect(() => {
        validatePlan()
    }, [hours, days])

    const handleStart = () => {
        if (status === 'valid') {
            navigate('/initializing')
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6 flex items-center justify-center">
                <div ref={containerRef} className="max-w-2xl w-full">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold mb-4">صمم مسارك التعليمي 🛠️</h1>
                        <p className="text-gray-400">الذكاء الاصطناعي سيقوم بجدولة الدروس بناءً على وقتك.</p>
                    </div>

                    <div className="glass rounded-3xl p-8 border border-white/10 space-y-8">
                        {/* وصف اليوم */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-300">صف يومك باختصار (متى تكون متفرغاً؟)</label>
                            <textarea
                                value={dailyDesc}
                                onChange={(e) => setDailyDesc(e.target.value)}
                                placeholder="مثلاً: أعمل من 9 لـ 5، ومتفرغ بعد الساعة 7 مساءً..."
                                className="w-full h-24 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-neon-blue focus:outline-none transition-colors resize-none"
                            />
                        </div>

                        {/* المدخلات: الساعات والأيام */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <label className="flex items-center gap-2 text-sm font-semibold">
                                        <Clock className="w-4 h-4 text-neon-blue" />
                                        ساعات الكورس
                                    </label>
                                    <span className="text-neon-blue font-mono">{hours} ساعة</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    step="5"
                                    value={hours}
                                    onChange={(e) => setHours(Number(e.target.value))}
                                    className="w-full accent-neon-blue h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <label className="flex items-center gap-2 text-sm font-semibold">
                                        <Calendar className="w-4 h-4 text-neon-violet" />
                                        المدة المتاحة
                                    </label>
                                    <span className="text-neon-violet font-mono">{days} يوم</span>
                                </div>
                                <input
                                    type="range"
                                    min="3"
                                    max="60"
                                    value={days}
                                    onChange={(e) => setDays(Number(e.target.value))}
                                    className="w-full accent-neon-violet h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* حالة الخطة */}
                        <div className={`status-box p-4 rounded-xl border transition-all duration-300 ${
                            status === 'invalid' 
                                ? 'bg-red-500/10 border-red-500/50 text-red-400' 
                                : 'bg-green-500/10 border-green-500/50 text-green-400'
                        }`}>
                            <div className="flex items-start gap-3">
                                {status === 'invalid' ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <Zap className="w-5 h-5 shrink-0" />}
                                <div>
                                    <div className="font-bold mb-1">
                                        المعدل اليومي: {dailyLoad} ساعة/يوم
                                    </div>
                                    <p className="text-sm opacity-90">{message}</p>
                                </div>
                            </div>
                        </div>

                        {/* زر البدء */}
                        <button
                            onClick={handleStart}
                            disabled={status === 'invalid'}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                                status === 'invalid'
                                    ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-neon-blue to-neon-violet hover:scale-[1.02] shadow-lg shadow-neon-blue/20'
                            }`}
                        >
                            {status === 'invalid' ? 'الخطة غير منطقية' : 'بناء المنهج (Initialize)'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseSetup