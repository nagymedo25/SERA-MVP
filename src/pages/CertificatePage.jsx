import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Download, Share2, CheckCircle, Award } from 'lucide-react'
import Navbar from '../components/Navbar'
import useSimulationStore from '../store/simulationStore'

const CertificatePage = () => {
    const { user } = useSimulationStore()
    const containerRef = useRef(null)
    const certificateRef = useRef(null)

    useEffect(() => {
        const tl = gsap.timeline()

        // 1. دخول الصفحة
        tl.fromTo(containerRef.current, 
            { opacity: 0 }, 
            { opacity: 1, duration: 1 }
        )

        // 2. ظهور الشهادة بشكل ملحمي (Zoom in + Rotation simple)
        tl.fromTo(certificateRef.current,
            { scale: 0.5, rotationX: 90, opacity: 0 },
            { scale: 1, rotationX: 0, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" }
        )

        // 3. تأثير "لمعة" على الشهادة
        tl.to('.shine-effect', {
            x: '200%',
            duration: 1.5,
            ease: 'power2.inOut',
            repeat: 2,
            repeatDelay: 3
        })

    }, [])

    return (
        <>
            <Navbar />
            <div ref={containerRef} className="min-h-screen bg-slate-950 text-white py-24 px-6 flex flex-col items-center justify-center overflow-hidden relative">
                
                {/* خلفية احتفالية */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-blue/20 to-transparent" />
                    <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-violet/20 to-transparent" />
                </div>

                <div className="text-center mb-8 z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 mb-4 animate-bounce">
                        <CheckCircle className="w-4 h-4" />
                        <span>تم اجتياز المسار بنجاح!</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">مبروك يا {user?.name.split(' ')[0]}! 🎉</h1>
                    <p className="text-gray-400">لقد أثبت جدارتك كمطور واجهات أمامية.</p>
                </div>

                {/* جسم الشهادة */}
                <div 
                    ref={certificateRef}
                    className="relative w-full max-w-4xl aspect-[1.414/1] bg-[#fdfbf7] text-slate-900 p-8 md:p-12 rounded-xl shadow-2xl border-8 border-double border-slate-900 overflow-hidden mx-auto"
                >
                    {/* تأثير اللمعة */}
                    <div className="shine-effect absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] transform -translate-x-[150%] pointer-events-none" />

                    <div className="h-full border-2 border-slate-900/10 p-8 flex flex-col items-center justify-between relative">
                        {/* الزخارف */}
                        <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-slate-900" />
                        <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-slate-900" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-slate-900" />
                        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-slate-900" />

                        {/* المحتوى */}
                        <div className="text-center space-y-2 mt-8">
                            <div className="flex justify-center mb-4">
                                <Award className="w-16 h-16 text-slate-900" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-widest uppercase">Certificate</h2>
                            <p className="text-xl font-serif text-slate-600 uppercase tracking-widest">Of Completion</p>
                        </div>

                        <div className="text-center w-full my-8">
                            <p className="text-slate-500 mb-4 font-serif italic">This is to certify that</p>
                            <h3 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 border-b-2 border-slate-300 pb-4 mb-4 mx-12">
                                {user?.name || 'Mahmoud Nagy'}
                            </h3>
                            <p className="text-slate-500 font-serif italic mb-2">Has successfully completed the comprehensive track in</p>
                            <h4 className="text-2xl font-bold text-slate-800">Front-End Engineering</h4>
                        </div>

                        <div className="w-full flex justify-between items-end px-12 pb-4">
                            <div className="text-center">
                                <div className="text-slate-900 font-bold border-t border-slate-900 pt-2 w-32">DATE</div>
                                <div className="text-slate-500 text-sm mt-1">{new Date().toLocaleDateString()}</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <img src="/src/assets/Logo.png" alt="SERA" className="h-12 opacity-80 mix-blend-multiply mb-2" />
                                <div className="text-xs text-slate-400 tracking-widest">VERIFIED BY SERA AI</div>
                            </div>
                            <div className="text-center">
                                <div className="text-slate-900 font-bold border-t border-slate-900 pt-2 w-32">SIGNATURE</div>
                                <div className="text-slate-500 text-sm mt-1 font-serif italic">Sera System</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* أزرار التحكم */}
                <div className="flex gap-4 mt-12">
                    <button className="flex items-center gap-2 px-8 py-4 rounded-xl bg-neon-blue hover:bg-cyan-400 text-slate-900 font-bold transition-all hover:scale-105">
                        <Download className="w-5 h-5" />
                        تحميل PDF
                    </button>
                    <button className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 font-bold transition-all hover:scale-105">
                        <Share2 className="w-5 h-5" />
                        مشاركة على LinkedIn
                    </button>
                </div>
            </div>
        </>
    )
}

export default CertificatePage