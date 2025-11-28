import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import {
    Brain,
    Code,
    Heart,
    Activity,
    TrendingUp,
    Coffee,
    Wind,
    Zap,
    Target,
    BarChart3
} from 'lucide-react'

// Register GSAP Flip plugin
gsap.registerPlugin(Flip)

// Mock Data
const MOCK_DATA = {
    modes: {
        highFocus: {
            name: 'High Focus',
            orbColor: 'from-cyan-400 to-blue-500',
            pulseSpeed: 2,
            pulseScale: 1.2,
            stats: {
                cognitiveLoad: 85,
                codeQuality: 92,
                mood: 'Energized'
            }
        },
        burnout: {
            name: 'Burnout',
            orbColor: 'from-orange-600 to-red-700',
            pulseSpeed: 4,
            pulseScale: 1.05,
            stats: {
                cognitiveLoad: 95,
                codeQuality: 65,
                mood: 'Exhausted'
            }
        },
        anxiety: {
            name: 'Anxiety',
            orbColor: 'from-purple-500 to-pink-600',
            pulseSpeed: 0.8,
            pulseScale: 1.3,
            stats: {
                cognitiveLoad: 92,
                codeQuality: 70,
                mood: 'Overwhelmed'
            }
        }
    },
    tasks: [
        { id: 1, title: 'Learn Recursion', type: 'technical', priority: { highFocus: 1, burnout: 4, anxiety: 3 } },
        { id: 2, title: 'Breathing Exercise', type: 'wellness', priority: { highFocus: 5, burnout: 1, anxiety: 1 } },
        { id: 3, title: 'Debug Challenge', type: 'technical', priority: { highFocus: 2, burnout: 5, anxiety: 4 } },
        { id: 4, title: 'Meditation Session', type: 'psychology', priority: { highFocus: 6, burnout: 2, anxiety: 2 } },
        { id: 5, title: 'Code Review', type: 'technical', priority: { highFocus: 3, burnout: 6, anxiety: 5 } },
        { id: 6, title: 'Walk Outside', type: 'wellness', priority: { highFocus: 7, burnout: 3, anxiety: 6 } },
    ]
}

