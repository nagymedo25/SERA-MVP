import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

const MindprintScanner = ({ onComplete, stage = 'psychological' }) => {
    const scannerRef = useRef(null)
    const textRef = useRef(null)
    const waveRef = useRef(null)

    const stageMessages = {
        psychological: [
            'بدء النظام...',
            'جاري مسح الأنماط السلوكية...',
            'تحليل الاستجابات النفسية...',
            'توليد الخريطة الذهنية...',
            'تم إنشاء Mindprint بنجاح! ✨',
        ],
        technical: [
            'تهيئة محلل الكود...',
            'فحص المهارات التقنية...',
            'قياس سرعة حل المشكلات...',
            'بناء الجينوم البرمجي...',
            'Coding Genome جاهز! 🧬',
        ],
        trajectory: [
            'تحليل الأهداف...',
            'رسم المسار المستقبلي...',
            'توليد التوصيات...',
            'بناء خريطة الطريق...',
            'Life Trajectory مكتمل! 🚀',
        ],
    }

    useEffect(() => {
        const tl = gsap.timeline({ onComplete })
        const messages = stageMessages[stage]

        // Scanner bar animation
        tl.to(scannerRef.current, {
            width: '100%',
            duration: 4,
            ease: 'power2.inOut',
        })

        // Text transitions
        messages.forEach((message, index) => {
            tl.to(
                textRef.current,
                {
                    opacity: 0,
                    duration: 0.3,
                },
                index * 0.9
            ).call(() => {
                if (textRef.current) {
                    textRef.current.textContent = message
                }
            }).to(textRef.current, {
                opacity: 1,
                duration: 0.3,
            })
        })

        // Brain wave effect
        if (waveRef.current) {
            tl.to(
                waveRef.current,
                {
                    scaleY: 1.5,
                    duration: 0.5,
                    repeat: 5,
                    yoyo: true,
                    ease: 'power1.inOut',
                },
                1
            )
        }

        return () => tl.kill()
    }, [stage, onComplete])

    return (
        <div className="w-full h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 gradient-orb-1 animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 gradient-orb-2 animate-float" style={{ animationDelay: '1s' }} />
            </div>

            {/* Main Scanner */}
            <div className="relative z-10 max-w-2xl w-full px-8 space-y-8">
                {/* Brain Wave Visualization */}
                <div className="flex justify-center mb-12">
                    <svg width="200" height="100" viewBox="0 0 200 100" className="opacity-60">
                        <path
                            ref={waveRef}
                            d="M0,50 Q25,25 50,50 T100,50 T150,50 T200,50"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="2"
                            className="transform origin-center"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="50%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Scanner Bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative">
                    <div
                        ref={scannerRef}
                        className="h-full bg-gradient-to-r from-neon-blue via-neon-violet to-neon-pink w-0 rounded-full relative"
                        style={{
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.4)',
                        }}
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-white/30 blur-sm rounded-full" />
                    </div>
                </div>

                {/* Status Text */}
                <div className="text-center space-y-4">
                    <p
                        ref={textRef}
                        className="text-2xl text-white font-mono tracking-wide"
                    >
                        بدء النظام...
                    </p>
                    <div className="flex justify-center gap-2">
                        <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-neon-violet rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MindprintScanner
