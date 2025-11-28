import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

const AnimatedCard = React.forwardRef(({ children, className = '', tiltIntensity = 15, glowColor = 'rgba(0, 200, 255, 0.3)' }, ref) => {
    const cardRef = useRef(null)
    const glowRef = useRef(null)

    useEffect(() => {
        const card = cardRef.current
        const glow = glowRef.current
        if (!card) return

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            const centerX = rect.width / 2
            const centerY = rect.height / 2

            const rotateX = ((y - centerY) / centerY) * tiltIntensity
            const rotateY = ((centerX - x) / centerX) * tiltIntensity

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.3,
                ease: 'power2.out',
                transformPerspective: 1000
            })

            if (glow) {
                gsap.to(glow, {
                    opacity: 0.8,
                    scale: 1.05,
                    duration: 0.3
                })
            }
        }

        const handleMouseLeave = () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            })

            if (glow) {
                gsap.to(glow, {
                    opacity: 0,
                    scale: 1,
                    duration: 0.5
                })
            }
        }

        card.addEventListener('mousemove', handleMouseMove)
        card.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            card.removeEventListener('mousemove', handleMouseMove)
            card.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [tiltIntensity])

    return (
        <div ref={cardRef} className={`relative ${className}`} style={{ transformStyle: 'preserve-3d' }}>
            <div
                ref={glowRef}
                className="absolute inset-0 rounded-inherit opacity-0 blur-xl pointer-events-none"
                style={{ backgroundColor: glowColor }}
            />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
})

AnimatedCard.displayName = 'AnimatedCard'

export default AnimatedCard
