import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

const MagneticButton = ({ children, className = '', intensity = 0.5, ...props }) => {
    const buttonRef = useRef(null)
    const magnetRef = useRef(null)

    useEffect(() => {
        const button = buttonRef.current
        if (!button) return

        const handleMouseMove = (e) => {
            const rect = button.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2

            gsap.to(button, {
                x: x * intensity,
                y: y * intensity,
                duration: 0.3,
                ease: 'power2.out'
            })
        }

        const handleMouseLeave = () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            })
        }

        button.addEventListener('mousemove', handleMouseMove)
        button.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            button.removeEventListener('mousemove', handleMouseMove)
            button.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [intensity])

    return (
        <button
            ref={buttonRef}
            className={`relative ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default MagneticButton
