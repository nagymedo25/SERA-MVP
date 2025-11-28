import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

const PageTransition = ({ children }) => {
    const containerRef = useRef(null)
    const location = useLocation()
    const prevLocation = useRef(location.pathname)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // Page change animation
        if (prevLocation.current !== location.pathname) {
            // Exit animation
            gsap.set(container, { opacity: 0, y: 20 })

            // Enter animation
            gsap.to(container, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out'
            })

            prevLocation.current = location.pathname
        } else {
            // Initial mount
            gsap.set(container, { opacity: 0, y: 30 })
            gsap.to(container, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.1
            })
        }
    }, [location])

    return (
        <div ref={containerRef} className="w-full">
            {children}
        </div>
    )
}

export default PageTransition
