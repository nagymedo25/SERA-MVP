import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import useSimulationStore from '../store/simulationStore'
import { Mail, Lock, LogIn, ArrowRight, ScanFace } from 'lucide-react'
import Logo from '../assets/Logo.png'

const LoginPage = () => {
    const navigate = useNavigate()
    const login = useSimulationStore((state) => state.login)
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')

    const containerRef = useRef(null)
    const formRef = useRef(null)
    const logoRef = useRef(null)

    // تأثيرات الدخول السينمائية
    useGSAP(() => {
        const tl = gsap.timeline()

        // 1. دخول البطاقة
        tl.fromTo(containerRef.current,
            { y: 30, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
        )

        // 2. ظهور اللوجو والعناوين
        tl.fromTo(".anim-header",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
            "-=0.4"
        )

        // 3. حقول الإدخال
        tl.fromTo(".anim-input",
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.2)" },
            "-=0.2"
        )

        // 4. تأثير مستمر للخلفية
        gsap.to(".bg-glow", {
            scale: 1.2,
            opacity: 0.4,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        })

    }, { scope: containerRef })

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!login) return;
        const result = login(formData.email, formData.password);
        
        if (result && result.success) {
            // تأثير الخروج عند النجاح
            gsap.to(containerRef.current, {
                scale: 1.05,
                opacity: 0,
                filter: 'blur(10px)',
                duration: 0.4,
                onComplete: () => navigate('/dashboard')
            })
        } else {
            // تأثير الاهتزاز عند الخطأ
            gsap.fromTo(formRef.current, 
                { x: -10 },
                { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: "none", clearProps: "x" }
            )
            setError(result?.message || "بيانات الدخول غير صحيحة");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            
            {/* الخلفية الحية */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,217,255,0.05)_0%,transparent_70%)]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="bg-glow absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px]" />
                <div className="bg-glow absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-violet/10 rounded-full blur-[100px]" style={{ animationDelay: '-2s' }} />
            </div>

            {/* البطاقة الرئيسية - عريضة ومتناسبة */}
            <div 
                ref={containerRef} 
                className="relative z-10 w-full max-w-lg bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl shadow-neon-blue/5 overflow-hidden"
            >
                {/* تأثير الشريط العلوي */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50" />

                <div className="flex flex-col items-center text-center mb-10">
                    {/* اللوجو */}
                    <div className="anim-header mb-6 relative group">
                        <div className="absolute -inset-4 bg-neon-blue/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <img 
                            ref={logoRef}
                            src={Logo} 
                            alt="SERA Logo" 
                            className="h-16 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,217,255,0.5)]"
                        />
                    </div>
                    
                    <h2 className="anim-header text-4xl font-bold text-white mb-2 tracking-tight">مرحباً بعودتك</h2>
                    <p className="anim-header text-gray-400 text-lg">الوصول إلى النظام العصبي المركزي</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-center gap-2 animate-pulse">
                        <ScanFace className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* البريد الإلكتروني */}
                    <div className="anim-input group">
                        <label className="block text-xs font-mono text-neon-blue mb-2 mr-1">IDENTIFIER // EMAIL</label>
                        <div className="relative">
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input 
                                type="email" 
                                required
                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 focus:bg-slate-900/80 transition-all duration-300 text-lg text-right"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                dir="ltr"
                            />
                        </div>
                    </div>
                    
                    {/* كلمة المرور */}
                    <div className="anim-input group">
                        <div className="flex justify-between items-center mb-2 mr-1">
                            <label className="text-xs font-mono text-neon-violet">SECURITY KEY</label>
                        </div>
                        <div className="relative">
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-violet transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input 
                                type="password" 
                                required
                                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-violet/50 focus:bg-slate-900/80 transition-all duration-300 text-lg text-right"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                dir="ltr"
                            />
                        </div>
                    </div>

                    {/* زر الدخول */}
                    <button 
                        type="submit" 
                        className="anim-input group w-full py-5 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-violet text-white font-bold text-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,217,255,0.3)] mt-4"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            تسجيل الدخول <LogIn className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:animate-[shine_1s_ease-in-out]" />
                    </button>
                </form>

                {/* الفوتر */}
                <div className="anim-input mt-8 text-center">
                    <p className="text-gray-400">
                        مستخدم جديد؟ <Link to="/signup" className="text-white font-bold hover:text-neon-blue transition-colors relative inline-block group">
                            إنشاء حساب
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-neon-blue transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage