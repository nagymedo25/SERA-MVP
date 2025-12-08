import React, { useEffect, useRef } from 'react'
import useSimulationStore from '../store/simulationStore'
import { 
    User, Mail, Calendar, Target, Brain, Code, 
    TrendingUp, Settings, Activity, Hexagon, Shield, Zap, Hash
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { useLanguage } from '../contexts/LanguageContext'
import gsap from 'gsap'

const ProfilePage = () => {
    const { t } = useLanguage()
    const { user } = useSimulationStore()
    const containerRef = useRef(null)
    const statsRef = useRef([])

    // بيانات افتراضية في حال عدم اكتمال التحليل
    const mindprint = user?.mindprint || { traits: { focus: 0, resilience: 0, openness: 0 } }
    const codingGenome = user?.codingGenome || { level: 'Not Analyzed', strengths: [], problemSolvingScore: 0 }
    const lifeTrajectory = user?.lifeTrajectory || { goal: 'Not Set', timeframe: '-', field: '-' }

    // حساب النسبة المئوية للملف الشخصي (مثال)
    const profileCompletion = user?.hasCompletedOnboarding ? 100 : 30;

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. تسلسل دخول العناصر (Header -> Profile Card -> Grids)
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

            tl.fromTo('.anim-header', 
                { y: -50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 }
            )

            tl.fromTo('.anim-card',
                { y: 50, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15 },
                "-=0.4"
            )

            // 2. تحريك أشرطة التقدم (Progress Bars)
            gsap.fromTo('.progress-bar-fill', 
                { width: '0%' },
                { 
                    width: (i, target) => target.dataset.width, 
                    duration: 1.5, 
                    ease: 'power2.out',
                    delay: 0.5 
                }
            )

            // 3. عداد الأرقام (Counter Animation)
            statsRef.current.forEach(stat => {
                if(!stat) return;
                const targetValue = parseInt(stat.innerText, 10) || 0;
                gsap.fromTo(stat, 
                    { innerText: 0 }, 
                    { 
                        innerText: targetValue, 
                        duration: 2, 
                        snap: { innerText: 1 },
                        ease: 'power4.out' 
                    }
                )
            })

        }, containerRef)

        return () => ctx.revert()
    }, [])

    // مكون فرعي لشريط التقدم
    const StatBar = ({ label, value, colorClass, icon: Icon }) => (
        <div className="group">
            <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span className="text-sm font-medium">{label}</span>
                </div>
                <span className="text-white font-mono font-bold">{value}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div 
                    className={`progress-bar-fill h-full rounded-full ${colorClass} relative`} 
                    data-width={`${value}%`}
                >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_white]"></div>
                </div>
            </div>
        </div>
    )

    return (
        <>
            <Navbar />
            <div ref={containerRef} className="min-h-screen bg-slate-950 text-white py-28 px-6 relative overflow-hidden font-sans">
                
                {/* خلفية تقنية متحركة */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.05),transparent_70%)]" />
                    <div className="absolute top-20 right-10 w-96 h-96 bg-neon-violet/10 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-20 left-10 w-80 h-80 bg-neon-blue/10 rounded-full blur-[100px] animate-pulse-slow" />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    
                    {/* Header */}
                    <div className="anim-header flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    {t('profile.title')}
                                </span>
                                <div className="px-3 py-1 rounded-md bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-xs font-mono tracking-widest uppercase">
                                    System Active
                                </div>
                            </h1>
                            <p className="text-gray-400 text-lg">لوحة البيانات المركزية والتحليل الحيوي</p>
                        </div>
                        
                        <button className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/50 hover:bg-neon-blue/10 transition-all duration-300 backdrop-blur-md">
                            <Settings className="w-5 h-5 text-gray-400 group-hover:text-neon-blue group-hover:rotate-90 transition-all duration-500" />
                            <span className="font-medium group-hover:text-white transition-colors">{t('profile.edit')}</span>
                        </button>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* 1. Identity Card (Left Column) */}
                        <div className="anim-card lg:col-span-1 space-y-8">
                            <div className="glass rounded-[2rem] p-8 border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all">
                                {/* Holographic Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    {/* Avatar Wrapper */}
                                    <div className="relative mb-6">
                                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl">
                                            <span className="text-5xl font-bold text-white bg-clip-text bg-gradient-to-br from-white to-slate-500">
                                                {user?.name?.charAt(0) || 'U'}
                                            </span>
                                            {/* Scanning Line */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue/50 shadow-[0_0_15px_#00d9ff] animate-[scan_3s_linear_infinite]" />
                                        </div>
                                        <div className="absolute -bottom-3 -right-3 bg-slate-900 rounded-xl p-2 border border-white/10 shadow-lg">
                                            <Shield className="w-5 h-5 text-green-400" />
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-white mb-1">{user?.name || t('profile.newUser')}</h2>
                                    <p className="text-neon-blue font-mono text-sm mb-6 bg-neon-blue/10 px-3 py-1 rounded-full border border-neon-blue/20">
                                        {codingGenome.level.toUpperCase()} DEVELOPER
                                    </p>

                                    <div className="w-full space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><Mail size={16} /></div>
                                                <span className="text-sm text-gray-300 truncate max-w-[150px]">{user?.email}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400"><Calendar size={16} /></div>
                                                <span className="text-sm text-gray-300">{user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '2025'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Completion Mini-Card */}
                            <div className="anim-card glass rounded-2xl p-6 border border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Profile Status</span>
                                    <span className="text-neon-violet font-mono">{profileCompletion}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="progress-bar-fill h-full bg-gradient-to-r from-neon-blue to-neon-violet" data-width={`${profileCompletion}%`} />
                                </div>
                            </div>
                        </div>

                        {/* 2. Analysis Center (Right Column - Spanning 2 cols) */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Mindprint Section */}
                            <div className="anim-card glass rounded-[2rem] p-8 border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-violet/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                                
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-violet/20 to-purple-900/20 border border-neon-violet/30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                                        <Brain className="w-7 h-7 text-neon-violet" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">Mindprint Analysis</h3>
                                        <p className="text-gray-400 text-sm">البصمة النفسية والسلوكية</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-6">
                                        <StatBar 
                                            label="التركيز (Focus)" 
                                            value={mindprint.traits?.focus || 0} 
                                            colorClass="bg-gradient-to-r from-violet-500 to-fuchsia-500" 
                                            icon={Zap}
                                        />
                                        <StatBar 
                                            label="المرونة (Resilience)" 
                                            value={mindprint.traits?.resilience || 0} 
                                            colorClass="bg-gradient-to-r from-blue-500 to-indigo-500" 
                                            icon={Shield}
                                        />
                                        <StatBar 
                                            label="الانفتاح (Openness)" 
                                            value={mindprint.traits?.openness || 0} 
                                            colorClass="bg-gradient-to-r from-emerald-400 to-teal-500" 
                                            icon={Activity}
                                        />
                                    </div>
                                    
                                    {/* Radar Chart Placeholder / Visual */}
                                    <div className="md:col-span-2 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-center relative p-6">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10" />
                                        {/* Simple visualization of stats */}
                                        <div className="flex gap-4 items-end h-32 w-full justify-around px-8">
                                            {[mindprint.traits?.focus, mindprint.traits?.resilience, mindprint.traits?.openness].map((val, i) => (
                                                <div key={i} className="w-full max-w-[60px] flex flex-col items-center gap-2 group">
                                                    <span ref={el => statsRef.current[i] = el} className="font-mono text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{val || 0}</span>
                                                    <div 
                                                        className="w-full bg-slate-800 rounded-t-lg relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all"
                                                        style={{ height: '100%' }}
                                                    >
                                                        <div 
                                                            className={`progress-bar-fill absolute bottom-0 w-full rounded-t-lg ${i === 0 ? 'bg-violet-500' : i === 1 ? 'bg-blue-500' : 'bg-emerald-500'}`} 
                                                            style={{ height: '0%' }} // Initial state for GSAP
                                                            data-width="100%" // GSAP will animate height manually below
                                                        />
                                                        {/* We handle height animation via inline style for simplicity in this visual block, or use GSAP class targeting */}
                                                        <div 
                                                            className={`absolute bottom-0 w-full transition-all duration-[2000ms] ease-out ${i === 0 ? 'bg-violet-500' : i === 1 ? 'bg-blue-500' : 'bg-emerald-500'}`}
                                                            style={{ height: `${val || 10}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Coding Genome */}
                                <div className="anim-card glass rounded-[2rem] p-8 border border-white/10 hover:border-neon-blue/30 transition-all group">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue group-hover:scale-110 transition-transform">
                                                <Code className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold">Coding Genome</h3>
                                        </div>
                                        <span className="text-neon-blue font-mono text-xl font-bold">
                                            Level <span ref={el => statsRef.current[3] = el}>{codingGenome?.problemSolvingScore ? Math.floor(codingGenome.problemSolvingScore / 10) : 1}</span>
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Top Skills</div>
                                            <div className="flex flex-wrap gap-2">
                                                {codingGenome.strengths && codingGenome.strengths.length > 0 ? (
                                                    codingGenome.strengths.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-white/5 text-xs text-gray-300 hover:border-neon-blue/30 hover:text-neon-blue transition-colors cursor-default">
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-600 italic">No data available</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Life Trajectory */}
                                <div className="anim-card glass rounded-[2rem] p-8 border border-white/10 hover:border-green-500/30 transition-all group">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold">Life Trajectory</h3>
                                    </div>

                                    <div className="space-y-4 relative">
                                        {/* Vertical Line */}
                                        <div className="absolute right-0 top-0 bottom-0 w-px bg-white/5" />
                                        
                                        <div className="relative">
                                            <div className="text-xs text-gray-500 mb-1">الهدف المهني</div>
                                            <div className="text-lg font-bold text-white capitalize">{lifeTrajectory.goal}</div>
                                        </div>
                                        
                                        <div className="w-full h-px bg-white/5" />

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">الإطار الزمني</div>
                                                <div className="font-mono text-green-400">{lifeTrajectory.timeframe}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">التخصص</div>
                                                <div className="font-mono text-white capitalize">{lifeTrajectory.field || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Re-Scan Button */}
                            <div className="anim-card mt-6">
                                <button 
                                    onClick={() => window.location.href = '/onboarding'}
                                    className="w-full py-4 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-3 group"
                                >
                                    <Hexagon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                                    <span>{t('profile.retake.button') || 'إعادة تشغيل التحليل (Re-Scan)'}</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePage