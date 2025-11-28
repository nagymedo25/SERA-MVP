import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const TechnologiesSection = () => {
    const { t } = useLanguage()
    const sectionRef = useRef(null)
    const techRef = useRef([])

    useEffect(() => {
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

        // Morph animation on scroll
        gsap.fromTo(techRef.current,
            {
                opacity: 0,
                scale: 0.5,
                rotation: -15
            },
            {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top center+=100',
                }
            }
        )

        // Hover morph effect
        techRef.current.forEach((tech) => {
            if (tech) {
                tech.addEventListener('mouseenter', () => {
                    gsap.to(tech, {
                        scale: 1.15,
                        rotation: 5,
                        duration: 0.4,
                        ease: 'power2.out'
                    })
                })

                tech.addEventListener('mouseleave', () => {
                    gsap.to(tech, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.4,
                        ease: 'power2.out'
                    })
                })
            }
        })
    }, [])

    const technologies = [
        { name: 'React', color: 'from-cyan-400 to-blue-500' },
        { name: 'TensorFlow', color: 'from-orange-400 to-red-500' },
        { name: 'Python', color: 'from-blue-400 to-yellow-500' },
        { name: 'OpenAI', color: 'from-green-400 to-emerald-500' },
        { name: 'GSAP', color: 'from-neon-blue to-neon-violet' },
        { name: 'Neural Networks', color: 'from-purple-400 to-pink-500' },
        { name: 'MongoDB', color: 'from-green-500 to-green-700' },
        { name: 'Node.js', color: 'from-green-400 to-lime-500' }
    ]

    return (
        <section
            ref={sectionRef}
            className="relative z-10 py-32 px-6"
        >
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold mb-6">
                        {t('landing.technologies.title')}{' '}
                        <span className="bg-gradient-to-r from-neon-violet to-pink-500 bg-clip-text text-transparent">
                            {t('landing.technologies.subtitle')}
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        {t('landing.technologies.description')}
                    </p>
                </div>

                {/* Technologies Grid */}
                <div className="flex flex-wrap justify-center gap-6">
                    {technologies.map((tech, index) => (
                        <div
                            key={index}
                            ref={(el) => (techRef.current[index] = el)}
                            className={`glass px-8 py-6 rounded-2xl cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-300`}
                        >
                            <span className={`text-xl font-bold bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TechnologiesSection
