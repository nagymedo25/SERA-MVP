import React, { useEffect, useState } from 'react'
import { AlertTriangle, ShieldAlert, Lock, Activity } from 'lucide-react'
import gsap from 'gsap'

const SecurityMonitor = ({ onViolation, isActive }) => {
    const [violationType, setViolationType] = useState(null)

    useEffect(() => {
        if (!isActive) return

        const handleKeyDown = (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                triggerViolation('DEV_TOOLS_ATTEMPT');
            }
        };

        const handleVisibilityChange = () => { if (document.hidden) triggerViolation('TAB_SWITCH') }
        const handleBlur = () => { triggerViolation('WINDOW_FOCUS_LOST') }
        const handleResize = () => { if (Math.abs(window.outerWidth - window.innerWidth) > 100) triggerViolation('BROWSER_RESIZE') }
        const handleMouseLeave = () => { triggerViolation('MOUSE_LEFT_AREA') }
        const preventActions = (e) => { e.preventDefault(); }
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('blur', handleBlur)
        window.addEventListener('resize', handleResize)
        document.addEventListener('mouseleave', handleMouseLeave)
        document.addEventListener('contextmenu', preventActions)
        document.addEventListener('copy', preventActions)
        document.addEventListener('cut', preventActions)
        document.addEventListener('paste', preventActions)
        document.addEventListener('selectstart', preventActions)

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('blur', handleBlur)
            window.removeEventListener('resize', handleResize)
            document.removeEventListener('mouseleave', handleMouseLeave)
            document.removeEventListener('contextmenu', preventActions)
            document.removeEventListener('copy', preventActions)
            document.removeEventListener('cut', preventActions)
            document.removeEventListener('paste', preventActions)
            document.removeEventListener('selectstart', preventActions)
        }
    }, [isActive])

    const triggerViolation = (type) => {
        if (violationType) return;
        setViolationType(type)
        if (onViolation) onViolation(type)
        gsap.fromTo('.security-overlay', { opacity: 0 }, { opacity: 1, duration: 0.2 })
    }

    const clearViolation = () => {
        gsap.to('.security-overlay', {
            opacity: 0,
            duration: 0.3,
            onComplete: () => setViolationType(null)
        })
    }

    if (!violationType) return null

    return (
        <div className="security-overlay fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-8 overflow-hidden">
            {/* خلفية شبكية متحركة */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.05)_1px,transparent_1px)] bg-[size:30px_30px] animate-[pulse_3s_infinite]" />
            
            {/* حواف حمراء متوهجة */}
            <div className="absolute inset-0 border-[10px] border-red-900/50 pointer-events-none shadow-[inset_0_0_100px_rgba(239,68,68,0.5)]" />

            <div className="relative bg-black/80 p-12 md:p-16 rounded-[2rem] border border-red-500/50 shadow-[0_0_80px_rgba(239,68,68,0.4)] max-w-3xl w-full transform scale-100">
                {/* أيقونة القفل والهوية */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-slate-950 border-2 border-red-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                    <Lock className="w-8 h-8 text-red-500 animate-pulse" />
                </div>

                <div className="flex flex-col items-center">
                    <ShieldAlert className="w-24 h-24 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase glitch-text" data-text="SYSTEM LOCKDOWN">
                        <span className="text-red-500">SYSTEM</span> LOCKDOWN
                    </h1>
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent my-6 opacity-50" />
                    
                    <p className="text-xl md:text-2xl text-red-100 font-mono mb-8 leading-relaxed">
                        {violationType === 'DEV_TOOLS_ATTEMPT' && 'SECURITY ALERT: Developer tools detected.'}
                        {violationType === 'TAB_SWITCH' && 'WARNING: Focus lost. Tab switching is prohibited.'}
                        {violationType === 'WINDOW_FOCUS_LOST' && 'ATTENTION: Please keep focus on the exam window.'}
                        {violationType === 'BROWSER_RESIZE' && 'VIOLATION: Browser resizing is not allowed.'}
                        {violationType === 'MOUSE_LEFT_AREA' && 'ALERT: Mouse cursor left the secure zone.'}
                        {violationType === 'SOURCE_CODE_ATTEMPT' && 'DENIED: Source code access is restricted.'}
                    </p>

                    <div className="flex items-center gap-2 text-red-400 font-mono text-sm mb-8 bg-red-950/30 px-4 py-2 rounded-lg border border-red-900">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span>EVENT_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} // MONITORING_ACTIVE</span>
                    </div>
                    
                    <button 
                        onClick={clearViolation}
                        className="group relative px-12 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xl shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all hover:scale-105 overflow-hidden"
                    >
                        <span className="relative z-10">RESUME SESSION</span>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 group-hover:opacity-40 transition-opacity" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SecurityMonitor