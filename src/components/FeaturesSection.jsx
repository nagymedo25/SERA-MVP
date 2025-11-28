import React , { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Brain, Zap, Target, Shield, TrendingUp, Users } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const FeaturesSection = () => {
    const sectionRef = useRef(null)
    const cardsRef = useRef([])

    useEffect(() => {
        const cards = cardsRef.current

        // Section fade in on scroll
        gsap.fromTo(sectionRef.current,
            { opacity: 0, y: 80 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top center+=200',
                    toggleActions: 'play none none reverse'
                }
            }
        )

        // Stagger reveal animation
        gsap.fromTo(cards,
            {
                opacity: 0,
                y: 100,
                scale: 0.8
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top center+=100',
                    toggleActions: 'play none none reverse'
                }
            }
        )

        // Floating animation on hover
        cards.forEach((card) => {
            if (card) {
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -10,
                        duration: 0.3,
                        ease: 'power2.out'
                    })
                })

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    })
                })
            }
        })
    }, [])

    const features = [
        {
            icon: Brain,
            title: 'Psychological Analysis',
            description: 'Deep dive into your cognitive patterns, learning style, and mental energy cycles.',
            color: 'from-neon-violet to-purple-600'
        },
        {
            icon: Zap,
            title: 'Real-time Adaptation',
            description: 'Dynamic curriculum that adjusts to your current mental state and energy levels.',
            color: 'from-neon-blue to-cyan-600'
        },
        {
            icon: Target,
            title: 'Precision Learning',
            description: 'Targeted skill development based on your unique cognitive strengths.',
            color: 'from-pink-500 to-neon-violet'
        },
        {
            icon: Shield,
            title: 'Burnout Prevention',
            description: 'AI-powered interventions to maintain optimal performance without exhaustion.',
            color: 'from-green-500 to-emerald-600'
        },
        {
            icon: TrendingUp,
            title: 'Growth Tracking',
            description: 'Visualize your evolution across both technical and psychological dimensions.',
            color: 'from-orange-500 to-red-600'
        },
        {
            icon: Users,
            title: 'Personalized Coaching',
            description: 'Guidance tailored to your personality type and learning preferences.',
            color: 'from-neon-blue to-neon-violet'
        }
    ]

    return (
        <section
            ref={sectionRef}
            id="features"
            className="relative z-10 py-32 px-6"
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold mb-6">
                        Powered by{' '}
                        <span className="bg-gradient-to-r from-neon-blue to-neon-violet bg-clip-text text-transparent">
                            Intelligence
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Combining cutting-edge AI with psychological research to create the ultimate learning experience
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                ref={(el) => (cardsRef.current[index] = el)}
                                className="glass rounded-2xl p-8 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                            >
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-neon-blue transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
