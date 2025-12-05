import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ShieldAlert, Brain, Zap, Fingerprint } from 'lucide-react'

const ExamIntro = ({ onComplete }) => {
    const containerRef = useRef(null)

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: onComplete
        })

        const cards = containerRef.current.children

        // إخفاء الكل في البداية
        gsap.set(cards, { autoAlpha: 0, scale: 0.8, y: 100 })

        // 1. بطاقة الأمان
        tl.to(cards[0], { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" })
          .to(cards[0], { autoAlpha: 0, scale: 1.5, filter: 'blur(10px)', duration: 0.5, delay: 2.5 })

        // 2. بطاقة التحدي العقلي
        tl.to(cards[1], { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" })
          .to(cards[1], { autoAlpha: 0, scale: 0.5, y: -100, duration: 0.5, delay: 2.5 })

        // 3. بطاقة الدعم النفسي
        tl.to(cards[2], { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" })
          .to(cards[2], { autoAlpha: 0, x: 500, duration: 0.5, delay: 2.5 })

        // 4. الاستعداد
        tl.to(cards[3], { autoAlpha: 1, scale: 1, duration: 0.5 })
          .to(cards[3], { scale: 50, opacity: 0, duration: 1, ease: "power4.in", delay: 1 })

    }, [])

    return (
        <div ref={containerRef} className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
            
            {/* Card 1: Security */}
            <div className="absolute w-full max-w-lg p-10 bg-red-950/30 border border-red-500/50 rounded-3xl text-center backdrop-blur-xl">
                <ShieldAlert className="w-24 h-24 text-red-500 mx-auto mb-6 animate-pulse" />
                <h2 className="text-4xl font-bold text-red-500 mb-4">نظام مراقبة نشط</h2>
                <p className="text-xl text-red-200">
                    هذا الامتحان مراقب بالذكاء الاصطناعي.
                    <br/>
                    أي محاولة للخروج، تغيير التبويب، أو تصغير المتصفح سيتم رصدها فوراً.
                </p>
            </div>

            {/* Card 2: Cognitive Challenge */}
            <div className="absolute w-full max-w-lg p-10 bg-blue-950/30 border border-neon-blue/50 rounded-3xl text-center backdrop-blur-xl">
                <Brain className="w-24 h-24 text-neon-blue mx-auto mb-6 animate-bounce" />
                <h2 className="text-4xl font-bold text-neon-blue mb-4">عصر ذهني شامل</h2>
                <p className="text-xl text-blue-200">
                    الأسئلة ليست مجرد اختيار.
                    <br/>
                    سنختبر المنطق، الذاكرة، وسرعة اكتشاف الأخطاء.
                    استعد لاستخدام كامل طاقتك الذهنية.
                </p>
            </div>

            {/* Card 3: Support */}
            <div className="absolute w-full max-w-lg p-10 bg-purple-950/30 border border-neon-violet/50 rounded-3xl text-center backdrop-blur-xl">
                <Zap className="w-24 h-24 text-neon-violet mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-neon-violet mb-4">أنت مستعد!</h2>
                <p className="text-xl text-purple-200">
                    تنفس بعمق. لا تقلق من الأخطاء، فهي جزء من التحليل.
                    <br/>
                    ركز فقط على الحل. النظام يتكيف معك.
                </p>
            </div>

            {/* Card 4: GO */}
            <div className="absolute flex flex-col items-center">
                <Fingerprint className="w-40 h-40 text-white animate-pulse mb-4" />
                <h1 className="text-8xl font-black text-white tracking-widest">START</h1>
            </div>
        </div>
    )
}

export default ExamIntro