const Dashboard = () => {
    const [currentMode, setCurrentMode] = useState('highFocus')
    const [sortedTasks, setSortedTasks] = useState([])
    const orbRef = useRef(null)
    const taskListRef = useRef(null)
    const statsRefs = useRef([])

    const currentModeData = MOCK_DATA.modes[currentMode]

    // Initialize tasks
    useEffect(() => {
        const sorted = [...MOCK_DATA.tasks].sort((a, b) =>
            a.priority[currentMode] - b.priority[currentMode]
        )
        setSortedTasks(sorted)
    }, [])

    // Orb pulsing animation
    useEffect(() => {
        if (!orbRef.current) return

        const tl = gsap.timeline({ repeat: -1, yoyo: true })
        tl.to(orbRef.current, {
            scale: currentModeData.pulseScale,
            duration: currentModeData.pulseSpeed,
            ease: 'power1.inOut'
        })

        return () => tl.kill()
    }, [currentMode, currentModeData])

    // Stats animation on mount
    useEffect(() => {
        statsRefs.current.forEach((stat, index) => {
            if (!stat) return
            gsap.fromTo(stat,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'power3.out'
                }
            )
        })
    }, [currentMode])

    // GSAP Flip for task reordering
    const handleModeChange = (newMode) => {
        if (!taskListRef.current) return

        // Capture current state
        const state = Flip.getState(taskListRef.current.children)

        // Update mode and sort tasks
        setCurrentMode(newMode)
        const sorted = [...MOCK_DATA.tasks].sort((a, b) =>
            a.priority[newMode] - b.priority[newMode]
        )
        setSortedTasks(sorted)

        // Animate to new state with Flip
        setTimeout(() => {
            Flip.from(state, {
                duration: 0.7,
                ease: 'power2.inOut',
                stagger: 0.05,
                absolute: true
            })
        }, 10)
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-20 glass border-r border-white/10 flex flex-col items-center py-8 gap-6 z-50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">
                    <Target className="w-5 h-5 text-gray-400" />
                </div>
                <div className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">
                    <Activity className="w-5 h-5 text-gray-400" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-20 p-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Intelligence Hub</h1>
                    <p className="text-gray-400">AI-Powered Daily Schedule • Adapting to Your Psychological State</p>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Energy Orb Widget */}
                    <div className="glass rounded-3xl p-8 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className={`absolute inset-0 bg-gradient-to-br ${currentModeData.orbColor} blur-3xl`} />
                        </div>

                        <div className="relative z-10 text-center">
                            <h3 className="text-lg font-semibold mb-6 text-gray-300">Energy State</h3>

                            {/* Breathing Orb */}
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
                                {currentModeData.name}
                            </div>
                        </div>
                    </div>

                    {/* Smart Task Queue */}
                    <div className="lg:col-span-2 glass rounded-3xl p-8 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Smart Task Queue</h3>
                            <div className="text-sm text-gray-400">Auto-prioritized by AI</div>
                        </div>

                        <div ref={taskListRef} className="space-y-3">
                            {sortedTasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold">{task.title}</div>
                                        <div className="text-xs text-gray-500 capitalize">{task.type}</div>
                                    </div>
                                    {task.type === 'technical' && <Code className="w-5 h-5 text-cyan-400" />}
                                    {task.type === 'wellness' && <Wind className="w-5 h-5 text-green-400" />}
                                    {task.type === 'psychology' && <Brain className="w-5 h-5 text-purple-400" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div
                        ref={(el) => (statsRefs.current[0] = el)}
                        className="glass rounded-3xl p-6 border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">Cognitive Load</div>
                                <div className="text-3xl font-bold">{currentModeData.stats.cognitiveLoad}%</div>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-700"
                                style={{ width: `${currentModeData.stats.cognitiveLoad}%` }}
                            />
                        </div>
                    </div>

                    <div
                        ref={(el) => (statsRefs.current[1] = el)}
                        className="glass rounded-3xl p-6 border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">Code Quality</div>
                                <div className="text-3xl font-bold">{currentModeData.stats.codeQuality}%</div>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-700"
                                style={{ width: `${currentModeData.stats.codeQuality}%` }}
                            />
                        </div>
                    </div>

                    <div
                        ref={(el) => (statsRefs.current[2] = el)}
                        className="glass rounded-3xl p-6 border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">Current Mood</div>
                                <div className="text-2xl font-bold">{currentModeData.stats.mood}</div>
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
                    </div>
                </div>
            </main>

            {/* Simulation Control Panel */}
            <div className="fixed bottom-8 right-8 glass rounded-2xl p-6 border border-white/10 backdrop-blur-xl z-50 shadow-2xl">
                <div className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                    <Coffee className="w-4 h-4" />
                    Demo Simulation Controls
                </div>
                <div className="space-y-2">
                    <button
                        onClick={() => handleModeChange('highFocus')}
                        className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${currentMode === 'highFocus'
                                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                                : 'bg-white/5 hover:bg-white/10 text-gray-400'
                            }`}
                    >
                        🎯 High Focus Mode
                    </button>
                    <button
                        onClick={() => handleModeChange('burnout')}
                        className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${currentMode === 'burnout'
                                ? 'bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-lg'
                                : 'bg-white/5 hover:bg-white/10 text-gray-400'
                            }`}
                    >
                        🔥 Burnout Mode
                    </button>
                    <button
                        onClick={() => handleModeChange('anxiety')}
                        className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${currentMode === 'anxiety'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                                : 'bg-white/5 hover:bg-white/10 text-gray-400'
                            }`}
                    >
                        ⚡ Anxiety Mode
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
