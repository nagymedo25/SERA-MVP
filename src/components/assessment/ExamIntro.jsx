import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { Shield, Cpu, Zap, Activity, CheckCircle, Lock } from 'lucide-react'

// تسجيل البلاجن لضمان عمل تأثيرات النصوص
gsap.registerPlugin(TextPlugin)

const ExamIntro = ({ onComplete }) => {
    const containerRef = useRef(null)
    const [currentText, setCurrentText] = useState("")
    const [subText, setSubText] = useState("")
    
    // المراحل
    const phases = [
        {
            main: "SECURITY HANDSHAKE",
            sub: "ENCRYPTING CONNECTION...",
            icon: Lock,
            color: "text-red-500",
            ringColor: "border-red-500/30",
            glow: "shadow-red-500/50"
        },
        {
            main: "SYSTEM CALIBRATION",
            sub: "OPTIMIZING NEURAL ENGINE...",
            icon: Cpu,
            color: "text-blue-400",
            ringColor: "border-blue-400/30",
            glow: "shadow-blue-400/50"
        },
        {
            main: "FINAL SYNCHRONIZATION",
            sub: "READY FOR INJECTION...",
            icon: Zap,
            color: "text-yellow-400",
            ringColor: "border-yellow-400/30",
            glow: "shadow-yellow-400/50"
        }
    ]

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline()

            // 1. إعداد المسرح
            gsap.set(".warp-ring", { scale: 0.5, opacity: 0, z: -500 })
            gsap.set(".hud-container", { scale: 0.9, opacity: 0 })
            gsap.set(".flash-overlay", { opacity: 0 })
            gsap.set(".final-start", { scale: 0, opacity: 0 })

            // 2. ظهور الـ HUD
            tl.to(".hud-container", { 
                scale: 1, 
                opacity: 1, 
                duration: 0.8, 
                ease: "back.out(1.7)" 
            })

            // 3. حلقة المراحل
            phases.forEach((phase, i) => {
                // تغيير الألوان والنصوص
                tl.call(() => {
                    setCurrentText(phase.main)
                    setSubText(phase.sub)
                    
                    // تحريك الحلقات الخلفية (تأثير النفق)
                    gsap.fromTo(`.ring-${i}`, 
                        { scale: 0.2, opacity: 0 },
                        { scale: 3, opacity: 0, duration: 2, ease: "power1.in" }
                    )
                })

                // تأثير الكتابة (Scramble)
                tl.to(".main-text", {
                    duration: 0.5,
                    text: { value: phase.main, delimiter: "" },
                    ease: "none"
                })
                
                // ظهور الأيقونة
                tl.fromTo(`.icon-${i}`,
                    { scale: 0, rotation: 180 },
                    { scale: 1, rotation: 0, duration: 0.4, ease: "back.out" },
                    "<"
                )

                // ملء شريط الطاقة الدائري
                tl.to(".energy-fill", {
                    strokeDashoffset: 100 - ((i + 1) * 33), // يمتلئ تدريجياً
                    duration: 1.5,
                    ease: "power2.inOut"
                })

                // خروج الأيقونة القديمة
                tl.to(`.icon-${i}`, { 
                    scale: 0, 
                    opacity: 0, 
                    duration: 0.3, 
                    delay: 0.5 
                })
            })

            // =========================================
            // 💥 مرحلة الانفجار (THE BIG BANG) 💥
            // =========================================
            
            // 1. إخفاء الـ HUD القديم
            tl.to(".hud-content", { opacity: 0, duration: 0.2 })
            
            // 2. ظهور زر START العملاق
            tl.to(".final-start", {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            })

            // 3. شحن الطاقة (اهتزاز)
            tl.to(".final-start", {
                scale: 1.1,
                textShadow: "0 0 50px white",
                duration: 1,
                yoyo: true,
                repeat: 2,
                onStart: () => {
                    // اهتزاز الشاشة بالكامل
                    gsap.to(containerRef.current, {
                        x: "random(-5, 5)",
                        y: "random(-5, 5)",
                        duration: 0.05,
                        repeat: 20
                    })
                }
            })

            // 4. الانفجار وتوسيع الدائرة
            tl.to(".shockwave", {
                scale: 50,
                opacity: 1,
                borderWidth: "2px",
                duration: 0.4,
                ease: "power4.in",
                backgroundColor: "#fff" // يتحول للأبيض الساطع
            })

            // 5. الوميض الأبيض النهائي
            tl.to(".flash-overlay", {
                opacity: 1,
                duration: 0.1,
                onComplete: onComplete
            }, "-=0.1")

        }, containerRef)

        return () => ctx.revert()
    }, [onComplete])

    return (
        <div ref={containerRef} className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans cursor-none">
            
            {/* الخلفية: النفق الشبكي */}
            <div className="absolute inset-0 pointer-events-none perspective-1000">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.2)_0%,black_100%)]" />
                
                {/* الحلقات المتحركة (Warp Rings) */}
                {[0, 1, 2].map(i => (
                    <div key={i} className={`ring-${i} warp-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full border border-slate-700/30 shadow-[0_0_50px_rgba(0,255,255,0.1)]`} />
                ))}
            </div>

            {/* الوميض الأبيض للانفجار */}
            <div className="flash-overlay absolute inset-0 bg-white pointer-events-none z-[100]" />

            {/* واجهة العرض المركزية (HUD) */}
            <div className="hud-container relative z-10 w-96 h-96 flex items-center justify-center">
                
                {/* 1. الدائرة الخلفية الدوارة */}
                <div className="absolute inset-0 rounded-full border border-slate-800 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-dashed border-slate-800 animate-[spin_15s_linear_infinite_reverse]" />

                {/* 2. شريط الطاقة الدائري (SVG) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#1e293b" strokeWidth="4" />
                    <circle 
                        className="energy-fill"
                        cx="50%" cy="50%" r="48%" 
                        fill="none" 
                        stroke="#00d9ff" 
                        strokeWidth="4"
                        strokeDasharray="300" // تقريبي
                        strokeDashoffset="300" // يبدأ فارغ
                        strokeLinecap="round"
                    />
                </svg>

                {/* 3. المحتوى الداخلي */}
                <div className="hud-content flex flex-col items-center justify-center text-center relative z-20">
                    
                    {/* منطقة الأيقونات المتغيرة */}
                    <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                        {phases.map((phase, i) => {
                            const Icon = phase.icon
                            return (
                                <div key={i} className={`icon-${i} absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-full border ${phase.ringColor} backdrop-blur-sm ${phase.glow} shadow-2xl`}>
                                    <Icon className={`w-12 h-12 ${phase.color}`} />
                                </div>
                            )
                        })}
                    </div>

                    {/* النصوص */}
                    <div className="space-y-2 h-20">
                        <h2 className="main-text text-2xl font-bold text-white tracking-widest font-mono">
                            {/* GSAP TextPlugin fills this */}
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 opacity-80">
                            <Activity className="w-3 h-3 animate-pulse" />
                            <span>{subText}</span>
                        </div>
                    </div>
                </div>

                {/* 4. عنصر الانفجار المركزي (START) */}
                <div className="final-start absolute inset-0 flex items-center justify-center z-30">
                    {/* كرة الطاقة التي ستتوسع (Shockwave) */}
                    <div className="shockwave absolute w-full h-full rounded-full bg-white/10 border-4 border-white scale-0 opacity-0" />
                    
                    <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] select-none">
                        START
                    </h1>
                </div>

            </div>

            {/* ديكورات جانبية */}
            <div className="absolute bottom-10 left-10 flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 h-4 bg-slate-800 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
            </div>
            <div className="absolute top-10 right-10 font-mono text-xs text-slate-600">
                SYS_READY: TRUE
            </div>

        </div>
    )
}

export default ExamIntro