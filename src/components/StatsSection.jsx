import React ,{ useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const StatsSection = () => {
    const sectionRef = useRef(null)
    const statsRef = useRef([])

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

        const counters = statsRef.current.map(el => el?.querySelector('.counter'))

        counters.forEach((counter, index) => {
            if (!counter) return

            const target = parseInt(counter.getAttribute('data-target'))
            const suffix = counter.getAttribute('data-suffix') || ''

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top center',
                onEnter: () => {
                    gsap.to({ val: 0 }, {
                        val: target,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: function () {
                            counter.textContent = Math.floor(this.targets()[0].val) + suffix
                        }
                    })
                },
                once: true
            })
        })

        // Animate stat cards
        gsap.fromTo(statsRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top center+=100',
                }
            }
        )
    }, [])

    const stats = [
        { value: 10000, suffix: '+', label: 'Active Users', color: 'from-neon-blue to-cyan-600' },
        { value: 95, suffix: '%', label: 'Success Rate', color: 'from-neon-violet to-purple-600' },
        { value: 500, suffix: '+', label: 'Courses Available', color: 'from-pink-500 to-red-600' },
        { value: 24, suffix: '/7', label: 'AI Support', color: 'from-green-500 to-emerald-600' }
    ]

    return (
        <section
            ref={sectionRef}
            className="relative z-10 py-24 px-6"
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            ref={(el) => (statsRef.current[index] = el)}
                            className="glass rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300"
                        >
                            <div className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                <span
                                    className="counter"
                                    data-target={stat.value}
                                    data-suffix={stat.suffix}
                                >
                                    0{stat.suffix}
                                </span>
                            </div>
                            <p className="text-gray-400 text-lg">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default StatsSection
