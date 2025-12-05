import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Code, Server, Smartphone, Brain, Lock } from 'lucide-react'
import Navbar from '../components/Navbar'

const DomainSelection = () => {
    const navigate = useNavigate()
    const cardsRef = useRef([])

    const domains = [
        { id: 'frontend', icon: Code, title: 'Front-end Development', status: 'open', color: 'from-cyan-400 to-blue-500', desc: 'React, Tailwind, State Management' },
        { id: 'backend', icon: Server, title: 'Back-end Development', status: 'locked', color: 'from-purple-500 to-pink-600', desc: 'Node.js, Databases, API Design' },
        { id: 'mobile', icon: Smartphone, title: 'Mobile Development', status: 'locked', color: 'from-green-400 to-emerald-500', desc: 'React Native, Flutter' },
        { id: 'ai', icon: Brain, title: 'AI & Data Science', status: 'locked', color: 'from-orange-400 to-red-500', desc: 'Python, ML, Data Analysis' },
    ]

    useEffect(() => {
        // أنيميشن دخول الكروت
        gsap.fromTo(cardsRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        )
    }, [])

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6 flex items-center justify-center relative overflow-hidden">
                {/* خلفية جمالية */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-10 right-10 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-neon-violet/5 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl w-full z-10">
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold">
                            اختر <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-violet">مجالك</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            حدد المسار الذي تريد تقييمه. حالياً، نركز على واجهات المستخدم لضمان أدق النتائج.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {domains.map((domain, index) => {
                            const Icon = domain.icon
                            const isOpen = domain.status === 'open'

                            return (
                                <button
                                    key={domain.id}
                                    ref={el => cardsRef.current[index] = el}
                                    disabled={!isOpen}
                                    onClick={() => isOpen && navigate('/assessment')} // يوجه لصفحة الاختبار
                                    className={`relative group p-8 rounded-3xl border text-left transition-all duration-500
                                        ${isOpen
                                            ? 'glass border-white/10 hover:border-neon-blue/50 hover:scale-105 cursor-pointer'
                                            : 'bg-slate-900/50 border-white/5 opacity-60 cursor-not-allowed grayscale'
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-6 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-xl font-bold mb-2">{domain.title}</h3>
                                    <p className="text-sm text-gray-400 mb-4">{domain.desc}</p>
                                    
                                    <div className={`text-xs font-mono py-1 px-3 rounded-full w-fit ${isOpen ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-500'}`}>
                                        {isOpen ? 'متاح الآن' : 'قريباً'}
                                    </div>

                                    {!isOpen && (
                                        <div className="absolute top-4 right-4 bg-black/60 p-2 rounded-full backdrop-blur-md border border-white/10">
                                            <Lock className="w-4 h-4 text-gray-400" />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DomainSelection