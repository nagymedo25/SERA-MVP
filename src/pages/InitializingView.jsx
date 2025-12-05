import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Cpu, Database, Layout, Calendar } from 'lucide-react'

const InitializingView = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const textRef = useRef(null)
    const barRef = useRef(null)

    const steps = [
        { text: "تحليل نمطك اليومي...", icon: Calendar },
        { text: "تفكيك الكورس إلى وحدات مصغرة...", icon: Layout },
        { text: "مزامنة التوقيت مع ساعات ذروة تركيزك...", icon: Database },
        { text: "بناء الجدول الزمني الذكي...", icon: Cpu },
        { text: "تم الانتهاء! 🚀", icon: null }
    ]

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                setTimeout(() => navigate('/courses'), 500) // التوجيه لصفحة الكورسات بعد الانتهاء
            }
        })

        // أنيميشن شريط التقدم الكلي
        tl.to(barRef.current, {
            width: '100%',
            duration: 6, // مدة العملية كاملة
            ease: 'power1.inOut'
        })

        // تغيير النصوص بناءً على الوقت
        steps.forEach((step, index) => {
            const stepTime = 6 / steps.length
            
            tl.call(() => {
                setCurrentStep(index)
                // أنيميشن للنص عند التغيير
                gsap.fromTo(textRef.current, 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.3 }
                )
            }, null, index * stepTime)
        })

    }, [])

    const CurrentIcon = steps[currentStep]?.icon

    return (
        <div className="h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* خلفية تقنية */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-blue/20 via-transparent to-transparent animate-pulse-slow" />
            </div>

            <div className="z-10 w-full max-w-md text-center space-y-8">
                {/* الأيقونة المتغيرة */}
                <div className="h-20 flex items-center justify-center mb-8">
                    {CurrentIcon && (
                        <div className="relative">
                            <div className="absolute inset-0 bg-neon-blue blur-xl opacity-50 animate-pulse" />
                            <CurrentIcon className="w-16 h-16 text-white relative z-10" />
                        </div>
                    )}
                </div>

                {/* النص المتغير */}
                <div className="h-16 flex items-center justify-center">
                    <h2 ref={textRef} className="text-2xl md:text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet">
                        {steps[currentStep].text}
                    </h2>
                </div>

                {/* شريط التقدم */}
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative">
                    <div 
                        ref={barRef}
                        className="h-full bg-gradient-to-r from-neon-blue via-neon-violet to-white w-0 shadow-[0_0_15px_rgba(0,217,255,0.8)]"
                    />
                </div>

                <p className="text-xs text-gray-500 font-mono mt-4">
                    AI SYSTEM INITIALIZING...
                </p>
            </div>
        </div>
    )
}

export default InitializingView