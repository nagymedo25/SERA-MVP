import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import useSimulationStore from '../store/simulationStore'
import { User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import Logo from '../assets/Logo.png'

const SignupPage = () => {
    const navigate = useNavigate()
    const signup = useSimulationStore((state) => state.signup)
    const [formData, setFormData] = useState({ email: '', password: '', name: '' })
    const [error, setError] = useState('')

    const containerRef = useRef(null)
    const formRef = useRef(null)

    useGSAP(() => {
        const tl = gsap.timeline()

        // 1. دخول البطاقة (سلايد من الأسفل)
        tl.fromTo(containerRef.current,
            { y: 50, opacity: 0, rotateX: 5 },
            { y: 0, opacity: 1, rotateX: 0, duration: 0.8, ease: "power3.out" }
        )

        // 2. العناصر الداخلية
        tl.fromTo(".anim-item",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
            "-=0.4"
        )

        // 3. تأثير الجزيئات الخلفية
        gsap.to(".floating-particle", {
            y: "random(-20, 20)",
            x: "random(-20, 20)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.1
        })

    }, { scope: containerRef })

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!signup) return;

        const result = signup(formData.email, formData.password, formData.name);

        if (result && result.success) {
            // انيميشن انتقال
            gsap.to(containerRef.current, {
                scale: 1.1,
                opacity: 0,
                duration: 0.3,
                onComplete: () => navigate('/domain-selection')
            })
        } else {
            setError(result?.message || "حدث خطأ ما");
            gsap.fromTo(formRef.current, { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true, clearProps: "x" })
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">

            {/* الخلفية الحية */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
                
                {/* جزيئات عائمة */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="floating-particle absolute w-2 h-2 bg-neon-violet/30 rounded-full blur-[1px]" 
                         style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
                ))}
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-neon-blue/10 to-neon-violet/10 rounded-full blur-[120px]" />
            </div>

            {/* البطاقة الرئيسية - عريضة */}
            <div 
                ref={containerRef}
                className="relative z-10 w-full max-w-lg"
            >
                {/* تأثير الحدود المتوهجة */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue via-neon-violet to-neon-pink rounded-[2.6rem] opacity-30 blur-sm animate-pulse" />

                <div className="relative bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-2xl">

                    <div className="text-center mb-10">
                        <div className="anim-item flex justify-center mb-6">
                            <img src={Logo} alt="SERA" className="h-16 object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
                        </div>
                        <h2 className="anim-item text-4xl font-bold text-white mb-2">انضم إلى النخبة</h2>
                        <p className="anim-item text-gray-400">ابدأ رحلة تطورك المعرفي اليوم</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm anim-item">
                            {error}
                        </div>
                    )}

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">

                        {/* الاسم */}
                        <div className="anim-item group">
                            <label className="block text-xs font-mono text-neon-blue mb-2 mr-1">FULL NAME</label>
                            <div className="relative">
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-blue transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 focus:bg-slate-900 transition-all text-lg text-right"
                                    placeholder="الاسم الكامل"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* البريد الإلكتروني */}
                        <div className="anim-item group">
                            <label className="block text-xs font-mono text-neon-violet mb-2 mr-1">EMAIL ADDRESS</label>
                            <div className="relative">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-violet transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-violet/50 focus:bg-slate-900 transition-all text-lg text-right"
                                    placeholder="yourname@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        {/* كلمة المرور */}
                        <div className="anim-item group">
                            <label className="block text-xs font-mono text-neon-pink mb-2 mr-1">PASSWORD</label>
                            <div className="relative">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-neon-pink transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-pink/50 focus:bg-slate-900 transition-all text-lg text-right"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="anim-item w-full py-5 rounded-2xl bg-gradient-to-r from-neon-violet to-neon-pink font-bold text-white text-xl hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 mt-6 group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                إنشاء الحساب <ArrowRight className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl" />
                        </button>
                    </form>

                    <div className="anim-item mt-8 text-center text-sm text-gray-400">
                        لديك حساب بالفعل؟ <Link to="/login" className="text-white font-bold hover:text-neon-pink transition-colors underline decoration-neon-pink/30 hover:decoration-neon-pink underline-offset-4">تسجيل الدخول</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage