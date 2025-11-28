import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Brain, Code, Target, TrendingUp, Heart, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const OnboardingResults = ({ mindprint, codingGenome, lifeTrajectory }) => {
    const navigate = useNavigate()
    const headerRef = useRef(null)
    const cardsRef = useRef([])
    const statsRefs = useRef([])
    const buttonRef = useRef(null)

    useEffect(() => {
        const tl = gsap.timeline()

        // Set initial states
        gsap.set([headerRef.current, ...cardsRef.current.filter(Boolean), buttonRef.current].filter(Boolean), {
            opacity: 0
        })

        // Animate header first
        if (headerRef.current) {
            tl.to(headerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
            })
        }

        // Animate cards in sequence
        tl.to(cardsRef.current.filter(Boolean), {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power3.out',
        }, '-=0.4')

        // Animate stats counter
        statsRefs.current.forEach((stat) => {
            if (!stat) return
            const target = parseInt(stat.dataset.target)
            gsap.to(stat, {
                innerHTML: target,
                duration: 1.5,
                delay: 0.8,
                ease: 'power2.out',
                snap: { innerHTML: 1 },
            })
        })

        // Button magnetic effect
        if (buttonRef.current) {
            tl.to(buttonRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.7)',
            }, '-=0.2')
        }
    }, [])

    const handleStart = () => {
        gsap.to('.results-container', {
            opacity: 0,
            y: -50,
            duration: 0.5,
            onComplete: () => navigate('/dashboard'),
        })
    }

    return (
        <div className="results-container min-h-screen bg-slate-950 text-white py-20 px-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-96 h-96 gradient-orb-1 animate-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 gradient-orb-2 animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <div ref={headerRef} className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center glow-blue">
                            <Brain className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">تحليلك الشخصي جاهز!</h1>
                    <p className="text-xl text-gray-400">تم توليد خريطتك الفريدة بنجاح</p>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Mindprint Card */}
                    <div
                        ref={(el) => (cardsRef.current[0] = el)}
                        className="glass rounded-3xl p-8 border border-white/10 hover:border-neon-violet/50 transition-all duration-300"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-neon-violet/20 glow-violet flex items-center justify-center mb-6">
                            <Brain className="w-8 h-8 text-neon-violet" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Mindprint</h3>
                        <p className="text-gray-400 mb-6">خريطتك الذهنية الفريدة</p>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">التركيز</span>
                                    <span
                                        ref={(el) => (statsRefs.current[0] = el)}
                                        data-target={mindprint?.traits?.conscientiousness || 75}
                                        className="text-neon-violet font-bold"
                                    >
                                        0
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-neon-violet to-neon-pink rounded-full"
                                        style={{ width: `${mindprint?.traits?.conscientiousness || 75}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">المرونة</span>
                                    <span
                                        ref={(el) => (statsRefs.current[1] = el)}
                                        data-target={mindprint?.traits?.resilience || 65}
                                        className="text-neon-violet font-bold"
                                    >
                                        0
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-neon-violet to-neon-pink rounded-full"
                                        style={{ width: `${mindprint?.traits?.resilience || 65}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">الانفتاح</span>
                                    <span
                                        ref={(el) => (statsRefs.current[2] = el)}
                                        data-target={mindprint?.traits?.openness || 80}
                                        className="text-neon-violet font-bold"
                                    >
                                        0
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-neon-violet to-neon-pink rounded-full"
                                        style={{ width: `${mindprint?.traits?.openness || 80}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coding Genome Card */}
                    <div
                        ref={(el) => (cardsRef.current[1] = el)}
                        className="glass rounded-3xl p-8 border border-white/10 hover:border-neon-blue/50 transition-all duration-300"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-neon-blue/20 glow-blue flex items-center justify-center mb-6">
                            <Code className="w-8 h-8 text-neon-blue" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Coding Genome</h3>
                        <p className="text-gray-400 mb-6">بصمتك البرمجية</p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <span className="text-sm">المستوى</span>
                                <span className="text-neon-blue font-semibold capitalize">{codingGenome?.level || 'Beginner'}</span>
                            </div>

                            <div>
                                <div className="text-sm text-gray-400 mb-2">نقاط القوة</div>
                                <div className="flex flex-wrap gap-2">
                                    {(codingGenome?.strengths || ['HTML', 'CSS', 'JavaScript']).map((skill) => (
                                        <span key={skill} className="px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-xs font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">سرعة حل المشكلات</span>
                                    <span
                                        ref={(el) => (statsRefs.current[3] = el)}
                                        data-target={codingGenome?.problemSolvingScore || 70}
                                        className="text-neon-blue font-bold"
                                    >
                                        0
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-neon-blue to-cyan-400 rounded-full"
                                        style={{ width: `${codingGenome?.problemSolvingScore || 70}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Life Trajectory Card */}
                    <div
                        ref={(el) => (cardsRef.current[2] = el)}
                        className="glass rounded-3xl p-8 border border-white/10 hover:border-green-500/50 transition-all duration-300"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center mb-6">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Life Trajectory</h3>
                        <p className="text-gray-400 mb-6">مسارك المستقبلي</p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                <div>
                                    <div className="text-xs text-gray-400">الهدف</div>
                                    <div className="text-sm font-semibold capitalize">{lifeTrajectory?.goal?.replace('_', ' ') || 'Web Developer'}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                <div>
                                    <div className="text-xs text-gray-400">الإطار الزمني</div>
                                    <div className="text-sm font-semibold">{lifeTrajectory?.timeframe || '6 أشهر'}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                <Heart className="w-5 h-5 text-pink-400" />
                                <div>
                                    <div className="text-xs text-gray-400">التخصص</div>
                                    <div className="text-sm font-semibold capitalize">{lifeTrajectory?.field || 'Web Development'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <button
                        ref={buttonRef}
                        onClick={handleStart}
                        className="group relative px-12 py-6 text-xl font-semibold rounded-2xl bg-gradient-to-r from-neon-blue to-neon-violet glow-blue transition-all duration-300 hover:scale-105 hover:glow-violet"
                    >
                        <span className="relative z-10">ابدأ رحلتك الآن 🚀</span>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-violet to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OnboardingResults
