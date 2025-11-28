import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
    Brain,
    Code,
    Heart,
    TrendingUp,
    Coffee,
    Wind,
    Zap,
    BookOpen,
    Award
} from 'lucide-react'
import Navbar from './Navbar'
import MagneticButton from './MagneticButton'
import AnimatedCard from './AnimatedCard'
import useSimulationStore from '../store/simulationStore'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

// Register GSAP plugins
gsap.registerPlugin(Flip, ScrollTrigger)

// Mock Data
const MOCK_DATA = {
    modes: {
        highFocus: {
            name: 'dashboard.modes.highFocus',
            orbColor: 'from-cyan-400 to-blue-500',
            pulseSpeed: 2,
            pulseScale: 1.2,
            stats: {
                cognitiveLoad: 85,
                codeQuality: 92,
                mood: 'dashboard.moods.energetic'
            }
        },
        burnout: {
            name: 'dashboard.modes.burnout',
            orbColor: 'from-orange-600 to-red-700',
            pulseSpeed: 4,
            pulseScale: 1.05,
            stats: {
                cognitiveLoad: 95,
                codeQuality: 65,
                mood: 'dashboard.moods.exhausted'
            }
        },
        anxiety: {
            name: 'dashboard.modes.anxiety',
            orbColor: 'from-purple-500 to-pink-600',
            pulseSpeed: 0.8,
            pulseScale: 1.3,
            stats: {
                cognitiveLoad: 92,
                codeQuality: 70,
                mood: 'dashboard.moods.anxious'
            }
        }
    },
    tasks: [
        { id: 1, title: 'dashboard.tasks.recursion', type: 'technical', priority: { highFocus: 1, burnout: 4, anxiety: 3 } },
        { id: 2, title: 'dashboard.tasks.breathing', type: 'wellness', priority: { highFocus: 5, burnout: 1, anxiety: 1 } },
        { id: 3, title: 'dashboard.tasks.debug', type: 'technical', priority: { highFocus: 2, burnout: 5, anxiety: 4 } },
        { id: 4, title: 'dashboard.tasks.meditation', type: 'psychology', priority: { highFocus: 6, burnout: 2, anxiety: 2 } },
        { id: 5, title: 'dashboard.tasks.codeReview', type: 'technical', priority: { highFocus: 3, burnout: 6, anxiety: 5 } },
        { id: 6, title: 'dashboard.tasks.walk', type: 'wellness', priority: { highFocus: 7, burnout: 3, anxiety: 6 } },
    ]
}

