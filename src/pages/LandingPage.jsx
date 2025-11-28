import React , { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code, Sparkles, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import FeaturesSection from '../components/FeaturesSection'
import StatsSection from '../components/StatsSection'
import TechnologiesSection from '../components/TechnologiesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import Footer from '../components/Footer'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const LandingPage = () => {
    const heroTextRef = useRef(null)
    const logoOrbRef = useRef(null)
    const mindprintRef = useRef(null)
    const cardsContainerRef = useRef(null)
    const philosophyTextRef = useRef(null)
    const ctaButtonRef = useRef(null)
    const heroSectionRef = useRef(null)
    const ctaSectionRef = useRef(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        // Hero Section Fade In
        const heroSection = heroSectionRef.current
        if (heroSection) {
            gsap.fromTo(heroSection,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out'
                }
            )
        }

        // Hero Section: Staggered Text Reveal Animation
        const heroText = heroTextRef.current
        if (heroText) {
            const chars = heroText.textContent.split('')
            heroText.innerHTML = chars
                .map((char, i) => `<span class="inline-block opacity-0 translate-y-8" style="transition-delay: ${i * 30}ms">${char === ' ' ? '&nbsp;' : char}</span>`)
                .join('')

            const charSpans = heroText.querySelectorAll('span')
            gsap.to(charSpans, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.03,
                ease: 'power3.out',
                delay: 0.5
            })
        }

        // Logo Orb Pulsing Animation
        if (logoOrbRef.current) {
            gsap.to(logoOrbRef.current, {
                scale: 1.15,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut'
            })
        }

        // CTA Section Fade In on Scroll
        if (ctaSectionRef.current) {
            gsap.fromTo(ctaSectionRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: ctaSectionRef.current,
                        start: 'top center+=100',
                        toggleActions: 'play none none reverse'
                    }
                }
            )
        }

        // Mindprint Section: Horizontal Scroll with Pin
        const mindprintSection = mindprintRef.current
        const cardsContainer = cardsContainerRef.current

        if (mindprintSection && cardsContainer) {
            const cards = cardsContainer.querySelectorAll('.mindprint-card')
            const scrollDistance = cardsContainer.scrollWidth - window.innerWidth

            gsap.to(cardsContainer, {
                x: -scrollDistance,
                ease: 'none',
                scrollTrigger: {
                    trigger: mindprintSection,
                    pin: true,
                    scrub: 1,
                    end: () => `+=${scrollDistance}`,
                    anticipatePin: 1,
                }
            })

            // Animate cards as they come into view
            cards.forEach((card, index) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 100 },
                    {
                        opacity: 1,
                        y: 0,
                        scrollTrigger: {
                            trigger: mindprintSection,
                            start: () => `top+=${index * 200} center`,
                            end: () => `top+=${index * 200 + 300} center`,
                            scrub: 1,
                        }
                    }
                )
            })
        }

        // Cleanup
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
            {/* Navbar */}
            <Navbar />

            {/* Animated Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-96 h-96 gradient-orb-1 animate-float" />
                <div className="absolute bottom-20 right-10 w-[500px] h-[500px] gradient-orb-2 animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 w-80 h-80 gradient-orb-1 animate-float" style={{ animationDelay: '4s' }} />
            </div>

            {/* Hero Section */}
            <section
                ref={heroSectionRef}
                id="hero"
                className="mt-[50px] relative z-10 min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20"
            >
                <div className="text-center space-y-8 max-w-5xl mx-auto">
                    {/* Logo Glowing Orb */}
                    <div className="flex justify-center mb-12">
                        <div
                            ref={logoOrbRef}
                            className="relative w-32 h-32 rounded-full glow-blue bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center overflow-hidden"
                        >
                            <img
                                src="/assets/logo.png"
                                alt="SERA Logo"
                                className="w-20 h-20 object-contain relative z-10"
                            />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-blue to-neon-violet opacity-50 blur-xl animate-pulse-slow" />
                        </div>
                    </div>

                    {/* Headline with Staggered Reveal */}
                    <h1
                        ref={heroTextRef}
                        className="text-7xl md:text-8xl font-bold tracking-tight"
                    >
                        Unlock Your Coding Genome
                    </h1>

                    {/* Subheadline */}
                    <p className="text-2xl md:text-3xl text-gray-400 font-light">
                        Where <span className="text-neon-violet text-glow-violet">Psychology</span> Meets{' '}
                        <span className="text-neon-blue text-glow-blue">Algorithms</span>
                    </p>

                    {/* Decorative Elements */}
                    <div className="flex justify-center gap-4 pt-8">
                        <div className="w-1 h-20 bg-gradient-to-b from-neon-blue to-transparent glow-blue" />
                        <div className="w-1 h-20 bg-gradient-to-b from-neon-violet to-transparent glow-violet" style={{ animationDelay: '0.5s' }} />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <FeaturesSection />

            {/* Stats Section */}
            <StatsSection />

            {/* Mindprint Section - Horizontal Scroll */}
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
                                <div className="w-20 h-20 rounded-2xl bg-neon-violet/20 glow-violet flex items-center justify-center">
                                    <img
                                        src="/assets/logo.png"
                                        alt="Psychology Icon"
                                        className="w-10 h-10 object-contain"
                                    />
                                </div>
                                <div>
                                    <div className="text-sm text-neon-violet font-mono mb-2">STEP 01</div>
                                    <h3 className="text-4xl font-bold mb-4">Psychological Scan</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed">
                                        We analyze your cognitive patterns, stress responses, and mental energy cycles to understand your unique mindprint.
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
                                    <div className="text-sm text-neon-blue font-mono mb-2">STEP 02</div>
                                    <h3 className="text-4xl font-bold mb-4">Skill Assessment</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed">
                                        Advanced coding challenges adapt to your level, revealing not just what you know, but how you think and solve problems.
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
                                    <div className="text-sm bg-gradient-to-r from-neon-blue to-neon-violet bg-clip-text text-transparent font-mono mb-2">STEP 03</div>
                                    <h3 className="text-4xl font-bold mb-4">Life Trajectory</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed">
                                        A personalized roadmap that aligns your psychological profile with your technical growth, optimizing for both performance and wellbeing.
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-1 bg-gradient-to-r from-neon-blue via-neon-violet to-transparent rounded-full" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Technologies Section */}
            <TechnologiesSection />

            {/* Philosophy Section - Parallax */}
            <section id="philosophy" className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <div
                        ref={philosophyTextRef}
                        className="space-y-6"
                    >
                        <h2 className="text-6xl md:text-7xl font-bold leading-tight">
                            More than <span className="text-neon-blue text-glow-blue">code</span>.
                            <br />
                            We debug your <span className="text-neon-violet text-glow-violet">mindset</span>.
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Traditional platforms teach syntax. SERA transforms how you think, adapt, and evolve as a developer.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* CTA Section - Magnetic Button */}
            <section
                ref={ctaSectionRef}
                id="cta"
                className="relative z-10 min-h-screen flex items-center justify-center px-6"
            >
                <div className="text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-5xl md:text-6xl font-bold">Ready to begin?</h2>
                        <p className="text-xl text-gray-400">Your cognitive evolution awaits.</p>
                    </div>

                    <div className="flex justify-center">
                        <a href="/dashboard">
                            <button
                                ref={ctaButtonRef}
                                className="group relative px-12 py-6 text-xl font-semibold rounded-2xl bg-gradient-to-r from-neon-blue to-neon-violet glow-blue transition-all duration-300 hover:scale-105 hover:glow-violet"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Start Your Analysis
                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-violet to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                            </button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    )
}

export default LandingPage
