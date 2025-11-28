import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Brain, Zap, Target, Shield, TrendingUp, Users } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const FeaturesSection = () => {
    const { t } = useLanguage()
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
            titleKey: 'landing.features.psychologicalAnalysis',
            descKey: 'landing.features.psychologicalAnalysisDesc',
            color: 'from-neon-violet to-purple-600'
        },
        {
            icon: Zap,
            titleKey: 'landing.features.realtimeAdaptation',
            descKey: 'landing.features.realtimeAdaptationDesc',
            color: 'from-neon-blue to-cyan-600'
        },
        {
            icon: Target,
            titleKey: 'landing.features.precisionLearning',
            descKey: 'landing.features.precisionLearningDesc',
            color: 'from-pink-500 to-neon-violet'
        },
        {
            icon: Shield,
            titleKey: 'landing.features.burnoutPrevention',
            descKey: 'landing.features.burnoutPreventionDesc',
            color: 'from-green-500 to-emerald-600'
        },
        {
            icon: TrendingUp,
            titleKey: 'landing.features.growthTracking',
            descKey: 'landing.features.growthTrackingDesc',
            color: 'from-orange-500 to-red-600'
        },
        {
            icon: Users,
            titleKey: 'landing.features.personalizedCoaching',
            descKey: 'landing.features.personalizedCoachingDesc',
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
                        {t('landing.features.title')}{' '}
                        <span className="bg-gradient-to-r from-neon-blue to-neon-violet bg-clip-text text-transparent">
                            {t('landing.features.subtitle')}
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        {t('landing.features.description')}
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
                                    {t(feature.titleKey)}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {t(feature.descKey)}
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