const Dashboard = () => {
    const { t } = useLanguage()
    const navigate = useNavigate()
    const { user, currentMode: storeMode, setCurrentMode: setStoreMode } = useSimulationStore()
    const validModes = ['highFocus', 'burnout', 'anxiety']
    const initialMode = validModes.includes(storeMode) ? storeMode : 'highFocus'
    const [currentMode, setCurrentMode] = useState(initialMode)
    const [sortedTasks, setSortedTasks] = useState([])
    const orbRef = useRef(null)
    const taskListRef = useRef(null)
    const statsRefs = useRef([])
    const headerRef = useRef(null)
    const statsContainerRef = useRef(null)

    const currentModeData = MOCK_DATA.modes[currentMode]

    // Initialize tasks
    useEffect(() => {
        const sorted = [...MOCK_DATA.tasks].sort((a, b) =>
            a.priority[currentMode] - b.priority[currentMode]
        )
        setSortedTasks(sorted)
    }, [currentMode])

    // Header and Stats ScrollTrigger animation
    useEffect(() => {
        if (headerRef.current) {
            gsap.set(headerRef.current.children, { opacity: 0, y: 30 })
            gsap.to(headerRef.current.children, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                delay: 0.3
            })
        }

        if (statsContainerRef.current) {
            ScrollTrigger.create({
                trigger: statsContainerRef.current,
                start: 'top 80%',
                onEnter: () => {
                    gsap.set(statsContainerRef.current.children, { opacity: 0, scale: 0.8 })
                    gsap.to(statsContainerRef.current.children, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.15,
                        ease: 'back.out(1.4)'
                    })
                },
                once: true
            })
        }

        return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }, [])

    // Advanced Orb pulsing animation
    useEffect(() => {
        if (!orbRef.current) return

        const tl = gsap.timeline({ repeat: -1, yoyo: true })

        tl.to(orbRef.current, {
            scale: currentModeData.pulseScale,
            duration: currentModeData.pulseSpeed,
            ease: 'sine.inOut'
        })

        gsap.to(orbRef.current, {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: 'none'
        })

        return () => tl.kill()
    }, [currentMode, currentModeData])

    // Stats animation on mode change
    useEffect(() => {
        statsRefs.current.forEach((stat, index) => {
            if (!stat) return

            gsap.set(stat, { opacity: 0, y: 20 })
            gsap.to(stat, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power3.out'
            })
        })
    }, [currentMode])

    // GSAP Flip for task reordering
    const handleModeChange = (newMode) => {
        if (!taskListRef.current) return

        const state = Flip.getState(taskListRef.current.children)

        setCurrentMode(newMode)
        setStoreMode(newMode)
        const sorted = [...MOCK_DATA.tasks].sort((a, b) =>
            a.priority[newMode] - b.priority[newMode]
        )
        setSortedTasks(sorted)

        setTimeout(() => {
            Flip.from(state, {
                duration: 0.7,
                ease: 'power2.inOut',
                stagger: 0.05,
                absolute: true,
                onComplete: () => {
                    gsap.to(taskListRef.current.children, {
                        scale: 1.05,
                        duration: 0.2,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.inOut'
                    })
                }
            })
        }, 10)
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white font-sans pt-24">
                {/* Background Orbs */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-20 left-10 w-96 h-96 gradient-orb-1 animate-float" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 gradient-orb-2 animate-float" style={{ animationDelay: '2s' }} />
                </div>

                {/* Main Content */}
                <main className="relative z-10 p-8 max-w-7xl mx-auto">
                    {/* Header */}
                    <header ref={headerRef} className="mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-5xl md:text-6xl font-bold">
                                {t('dashboard.greeting')}، {user?.name || 'Mahmoud'} 👋
                            </h1>
                        </div>
                        <p className="text-xl text-gray-400">{t('dashboard.subtitle')}</p>
                    </header>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Energy Orb Widget */}
                        <AnimatedCard className="glass rounded-3xl p-8 border border-white/10">
                            <div className="relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${currentModeData.orbColor} blur-3xl`} />
                                </div>

                                <div className="relative z-10 text-center">
                                    <h3 className="text-lg font-semibold mb-6 text-gray-300">{t('dashboard.currentStatus')}</h3>

                                    <div className="relative w-48 h-48 mx-auto mb-6">
                                        <div
                                            ref={orbRef}
                                            className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentModeData.orbColor} blur-md`}
                                            style={{ transform: 'scale(1)' }}
                                        />
                                        <div className={`absolute inset-4 rounded-full bg-gradient-to-br ${currentModeData.orbColor} flex items-center justify-center`}>
                                            <Heart className="w-16 h-16 text-white/90" />
                                        </div>
                                    </div>

                                    <div className={`text-2xl font-bold bg-gradient-to-r ${currentModeData.orbColor} bg-clip-text text-transparent`}>
                                        {t(currentModeData.name)}
                                    </div>
                                </div>
                            </div>
                        </AnimatedCard>

                        {/* Quick Actions */}
                        <AnimatedCard className="lg:col-span-2 glass rounded-3xl p-8 border border-white/10">
                            <h3 className="text-xl font-bold mb-6">{t('dashboard.quickActions')}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <MagneticButton
                                    onClick={() => navigate('/courses')}
                                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-400 transition-all group"
                                >
                                    <BookOpen className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium">{t('dashboard.actions.courses')}</span>
                                </MagneticButton>

                                <MagneticButton
                                    onClick={() => navigate('/assessment')}
                                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 hover:border-purple-400 transition-all group"
                                >
                                    <Code className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium">{t('dashboard.actions.assessment')}</span>
                                </MagneticButton>

                                <MagneticButton
                                    onClick={() => navigate('/reports')}
                                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30 hover:border-emerald-400 transition-all group"
                                >
                                    <TrendingUp className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium">{t('dashboard.actions.reports')}</span>
                                </MagneticButton>

                                <MagneticButton
                                    onClick={() => navigate('/profile')}
                                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 hover:border-orange-400 transition-all group"
                                >
                                    <Award className="w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium">{t('dashboard.actions.profile')}</span>
                                </MagneticButton>
                            </div>
                        </AnimatedCard>
                    </div>

                    {/* Smart Task Queue */}
                    <div className="mb-8">
                        <AnimatedCard className="glass rounded-3xl p-8 border border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold">{t('dashboard.smartQueue')}</h3>
                                <div className="text-sm text-gray-400">{t('dashboard.smartQueueDesc')}</div>
                            </div>

                            <div ref={taskListRef} className="space-y-3">
                                {sortedTasks.map((task, index) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold">{t(task.title)}</div>
                                            <div className="text-xs text-gray-500 capitalize">{task.type}</div>
                                        </div>
                                        {task.type === 'technical' && <Code className="w-5 h-5 text-cyan-400" />}
                                        {task.type === 'wellness' && <Wind className="w-5 h-5 text-green-400" />}
                                        {task.type === 'psychology' && <Brain className="w-5 h-5 text-purple-400" />}
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>
                    </div>

                    {/* Stats Cards */}
                    <div ref={statsContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AnimatedCard
                            ref={(el) => (statsRefs.current[0] = el)}
                            className="glass rounded-3xl p-6 border border-white/10"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">{t('dashboard.cognitiveLoad')}</div>
                                    <div className="text-3xl font-bold">{currentModeData.stats.cognitiveLoad}%</div>
                                </div>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-700"
                                    style={{ width: `${currentModeData.stats.cognitiveLoad}%` }}
                                />
                            </div>
                        </AnimatedCard>

                        <AnimatedCard
                            ref={(el) => (statsRefs.current[1] = el)}
                            className="glass rounded-3xl p-6 border border-white/10"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">{t('dashboard.codeQuality')}</div>
                                    <div className="text-3xl font-bold">{currentModeData.stats.codeQuality}%</div>
                                </div>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-700"
                                    style={{ width: `${currentModeData.stats.codeQuality}%` }}
                                />
                            </div>
                        </AnimatedCard>

                        <AnimatedCard
                            ref={(el) => (statsRefs.current[2] = el)}
                            className="glass rounded-3xl p-6 border border-white/10"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">{t('dashboard.currentMood')}</div>
                                    <div className="text-2xl font-bold">{t(currentModeData.stats.mood)}</div>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 h-2 rounded-full ${i < Math.floor(currentModeData.stats.cognitiveLoad / 20)
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                                            : 'bg-white/10'
                                            }`}
                                    />
                                ))}
                            </div>
                        </AnimatedCard>
                    </div>
                </main>

                {/* Simulation Control Panel */}
                <div className="fixed bottom-8 right-8 glass rounded-2xl p-6 border border-white/10 backdrop-blur-xl z-50 shadow-2xl">
                    <div className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                        <Coffee className="w-4 h-4" />
                        {t('dashboard.demoControl')}
                    </div>
                    <div className="space-y-2">
                        <MagneticButton
                            onClick={() => handleModeChange('highFocus')}
                            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${currentMode === 'highFocus'
                                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                                : 'bg-white/5 hover:bg-white/10 text-gray-400'
                                }`}
                        >
                            🎯 {t('dashboard.modes.highFocus')}
                        </MagneticButton>
                        <MagneticButton
                            onClick={() => handleModeChange('burnout')}
                            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${currentMode === 'burnout'
                                ? 'bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-lg'
                                : 'bg-white/5 hover:bg-white/10 text-gray-400'
                                }`}
                        >
                            🔥 {t('dashboard.modes.burnout')}
                        </MagneticButton>
                        <MagneticButton
                            onClick={() => handleModeChange('anxiety')}
                            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${currentMode === 'anxiety'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                                : 'bg-white/5 hover:bg-white/10 text-gray-400'
                                }`}
                        >
                            ⚡ {t('dashboard.modes.anxiety')}
                        </MagneticButton>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Dashboard
