import React, { useEffect, useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import FeaturesSection from '../components/FeaturesSection'
import StatsSection from '../components/StatsSection'
import TechnologiesSection from '../components/TechnologiesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import Footer from '../components/Footer'
import Logo from '../assets/Logo.png'
// ✅ أضفت أيقونات Zap و Shield للكروت الجديدة
import { Code, Sparkles, ChevronRight, Zap, Shield } from 'lucide-react'
import useSimulationStore from '../store/simulationStore'

gsap.registerPlugin(ScrollTrigger)

function LandingPage() {
    const { t } = useLanguage()
    const { user } = useSimulationStore()
    const heroSectionRef = useRef(null)
    const heroTextRef = useRef(null)
    const mindprintRef = useRef(null)
    const cardsContainerRef = useRef(null)
    const philosophyTextRef = useRef(null)
    const ctaSectionRef = useRef(null)
    const ctaButtonRef = useRef(null)

    useEffect(() => {
        // Hero Section Animations
        if (heroTextRef.current) {
            gsap.fromTo(
                heroTextRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: heroTextRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            )
        }

        // Mindprint Horizontal Scroll
        const cards = gsap.utils.toArray('.mindprint-card')
        if (cards.length > 0 && cardsContainerRef.current && mindprintRef.current) {
            gsap.to(cardsContainerRef.current, {
                x: () => -(cardsContainerRef.current.scrollWidth - window.innerWidth + 100),
                ease: 'none',
                scrollTrigger: {
                    trigger: mindprintRef.current,
                    start: 'top top',
                    end: () => `+=${cardsContainerRef.current.scrollWidth - window.innerWidth + 100}`,
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            })
        }

        // Philosophy Section Parallax
        if (philosophyTextRef.current) {
            gsap.fromTo(
                philosophyTextRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: philosophyTextRef.current,
                        start: 'top 70%',
                        end: 'bottom 20%',
                        scrub: true,
                    },
                }
            )
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [])

    // Magnetic Button Effect
    const handleMouseMove = (e) => {
        if (!ctaButtonRef.current) return

        const button = ctaButtonRef.current
        const rect = button.getBoundingClientRect()
        const buttonCenterX = rect.left + rect.width / 2
        const buttonCenterY = rect.top + rect.height / 2
        const distanceX = e.clientX - buttonCenterX
        const distanceY = e.clientY - buttonCenterY
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

        if (distance < 150) {
            const magnetStrength = 0.3
            gsap.to(button, {
                x: distanceX * magnetStrength,
                y: distanceY * magnetStrength,
                duration: 0.3,
                ease: 'power2.out'
            })
        } else {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            })
        }
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="relative min-h-screen font-sans">
            <Navbar />

            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-96 h-96 gradient-orb-1 animate-float" />
                <div className="absolute bottom-20 right-10 w-[500px] h-[500px] gradient-orb-2 animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 w-80 h-80 gradient-orb-1 animate-float" style={{ animationDelay: '4s' }} />
            </div>

            <section
                ref={heroSectionRef}
                id="hero"
                className="mt-[50px] relative z-10 min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20"
            >
                <div className="text-center space-y-8 max-w-5xl mx-auto">
                    <div className="flex justify-center mb-8">
                        <div className="relative flex items-center justify-center">
                            <img
                                src={Logo}
                                alt="SERA Logo"
                                className="md:w-[400px] w-[200px] h-45 object-contain relative z-10"
                            />
                        </div>
                    </div>

                    <h1
                        ref={heroTextRef}
                        className="text-7xl md:text-8xl font-bold tracking-tight"
                    >
                        {t('landing.hero.title')}
                    </h1>

                    <p className="text-2xl md:text-3xl text-gray-400 font-light">
                        {t('landing.hero.subtitle')} <span className="text-neon-violet text-glow-violet">{t('landing.hero.psychology')}</span> {t('landing.hero.meets')}{' '}
                        <span className="text-neon-blue text-glow-blue">{t('landing.hero.algorithms')}</span>
                    </p>

                    <div className="flex justify-center gap-4 pt-8">
                        <div className="w-1 h-20 bg-gradient-to-b from-neon-blue to-transparent glow-blue" />
                        <div className="w-1 h-20 bg-gradient-to-b from-neon-violet to-transparent glow-violet" style={{ animationDelay: '0.5s' }} />
                    </div>
                </div>
            </section>

            <FeaturesSection />
            <StatsSection />

            <section
                id="mindprint"
                ref={mindprintRef}
                className="relative z-10 h-screen overflow-hidden"
            >
                <div className="h-full flex items-center">
                    <div
                        ref={cardsContainerRef}
                        className="flex gap-8 px-8"
                        style={{ width: 'fit-content' }}
                    >
                        {/* Card 1: Psychological Scan */}
                        <div className="mindprint-card min-w-[500px] h-[600px] glass rounded-3xl p-12 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="w-20 h-20 flex items-center justify-center">
                                    <img
                                        src={Logo}
                                        alt="Psychology Icon"
                                        className="w-10 h-10 object-contain"
                                    />
                                </div>
                                <div>
                                    <div className="text-sm text-neon-violet font-mono mb-2">{t('landing.mindprint.step1')}</div>
                                    <h3 className="text-4xl font-bold mb-4">{t('landing.mindprint.psychScan')}</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed">
                                        {t('landing.mindprint.psychScanDesc')}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-1 bg-gradient-to-r from-neon-violet to-transparent rounded-full" />
                        </div>

                        {/* Card 2: Skill Assessment */}
                        <div className="mindprint-card min-w-[500px] h-[600px] glass rounded-3xl p-12 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="w-20 h-20 rounded-2xl bg-neon-blue/20 glow-blue flex items-center justify-center">
                                    <Code className="w-10 h-10 text-neon-blue" />
                                </div>
                                <div>
                                    <div className="text-sm text-neon-blue font-mono mb-2">{t('landing.mindprint.step2')}</div>
                                    <h3 className="text-4xl font-bold mb-4">{t('landing.mindprint.skillAssess')}</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed">
                                        {t('landing.mindprint.skillAssessDesc')}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-1 bg-gradient-to-r from-neon-blue to-transparent rounded-full" />
                        </div>

                        {/* Card 3: Life Trajectory */}
                        <div className="mindprint-card min-w-[500px] h-[600px] glass rounded-3xl p-12 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-violet glow-violet flex items-center justify-center">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm bg-gradient-to-r from-neon-blue to-neon-violet bg-clip-text text-transparent font-mono mb-2">{t('landing.mindprint.step3')}</div>
                                    <h3 className="text-4xl font-bold mb-4">{t('landing.mindprint.lifeTrajectory')}</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed">
                                        {t('landing.mindprint.lifeTrajectoryDesc')}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-1 bg-gradient-to-r from-neon-blue via-neon-violet to-transparent rounded-full" />
                        </div>

                        {/* ✅ Card 4: Real-time Adaptation (New) */}
                        <div className="mindprint-card min-w-[500px] h-[600px] glass rounded-3xl p-12 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="w-20 h-20 rounded-2xl bg-cyan-500/20 glow-blue flex items-center justify-center">
                                    <Zap className="w-10 h-10 text-cyan-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-cyan-400 font-mono mb-2">STEP 04</div>
                                    <h3 className="text-4xl font-bold mb-4">{t('landing.features.realtimeAdaptation')}</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed">
                                        {t('landing.features.realtimeAdaptationDesc')}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-1 bg-gradient-to-r from-cyan-400 to-transparent rounded-full" />
                        </div>

                        {/* ✅ Card 5: Burnout Prevention (New) */}
                        <div className="mindprint-card min-w-[500px] h-[600px] glass rounded-3xl p-12 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 glow-green flex items-center justify-center">
                                    <Shield className="w-10 h-10 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-emerald-400 font-mono mb-2">STEP 05</div>
                                    <h3 className="text-4xl font-bold mb-4">{t('landing.features.burnoutPrevention')}</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed">
                                        {t('landing.features.burnoutPreventionDesc')}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-1 bg-gradient-to-r from-emerald-400 to-transparent rounded-full" />
                        </div>

                    </div>
                </div>
            </section>

            <TechnologiesSection />

            <section id="philosophy" className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <div
                        ref={philosophyTextRef}
                        className="space-y-6"
                    >
                        <h2 className="text-6xl md:text-7xl font-bold leading-tight">
                            {t('landing.philosophy.moreThan')} <span className="text-neon-blue text-glow-blue">{t('landing.philosophy.code')}</span>.
                            <br />
                            {t('landing.philosophy.weDebug')} <span className="text-neon-violet text-glow-violet">{t('landing.philosophy.mindset')}</span>.
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            {t('landing.philosophy.description')}
                        </p>
                    </div>
                </div>
            </section>

            <TestimonialsSection />

            <section
                ref={ctaSectionRef}
                id="cta"
                className="relative z-10 min-h-screen flex items-center justify-center px-6"
            >
                <div className="text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-5xl md:text-6xl font-bold">{t('landing.cta.title')}</h2>
                        <p className="text-xl text-gray-400">{t('landing.cta.subtitle')}</p>
                    </div>

                    <div className="flex justify-center">
                        {/* ✅ تم تحديث الرابط ليوجه دائماً إلى صفحة Onboarding */}
                        <Link to="/onboarding">
                            <button
                                ref={ctaButtonRef}
                                className="group relative px-12 py-6 text-xl font-semibold rounded-2xl bg-gradient-to-r from-neon-blue to-neon-violet glow-blue transition-all duration-300 hover:scale-105 hover:glow-violet"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    {t('landing.cta.button')}
                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-violet to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default LandingPage