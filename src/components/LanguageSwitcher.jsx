import React, { useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import gsap from 'gsap'
import { Globe } from 'lucide-react'

const LanguageSwitcher = () => {
    const { language, setLanguage, isChanging } = useLanguage()
    const loaderRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        if (isChanging && loaderRef.current) {
            gsap.fromTo(
                loaderRef.current,
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out',
                }
            )

            gsap.to(loaderRef.current, {
                rotation: 360,
                duration: 0.6,
                ease: 'linear',
                repeat: -1,
            })
        } else if (loaderRef.current) {
            gsap.killTweensOf(loaderRef.current)
            gsap.to(loaderRef.current, {
                opacity: 0,
                scale: 0.8,
                duration: 0.2,
            })
        }
    }, [isChanging])

    const handleToggle = () => {
        const newLang = language === 'ar' ? 'en' : 'ar'
        setLanguage(newLang)
    }

    return (
        <div ref={containerRef} className="relative">
            {/* Loader Overlay */}
            {isChanging && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                    <div
                        ref={loaderRef}
                        className="relative w-24 h-24 rounded-full bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center"
                    >
                        <Globe className="w-12 h-12 text-white" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-blue to-neon-violet opacity-50 blur-xl animate-pulse" />
                    </div>
                </div>
            )}

            {/* Language Toggle Button */}
            <button
                onClick={handleToggle}
                disabled={isChanging}
                className="group relative flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 hover:border-neon-blue/50 transition-all duration-300 hover:scale-105"
            >
                <Globe className="w-5 h-5 text-neon-blue group-hover:rotate-12 transition-transform duration-300" />

                <div className="flex items-center gap-1">
                    <span className={`text-sm font-semibold transition-all duration-300 ${language === 'ar' ? 'text-white' : 'text-gray-500'}`}>
                        ع
                    </span>
                    <span className="text-gray-500 text-xs">/</span>
                    <span className={`text-sm font-semibold transition-all duration-300 ${language === 'en' ? 'text-white' : 'text-gray-500'}`}>
                        EN
                    </span>
                </div>

                {/* Animated Indicator */}
                <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-neon-blue to-neon-violet transition-all duration-300 ${language === 'ar' ? 'w-1/2' : 'w-1/2 translate-x-full'
                        }`}
                />
            </button>
        </div>
    )
}

export default LanguageSwitcher
