import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const TestimonialsSection = () => {
    const { t } = useLanguage()
    const [currentIndex, setCurrentIndex] = useState(0)
    const testimonialRef = useRef(null)
    const sectionRef = useRef(null)
    const autoPlayRef = useRef(null)

    const testimonials = [
        {
            name: 'Sarah Chen',
            role: 'Full-Stack Developer',
            company: 'Tech Innovators Inc.',
            text: "SERA didn't just teach me to code better—it taught me to think better. The psychological insights helped me understand my learning patterns and optimize my workflow.",
            avatar: '👩‍💻'
        },
        {
            name: 'Michael Rodriguez',
            role: 'Software Engineer',
            company: 'CloudScale Systems',
            text: "The burnout prevention features are game-changing. SERA helped me maintain peak performance without the usual exhaustion. It's like having a personal coach who understands both code and cognition.",
            avatar: '👨‍💼'
        },
        {
            name: 'Aisha Patel',
            role: 'ML Engineer',
            company: 'AI Dynamics',
            text: "I've tried countless learning platforms, but SERA is different. It adapts to my mental state in real-time. When I'm stressed, it adjusts. When I'm focused, it challenges me. Pure genius.",
            avatar: '👩‍🔬'
        },
        {
            name: 'David Kim',
            role: 'Frontend Developer',
            company: 'DesignTech Studio',
            text: "The combination of psychological analysis and technical assessment revealed blind spots I didn't even know I had. My coding efficiency improved by 40% in just two months.",
            avatar: '👨‍🎨'
        }
    ]

    useEffect(() => {
        // Section fade in on scroll
        if (sectionRef.current) {
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
        }

        // Auto-play carousel
        autoPlayRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)

        return () => clearInterval(autoPlayRef.current)
    }, [testimonials.length])

    useEffect(() => {
        // Animate testimonial change
        if (testimonialRef.current) {
            gsap.fromTo(testimonialRef.current,
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
            )
        }
    }, [currentIndex])

    const nextTestimonial = () => {
        clearInterval(autoPlayRef.current)
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        clearInterval(autoPlayRef.current)
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    const current = testimonials[currentIndex]

    return (
        <section ref={sectionRef} className="relative z-10 py-32 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold mb-6">
                        {t('landing.testimonials.title')}{' '}
                        <span className="bg-gradient-to-r from-neon-blue to-neon-violet bg-clip-text text-transparent">
                            {t('landing.testimonials.subtitle')}
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400">
                        {t('landing.testimonials.description')}
                    </p>
                </div>

                {/* Testimonial Card */}
                <div className="relative">
                    <div
                        ref={testimonialRef}
                        className="glass rounded-3xl p-12 md:p-16 relative"
                    >
                        {/* Quote Icon */}
                        <div className="absolute top-8 left-8 opacity-20">
                            <Quote className="w-16 h-16 text-neon-blue" />
                        </div>

                        {/* Avatar */}
                        <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center text-5xl glow-blue">
                                {current.avatar}
                            </div>
                        </div>

                        {/* Testimonial Text */}
                        <p className="text-2xl md:text-3xl text-gray-300 text-center leading-relaxed mb-8 font-light italic">
                            "{current.text}"
                        </p>

                        {/* Author Info */}
                        <div className="text-center">
                            <h4 className="text-xl font-bold text-white mb-1">{current.name}</h4>
                            <p className="text-neon-blue">{current.role}</p>
                            <p className="text-gray-500 text-sm">{current.company}</p>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-12 h-12 rounded-full glass hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                        <ChevronLeft className="w-6 h-6 text-neon-blue" />
                    </button>

                    <button
                        onClick={nextTestimonial}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-12 h-12 rounded-full glass hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                        <ChevronRight className="w-6 h-6 text-neon-violet" />
                    </button>
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-3 mt-8">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                clearInterval(autoPlayRef.current)
                                setCurrentIndex(index)
                            }}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-gradient-to-r from-neon-blue to-neon-violet w-12'
                                : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection
