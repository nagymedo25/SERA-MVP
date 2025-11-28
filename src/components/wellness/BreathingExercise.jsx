import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Wind, X } from 'lucide-react'
import useSimulationStore from '../../store/simulationStore'

const BreathingExercise = () => {
    const { showBreathingExercise, closeBreathingExercise } = useSimulationStore()
    const circleRef = useRef(null)
    const textRef = useRef(null)
    const modalRef = useRef(null)

    useEffect(() => {
        if (!showBreathingExercise || !circleRef.current || !textRef.current) return

        // Modal entrance
        gsap.fromTo(
            modalRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
        )

        // Breathing animation timeline
        const tl = gsap.timeline({ repeat: 4 }) // 5 cycles total

        // Inhale
        tl.to(circleRef.current, {
            scale: 1.5,
            duration: 4,
            ease: 'power1.inOut',
        })
            .to(
                textRef.current,
                {
                    opacity: 0,
                    duration: 0.3,
                },
                0
            )
            .call(() => {
                if (textRef.current) textRef.current.textContent = 'اشهق بعمق... 🌬️'
            }, null, 0.3)
            .to(
                textRef.current,
                {
                    opacity: 1,
                    duration: 0.3,
                },
                0.3
            )

        // Hold
        tl.to({}, { duration: 1 })
            .to(textRef.current, { opacity: 0, duration: 0.3 })
            .call(() => {
                if (textRef.current) textRef.current.textContent = 'احبس... ⏸️'
            })
            .to(textRef.current, { opacity: 1, duration: 0.3 })

        // Exhale
        tl.to(circleRef.current, {
            scale: 1,
            duration: 4,
            ease: 'power1.inOut',
        })
            .to(
                textRef.current,
                {
                    opacity: 0,
                    duration: 0.3,
                },
                '-=4'
            )
            .call(() => {
                if (textRef.current) textRef.current.textContent = 'ازفر ببطء... 💨'
            }, null, '-=3.7')
            .to(
                textRef.current,
                {
                    opacity: 1,
                    duration: 0.3,
                },
                '-=3.7'
            )

        // Auto-close after cycles complete
        tl.eventCallback('onComplete', () => {
            setTimeout(() => {
                gsap.to(modalRef.current, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.4,
                    onComplete: closeBreathingExercise,
                })
            }, 1000)
        })

        return () => tl.kill()
    }, [showBreathingExercise, closeBreathingExercise])

    if (!showBreathingExercise) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={closeBreathingExercise}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative z-10 glass rounded-3xl p-12 max-w-lg w-full mx-4 border border-white/20"
            >
                {/* Close Button */}
                <button
                    onClick={closeBreathingExercise}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* Content */}
                <div className="text-center space-y-8">
                    <div>
                        <Wind className="w-12 h-12 text-neon-blue mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-2">تمرين التنفس</h2>
                        <p className="text-gray-400">اتبع الدائرة وتنفس معها</p>
                    </div>

                    {/* Breathing Circle */}
                    <div className="relative w-64 h-64 mx-auto">
                        {/* Outer glow */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-blue/30 to-neon-violet/30 blur-2xl" />

                        {/* Main circle */}
                        <div
                            ref={circleRef}
                            className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center shadow-2xl"
                            style={{
                                transform: 'scale(1)',
                                boxShadow: '0 0 60px rgba(59, 130, 246, 0.6), 0 0 100px rgba(139, 92, 246, 0.3)',
                            }}
                        >
                            {/* Inner effect */}
                            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm" />
                        </div>
                    </div>

                    {/* Instruction Text */}
                    <p
                        ref={textRef}
                        className="text-2xl font-semibold text-white"
                    >
                        استرخِ... 🧘
                    </p>

                    {/* Skip Button */}
                    <button
                        onClick={closeBreathingExercise}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        تخطي
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BreathingExercise
