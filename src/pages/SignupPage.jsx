import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import useSimulationStore from '../store/simulationStore'
import { User, Mail, Lock, Zap, ArrowRight, Activity } from 'lucide-react'

const SignupPage = () => {
    const navigate = useNavigate()
    const signup = useSimulationStore((state) => state.signup)
    const [formData, setFormData] = useState({ email: '', password: '', name: '' })
    const [error, setError] = useState('')

    const containerRef = useRef(null)
    const formRef = useRef(null)

    // Advanced Entrance Animations
    useGSAP(() => {
        const tl = gsap.timeline()

        // 1. Entrance Effect
        tl.fromTo(containerRef.current,
            { y: 50, opacity: 0, rotateX: 10 },
            { y: 0, opacity: 1, rotateX: 0, duration: 1, ease: "power3.out" }
        )

        // 2. Elements Slide In
        tl.fromTo(".input-group",
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
            "-=0.5"
        )

        // 3. Floating Icon Animation
        gsap.to(".header-icon", {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        })

    }, { scope: containerRef })

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!signup) return;

        const result = signup(formData.email, formData.password, formData.name);

        if (result && result.success) {
            // ✅ التغيير هنا: التوجيه لاختيار المجال أولاً
            navigate('/domain-selection');
        } else {
            setError(result?.message || "حدث خطأ ما");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">

            {/* --- Animated Background --- */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
                {/* Moving lines */}
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse delay-1000" />
            </div>

            {/* --- Main Card --- */}
            <div
                ref={containerRef}
                className="relative z-10 w-full max-w-md"
            >
                {/* Background Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-violet to-neon-pink rounded-[32px] blur opacity-30 animate-pulse" />

                <div className="relative bg-slate-900 border border-white/10 rounded-[30px] p-8 md:p-12 shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="header-icon inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-neon-violet/20 to-neon-pink/20 border border-white/10 mb-6 relative">
                            <Activity className="w-10 h-10 text-neon-pink" />
                            <div className="absolute inset-0 rounded-full border border-white/20 animate-[spin_10s_linear_infinite]" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-2">Join SERA</h2>
                        <p className="text-slate-400">Begin your cognitive evolution</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm">
                            {error}
                        </div>
                    )}

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">

                        {/* Name */}
                        <div className="input-group">
                            <div className="relative group">
                                <User className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-pink focus:bg-slate-800 transition-all"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-pink focus:bg-slate-800 transition-all"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <div className="relative group">
                                <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-pink focus:bg-slate-800 transition-all"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="input-group w-full py-4 rounded-xl bg-gradient-to-r from-neon-violet to-neon-pink font-bold text-white text-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 mt-4">
                            Create Account <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="input-group mt-8 text-center text-sm text-slate-400">
                        Already have an account? <Link to="/login" className="text-neon-pink font-bold hover:text-white transition-colors">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage