import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import useSimulationStore from '../store/simulationStore'
import { Mail, Lock, LogIn, Cpu, Zap, ArrowRight } from 'lucide-react'

const LoginPage = () => {
    const navigate = useNavigate()
    const login = useSimulationStore((state) => state.login)
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')

    const containerRef = useRef(null)
    const formRef = useRef(null)
    const bgRef = useRef(null)

    // Advanced Entrance & Ambient Animations
    useGSAP(() => {
        const tl = gsap.timeline()

        // 1. Background Elements Pulse
        gsap.to(".bg-orb", {
            y: "20px",
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 1
        })

        // 2. Card Entrance (Cyberpunk Reveal)
        tl.fromTo(containerRef.current,
            { scaleY: 0, opacity: 0 },
            { scaleY: 1, opacity: 1, duration: 0.8, ease: "power4.out" }
        )
        
        // 3. Content Stagger
        tl.fromTo(".anim-item", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" },
            "-=0.4"
        )

        // 4. Decoration Lines
        tl.fromTo(".deco-line",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: "expo.out" },
            "-=0.6"
        )

    }, { scope: containerRef })

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!login) return;
        const result = login(formData.email, formData.password);
        if (result && result.success) {
            // Success Animation before navigate
            gsap.to(containerRef.current, {
                scale: 0.95,
                opacity: 0,
                duration: 0.3,
                onComplete: () => navigate('/dashboard')
            })
        } else {
            // Shake Animation on Error
            gsap.fromTo(formRef.current, 
                { x: -10 },
                { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: "none", clearProps: "x" }
            )
            setError(result?.message || "Invalid credentials");
        }
    };

    return (
        <div ref={bgRef} className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            
            {/* --- Animated Background --- */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
                
                {/* Glowing Orbs */}
                <div className="bg-orb absolute top-20 left-20 w-64 h-64 bg-neon-blue/20 rounded-full blur-[80px]" />
                <div className="bg-orb absolute bottom-20 right-20 w-80 h-80 bg-neon-violet/20 rounded-full blur-[100px]" />
            </div>

            {/* --- Main Card --- */}
            <div 
                ref={containerRef} 
                className="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-1 overflow-hidden shadow-2xl shadow-neon-blue/10"
            >
                {/* Top Glowing Edge */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50" />

                <div className="bg-slate-950/50 rounded-[22px] p-8 md:p-10 relative">
                    
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <div className="anim-item inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-transparent border border-neon-blue/30 mb-6 shadow-[0_0_30px_rgba(0,217,255,0.2)]">
                            <Cpu className="w-8 h-8 text-neon-blue" />
                        </div>
                        <h2 className="anim-item text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
                        <p className="anim-item text-slate-400">Access your neural dashboard</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="anim-item mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Email Input */}
                        <div className="anim-item group relative">
                            <label className="block text-xs font-mono text-neon-blue mb-1.5 ml-1">IDENTIFIER / EMAIL</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-neon-blue transition-colors duration-300" />
                                <input 
                                    type="email" 
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue/50 focus:bg-white/10 transition-all duration-300"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                                {/* Glow Effect on Focus */}
                                <div className="absolute inset-0 rounded-xl border border-neon-blue opacity-0 scale-95 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-500 pointer-events-none shadow-[0_0_20px_rgba(0,217,255,0.1)]" />
                            </div>
                        </div>
                        
                        {/* Password Input */}
                        <div className="anim-item group relative">
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-xs font-mono text-neon-violet">SECURITY KEY</label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-neon-violet transition-colors duration-300" />
                                <input 
                                    type="password" 
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-violet/50 focus:bg-white/10 transition-all duration-300"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                                <div className="absolute inset-0 rounded-xl border border-neon-violet opacity-0 scale-95 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-500 pointer-events-none shadow-[0_0_20px_rgba(139,92,246,0.1)]" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className="anim-item group w-full py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-violet text-white font-bold text-lg relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,217,255,0.3)]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Initiate Login <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            {/* Animated Shine */}
                            <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:animate-[shine_1s_ease-in-out]" />
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="anim-item mt-8 text-center">
                        <div className="deco-line w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                        <p className="text-slate-400 text-sm">
                            New user? <Link to="/signup" className="text-neon-blue font-bold hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-neon-blue hover:after:w-full after:transition-all">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage