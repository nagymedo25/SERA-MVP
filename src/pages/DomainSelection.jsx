import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Code, Server, Smartphone, Brain, Lock, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'

const DomainSelection = () => {
    const navigate = useNavigate()
    const containerRef = useRef(null)
    const cardsRef = useRef([])

    const domains = [
        { 
            id: 'frontend', 
            title: 'Front-End Development', 
            icon: Code, 
            status: 'unlocked', 
            desc: 'Master the art of user interfaces with React, Tailwind, and modern web technologies.',
            color: 'from-cyan-400 to-blue-600'
        },
        { 
            id: 'backend', 
            title: 'Back-End Engineering', 
            icon: Server, 
            status: 'locked', 
            desc: 'Build robust APIs, manage databases, and handle server-side logic.',
            color: 'from-purple-400 to-pink-600'
        },
        { 
            id: 'mobile', 
            title: 'Mobile App Development', 
            icon: Smartphone, 
            status: 'locked', 
            desc: 'Create cross-platform applications for iOS and Android.',
            color: 'from-green-400 to-emerald-600'
        },
        { 
            id: 'ai', 
            title: 'AI & Data Science', 
            icon: Brain, 
            status: 'locked', 
            desc: 'Unlock the power of machine learning and data analysis.',
            color: 'from-orange-400 to-red-600'
        }
    ]

    useEffect(() => {
        const tl = gsap.timeline()
        
        tl.fromTo(containerRef.current.children, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        )
    }, [])

    const handleSelect = (domain) => {
        if (domain.status === 'unlocked') {
            navigate('/onboarding')
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6 relative overflow-hidden">
                {/* Background FX */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-neon-violet/10 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet">Path</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Select your specialization to begin the personalized analysis. More paths are unlocking soon.
                        </p>
                    </div>

                    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {domains.map((domain, index) => {
                            const Icon = domain.icon
                            const isLocked = domain.status === 'locked'

                            return (
                                <div
                                    key={domain.id}
                                    onClick={() => handleSelect(domain)}
                                    className={`relative group p-8 rounded-3xl border transition-all duration-500 overflow-hidden
                                        ${isLocked 
                                            ? 'bg-slate-900/50 border-white/5 cursor-not-allowed opacity-70 grayscale-[0.5]' 
                                            : 'glass border-white/10 hover:border-neon-blue/50 hover:shadow-[0_0_30px_rgba(0,217,255,0.15)] cursor-pointer'
                                        }
                                    `}
                                >
                                    {/* Hover Gradient for Unlocked */}
                                    {!isLocked && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-neon-violet/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    )}

                                    <div className="relative z-10 flex items-start justify-between">
                                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${domain.color} bg-opacity-20 mb-6 inline-block`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        {isLocked ? (
                                            <div className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10">
                                                <Lock className="w-5 h-5 text-gray-400" />
                                            </div>
                                        ) : (
                                            <div className="bg-neon-blue/20 p-2 rounded-full border border-neon-blue/30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                                <ArrowRight className="w-5 h-5 text-neon-blue" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold mb-3">{domain.title}</h3>
                                        <p className="text-gray-400 leading-relaxed mb-4">{domain.desc}</p>
                                        
                                        <div className="flex items-center gap-2">
                                            <div className={`h-1.5 rounded-full flex-1 ${isLocked ? 'bg-slate-800' : 'bg-slate-700'}`}>
                                                <div className={`h-full rounded-full ${isLocked ? 'w-0' : 'w-full bg-gradient-to-r from-neon-blue to-neon-violet'}`} />
                                            </div>
                                            <span className="text-xs font-mono text-gray-500">
                                                {isLocked ? 'COMING SOON' : 'AVAILABLE NOW'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DomainSelection