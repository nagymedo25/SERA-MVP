import React, { useRef, useState, useEffect } from 'react'
import { useLocation, Routes } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const ColumnTransition = ({ children }) => {
    const location = useLocation()
    const containerRef = useRef(null)
    
    // الحالة المعروضة حالياً
    const [displayLocation, setDisplayLocation] = useState(location)
    
    // مرجع لآخر رابط حقيقي (لتتبع التغييرات أثناء الانميشن)
    const latestLocation = useRef(location)
    
    // قفل الانميشن
    const isAnimating = useRef(false)

    // تحديث المرجع دائماً عند تغير الرابط الحقيقي
    useEffect(() => {
        latestLocation.current = location
    }, [location])

    const columns = Array.from({ length: 5 }, (_, i) => i)

    const { contextSafe } = useGSAP({ scope: containerRef })

    // دالة تشغيل الانتقال (منفصلة ليمكن استدعاؤها عند إعادة المحاولة)
    const playTransition = contextSafe((targetLocation) => {
        // حماية: لا تبدأ إذا كان يعمل بالفعل
        if (isAnimating.current) return
        isAnimating.current = true

        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating.current = false
                
                // ✅ اللحظة الحاسمة: التحقق من التطابق بعد الانتهاء
                // هل الرابط الحقيقي (latest) يختلف عن الرابط الذي عرضناه (target)؟
                // هذا يحدث عند التوجيه التلقائي من Onboarding -> Login
                if (latestLocation.current.pathname !== targetLocation.pathname) {
                    // تشغيل الانميشن مرة أخرى فوراً للذهاب للرابط الصحيح
                    playTransition(latestLocation.current)
                } else {
                    // تنظيف نهائي فقط إذا استقرت الصفحة
                    gsap.set(".col-bar", { clearProps: "all" })
                    gsap.set(containerRef.current, { pointerEvents: 'none' })
                }
            }
        })

        // إعداد الطبقة
        gsap.set(containerRef.current, { zIndex: 9999, pointerEvents: 'all' })
        
        // إغلاق الستائر
        tl.to(".col-bar", {
            scaleY: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "power4.inOut"
        })

        // تبديل الصفحة في الخلفية
        tl.call(() => {
            setDisplayLocation(targetLocation)
            window.scrollTo(0, 0)
        })
        
        // تأخير بسيط لضمان الريندر
        tl.to({}, { duration: 0.1 })

        // فتح الستائر
        tl.to(".col-bar", {
            scaleY: 0,
            duration: 0.5,
            stagger: 0.05,
            transformOrigin: (i) => i % 2 === 0 ? "bottom center" : "top center",
            ease: "power4.inOut"
        })
    })

    // مراقبة تغيير الرابط وتشغيل الانميشن
    useEffect(() => {
        if (location.pathname !== displayLocation.pathname) {
            playTransition(location)
        }
    }, [location, playTransition, displayLocation])

    return (
        <>
            <div 
                ref={containerRef} 
                className="fixed inset-0 w-full h-full pointer-events-none flex flex-row z-[9999]"
            >
                {columns.map((i) => (
                    <div 
                        key={i}
                        className="col-bar flex-1 h-full bg-slate-950 relative border-x border-white/5 scale-y-0"
                    >
                        <div className={`absolute w-full h-1 bg-neon-blue shadow-[0_0_15px_rgba(0,217,255,0.8)] ${i % 2 === 0 ? 'bottom-0' : 'top-0'}`} />
                    </div>
                ))}
            </div>

            <Routes location={displayLocation}>
                {children}
            </Routes>
        </>
    )
}

export default ColumnTransition