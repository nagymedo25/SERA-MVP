import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import useSimulationStore from '../store/simulationStore'
import { TrendingUp, Brain, Code, Heart, Award, Calendar } from 'lucide-react'
import { skillCategories } from '../data/mockData'
import Navbar from '../components/Navbar'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const ReportsPage = () => {
    const { t } = useLanguage()
    const { assessmentHistory, completedLessons, user } = useSimulationStore()
    const chartRefs = useRef([])
    const heatmapRef = useRef(null)

    // Mock progress data
    const progressData = [
        { week: 'Week 1', stress: 75, focus: 45, codeQuality: 50 },
        { week: 'Week 2', stress: 65, focus: 55, codeQuality: 60 },
        { week: 'Week 3', stress: 55, focus: 65, codeQuality: 65 },
        { week: 'Week 4', stress: 45, focus: 75, codeQuality: 75 },
        { week: 'Week 5', stress: 35, focus: 80, codeQuality: 80 },
    ]

    const skillData = skillCategories.map((skill) => ({
        ...skill,
        proficiency: Math.floor(Math.random() * 50) + 40, // Mock proficiency
    }))

    useEffect(() => {
        // Animate charts on scroll
        chartRefs.current.forEach((chart, index) => {
            if (!chart) return

            gsap.fromTo(
                chart,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: chart,
                        start: 'top center+=100',
                        toggleActions: 'play none none reverse',
                    },
                    delay: index * 0.2,
                }
            )
        })

        // Animate heatmap
        if (heatmapRef.current) {
            const cells = heatmapRef.current.querySelectorAll('.heatmap-cell')
            gsap.fromTo(
                cells,
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: heatmapRef.current,
                        start: 'top center+=100',
                        toggleActions: 'play none none reverse',
                    },
                }
            )
        }
    }, [])

    const getSkillColor = (proficiency) => {
        if (proficiency >= 80) return 'bg-green-500'
        if (proficiency >= 60) return 'bg-yellow-500'
        if (proficiency >= 40) return 'bg-orange-500'
        return 'bg-red-500'
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-5xl font-bold mb-4">{t('reports.title')}</h1>
                        <p className="text-xl text-gray-400">{t('reports.subtitle')}</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div
                            ref={(el) => (chartRefs.current[0] = el)}
                            className="glass rounded-2xl p-6 border border-white/10"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center">
                                    <Code className="w-6 h-6 text-neon-blue" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">{t('reports.completedLessons')}</div>
                                    <div className="text-3xl font-bold">{completedLessons.length}</div>
                                </div>
                            </div>
                        </div>

                        <div
                            ref={(el) => (chartRefs.current[1] = el)}
                            className="glass rounded-2xl p-6 border border-white/10"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">{t('reports.improvementRate')}</div>
                                    <div className="text-3xl font-bold">+38%</div>
                                </div>
                            </div>
                        </div>

                        <div
                            ref={(el) => (chartRefs.current[2] = el)}
                            className="glass rounded-2xl p-6 border border-white/10"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <Brain className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">{t('reports.focusLevel')}</div>
                                    <div className="text-3xl font-bold">80%</div>
                                </div>
                            </div>
                        </div>

                        <div
                            ref={(el) => (chartRefs.current[3] = el)}
                            className="glass rounded-2xl p-6 border border-white/10"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-pink-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">{t('reports.stressImprovement')}</div>
                                    <div className="text-3xl font-bold text-green-400">-53%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Stress Levels Chart */}
                        <div
                            ref={(el) => (chartRefs.current[4] = el)}
                            className="glass rounded-3xl p-8 border border-white/10"
                        >
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-pink-400" />
                                {t('reports.stressLevel')}
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={progressData}>
                                    <XAxis dataKey="week" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="stress"
                                        stroke="#ec4899"
                                        strokeWidth={3}
                                        dot={{ fill: '#ec4899', r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Focus Levels Chart */}
                        <div
                            ref={(el) => (chartRefs.current[5] = el)}
                            className="glass rounded-3xl p-8 border border-white/10"
                        >
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Brain className="w-6 h-6 text-purple-400" />
                                {t('reports.focusLevel')}
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={progressData}>
                                    <XAxis dataKey="week" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="focus"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        dot={{ fill: '#8b5cf6', r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Code Quality Chart */}
                        <div
                            ref={(el) => (chartRefs.current[6] = el)}
                            className="glass rounded-3xl p-8 border border-white/10 lg:col-span-2"
                        >
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Code className="w-6 h-6 text-neon-blue" />
                                {t('reports.codeQuality')}
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={progressData}>
                                    <XAxis dataKey="week" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="codeQuality"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ fill: '#3b82f6', r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Skills Heatmap */}
                    <div
                        ref={heatmapRef}
                        className="glass rounded-3xl p-8 border border-white/10"
                    >
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            <Award className="w-6 h-6 text-yellow-400" />
                            {t('reports.skillsHeatmap')}
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {skillData.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="heatmap-cell glass rounded-xl p-4 border border-white/10 hover:scale-105 transition-transform cursor-pointer"
                                >
                                    <div className="text-sm text-gray-400 mb-2">{skill.name}</div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="text-2xl font-bold">{skill.proficiency}%</div>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${getSkillColor(skill.proficiency)} transition-all duration-500`}
                                            style={{ width: `${skill.proficiency}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportsPage
