import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ScrollFade = ({ children, className = "" }) => {
    const elRef = useRef(null)

    useEffect(() => {
        const el = elRef.current
        
        // Create the fade animation
        const anim = gsap.fromTo(el,
            { 
                opacity: 0, 
                y: 50 
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%', // When element top hits 85% of viewport height
                    end: 'bottom 15%', // When element bottom hits 15% of viewport height
                    toggleActions: 'play reverse play reverse', // Play on enter, reverse on leave, play on enter back, reverse on leave back
                }
            }
        )

        return () => {
            anim.kill()
        }
    }, [])

    return (
        <div ref={elRef} className={`w-full ${className}`}>
            {children}
        </div>
    )
}

export default ScrollFade