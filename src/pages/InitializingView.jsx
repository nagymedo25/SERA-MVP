import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { Brain, Cpu, Database, Sparkles, Terminal, Wifi } from 'lucide-react'

const InitializingView = () => {
    const navigate = useNavigate()
    const location = useLocation()
    
    // استخراج المسار التالي
    const nextPath = location.state?.nextPath || '/courses'

    // Refs للعناصر المراد تحريكها
    const containerRef = useRef(null)
    const coreRef = useRef(null)
    const outerRingRef = useRef(null)
    const progressCircleRef = useRef(null)
    const progressTextRef = useRef(null)
    const terminalRef = useRef(null)

    // State للبيانات
    const [progress, setProgress] = useState(0)
    const [statusMessage, setStatusMessage] = useState("SYSTEM_BOOT_SEQUENCE_INITIATED")
    
    // تخزين السجلات ككائنات تحتوي على النص والتوقيت
    const [terminalLogs, setTerminalLogs] = useState([
        { time: '00:00:01', text: "Initializing SERA AI Core..." },
        { time: '00:00:02', text: "Establishing secure neural link..." },
    ])

    // خطوات المعالجة (نصوص تقنية أكثر)
    const steps = [
        "ANALYZING_CIRCADIAN_RHYTHM...",
        "DECONSTRUCTING_CURRICULUM_MODULES...",
        "SYNCHRONIZING_PEAK_FOCUS_WINDOWS...",
        "COMPILING_SMART_SCHEDULE_MATRIX...",
        "OPTIMIZATION_COMPLETE_LAUNCHING..."
    ]

    // دالة مساعدة للحصول على التوقيت الحالي
    const getCurrentTime = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    };

    // 1. منطق المحاكاة (زيادة النسبة وتغيير النصوص)
    useEffect(() => {
        const totalDuration = 6000 // 6 ثواني
        const intervalTime = 50 
        const incrementPerStep = 100 / (totalDuration / intervalTime)

        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + incrementPerStep
                
                // تحديد الرسالة الحالية
                const stepIndex = Math.min(
                    Math.floor((next / 100) * steps.length), 
                    steps.length - 1
                )
                
                if (steps[stepIndex] !== statusMessage) {
                    setStatusMessage(steps[stepIndex])
                }

                if (next >= 100) {
                    clearInterval(timer)
                    setTimeout(() => navigate(nextPath, { replace: true }), 800)
                    return 100
                }
                return next
            })
        }, intervalTime)

        return () => clearInterval(timer)
    }, [navigate, nextPath, statusMessage]) // أضفت statusMessage للتبعية لتجنب التحديثات الزائدة

    // 2. تحديث سجل التيرمينال عند تغير الرسالة
    useEffect(() => {
        setTerminalLogs(prev => {
            // منع التكرار
            if (prev[prev.length - 1]?.text === statusMessage) return prev;
            // الاحتفاظ بآخر 6 أسطر فقط
            const newLog = { time: getCurrentTime(), text: statusMessage };
            return [...prev.slice(-5), newLog]
        })
    }, [statusMessage])

    // 3. تحديثات بصرية مستمرة للتقدم
    useEffect(() => {
        if (!progressCircleRef.current || !progressTextRef.current) return;

        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (progress / 100) * circumference;

        gsap.to(progressCircleRef.current, { 
            strokeDashoffset: offset, 
            duration: 0.1, 
            ease: 'linear' 
        });
        
        gsap.to(progressTextRef.current, { 
            innerText: Math.floor(progress), 
            snap: { innerText: 1 }, 
            duration: 0.1 
        });

        // سكرول تلقائي للتيرمينال
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [progress])

    // 4. أنيميشن الدخول والخلفية
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set('.anim-entry', { opacity: 0, y: 30 });
            gsap.set(outerRingRef.current, { scale: 0.8, opacity: 0 });
            gsap.set(coreRef.current, { scale: 0 });

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.to(containerRef.current, { opacity: 1, duration: 0.5 })
              .to(outerRingRef.current, { scale: 1, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.5)' })
              .to(coreRef.current, { scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, "-=1")
              .to('.anim-entry', { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 }, "-=0.5");

            gsap.to(outerRingRef.current, { rotation: 360, duration: 20, repeat: -1, ease: 'none' });
            
            gsap.to(coreRef.current, { 
                boxShadow: '0 0 60px 25px rgba(56,189,248,0.15)', 
                scale: 1.05, 
                duration: 1.5, 
                repeat: -1, 
                yoyo: true, 
                ease: 'sine.inOut' 
            });

            gsap.to('.bg-particle', {
                y: 'random(-100, 100)',
                x: 'random(-100, 100)',
                opacity: 'random(0.2, 0.8)',
                duration: 'random(3, 6)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: 0.1
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center overflow-hidden opacity-0 font-sans">
            
            {/* خلفية شبكية وخلايا متحركة */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="bg-particle absolute w-1 h-1 bg-neon-blue/60 rounded-full blur-[1px]" 
                         style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
                ))}
            </div>

            {/* المحتوى المركزي */}
            <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
                
                {/* العنوان */}
                <h2 className="anim-entry text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-neon-violet animate-pulse" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-neon-blue to-neon-violet">
                        جاري بناء مسارك
                    </span>
                </h2>
                <p className="anim-entry text-gray-400 mb-12 text-center text-sm font-mono tracking-wide">
                    // AI_ENGINE: OPTIMIZING NEURAL PATHWAYS...
                </p>

                {/* المفاعل الرقمي (Digital Core) */}
                <div className="relative w-72 h-72 flex items-center justify-center mb-12">
                    {/* الحلقة الخارجية الدوارة */}
                    <div ref={outerRingRef} className="absolute inset-0 rounded-full border border-dashed border-neon-blue/30 p-2" />
                    <div className="absolute inset-4 rounded-full border border-white/5" />
                    
                    {/* دائرة التقدم SVG */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                        <circle 
                            ref={progressCircleRef}
                            cx="100" cy="100" r="90" 
                            fill="none" 
                            stroke="url(#progress-gradient)" 
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 90}`}
                            strokeDashoffset={`${2 * Math.PI * 90}`}
                        />
                        <defs>
                            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00d9ff" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* النواة المركزية */}
                    <div ref={coreRef} className="relative z-10 w-36 h-36 bg-slate-900 rounded-full flex flex-col items-center justify-center border border-neon-blue/50 shadow-[0_0_30px_rgba(0,217,255,0.2)]">
                         <Brain className="w-10 h-10 text-neon-blue mb-1 opacity-80 animate-pulse" />
                         <div className="flex items-baseline gap-1">
                             <span ref={progressTextRef} className="text-4xl font-bold font-mono text-white">0</span>
                             <span className="text-neon-blue text-sm font-mono">%</span>
                         </div>
                    </div>
                </div>

                {/* ==================================================== */}
                {/* 🚀 التيرمينال المطور (Enhanced System Terminal) 🚀 */}
                {/* ==================================================== */}
                <div className="anim-entry w-full max-w-lg relative group perspective-1000">
                    
                    {/* Ambient Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue/20 to-neon-violet/20 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                    
                    <div className="relative bg-[#0a0a0a]/90 rounded-xl border border-white/10 backdrop-blur-md overflow-hidden shadow-2xl">
                        
                        {/* Terminal Header */}
                        <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/5 select-none">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                </div>
                                <div className="flex items-center gap-2 ml-2 opacity-50">
                                    <Terminal size={10} />
                                    <span className="text-[10px] font-mono tracking-wider">SERA_CORE_V1.0</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                                <Wifi size={10} className="text-green-500" />
                                <span className="text-[9px] text-green-500 font-bold tracking-wider">LIVE</span>
                            </div>
                        </div>

                        {/* Terminal Body */}
                        <div className="p-4 h-32 overflow-y-auto scrollbar-hide relative font-mono text-xs leading-relaxed" ref={terminalRef}>
                            
                            {/* CRT Scanline Overlay */}
                            <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] opacity-20"></div>
                            
                            {/* Content */}
                            <div className="space-y-2 relative z-10">
                                {terminalLogs.map((log, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex gap-3 transition-all duration-300 ${index === terminalLogs.length - 1 ? 'opacity-100' : 'opacity-60'}`}
                                    >
                                        <span className="text-gray-500 select-none shrink-0 font-light text-[10px] pt-0.5">
                                            [{log.time}]
                                        </span>
                                        <span className={`${index === terminalLogs.length - 1 ? 'text-neon-blue' : 'text-gray-400'}`}>
                                            <span className="text-neon-violet mr-2 select-none">➜</span>
                                            {log.text}
                                            {index === terminalLogs.length - 1 && (
                                                <span className="inline-block w-1.5 h-3.5 align-middle bg-neon-blue ml-1 animate-[pulse_0.8s_infinite]"></span>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* أيقونات سفلية ديكورية */}
            <div className="fixed bottom-8 flex gap-8 text-gray-600 opacity-30">
                <Database className="w-6 h-6 animate-bounce" style={{ animationDuration: '3s' }} />
                <Cpu className="w-6 h-6 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
                <Brain className="w-6 h-6 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }} />
            </div>

        </div>
    )
}

export default InitializingView