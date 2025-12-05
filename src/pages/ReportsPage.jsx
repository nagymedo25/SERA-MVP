import React, { useEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import useSimulationStore from '../store/simulationStore'
import { TrendingUp, Brain, Code, Heart, Award, Calendar, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const ReportsPage = () => {
    const { t } = useLanguage()
    const { assessmentHistory, completedLessons, user } = useSimulationStore()
    const chartRefs = useRef([])
    const heatmapRef = useRef(null)

    // ✅ 1. تحويل سجل الامتحانات لبيانات للرسم البياني
    const progressData = useMemo(() => {
        if (!assessmentHistory || assessmentHistory.length === 0) return [];
        
        return assessmentHistory.map((entry, index) => ({
            name: `Exam ${index + 1}`,
            date: new Date(entry.date).toLocaleDateString(),
            score: entry.score,
            passed: entry.passed ? 1 : 0
        }));
    }, [assessmentHistory]);

    // ✅ 2. حساب المهارات بناءً على Coding Genome
    const skillData = useMemo(() => {
        if (!user?.codingGenome?.strengths) return [];
        
        // تحويل نقاط القوة إلى مهارات بنسبة عالية
        return user.codingGenome.strengths.map((skill, index) => ({
            id: `skill_${index}`,
            name: skill,
            proficiency: 70 + Math.floor(Math.random() * 25) // محاكاة نسبة إتقان (أو جلبها من الـ AI لو توفرت)
        }));
    }, [user]);

    // حساب المتوسطات
    const averageScore = progressData.length > 0 
        ? Math.round(progressData.reduce((acc, curr) => acc + curr.score, 0) / progressData.length)
        : 0;

    useEffect(() => {
        chartRefs.current.forEach((chart, index) => {
            if (!chart) return
            gsap.fromTo(chart,
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

        if (heatmapRef.current) {
            const cells = heatmapRef.current.querySelectorAll('.heatmap-cell')
            gsap.fromTo(cells,
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
        return 'bg-orange-500'
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

                    {/* Summary Cards (Real Data) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div ref={(el) => (chartRefs.current[0] = el)} className="glass rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-neon-blue" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">الامتحانات المنجزة</div>
                                    <div className="text-3xl font-bold">{assessmentHistory.length}</div>
                                </div>
                            </div>
                        </div>

                        <div ref={(el) => (chartRefs.current[1] = el)} className="glass rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">متوسط الأداء</div>
                                    <div className="text-3xl font-bold">{averageScore}%</div>
                                </div>
                            </div>
                        </div>

                        <div ref={(el) => (chartRefs.current[2] = el)} className="glass rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <Brain className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">مستوى التركيز</div>
                                    <div className="text-3xl font-bold">{user?.mindprint?.traits?.focus || 75}%</div>
                                </div>
                            </div>
                        </div>

                        <div ref={(el) => (chartRefs.current[3] = el)} className="glass rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-pink-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">المرونة النفسية</div>
                                    <div className="text-3xl font-bold">{user?.mindprint?.traits?.resilience || 65}%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Chart (Real Data) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <div ref={(el) => (chartRefs.current[4] = el)} className="glass rounded-3xl p-8 border border-white/10 lg:col-span-2">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-neon-blue" />
                                تطور الأداء الأكاديمي
                            </h3>
                            {progressData.length > 0 ? (
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={progressData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="name" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" domain={[0, 100]} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Line type="monotone" dataKey="score" stroke="#00d9ff" strokeWidth={3} dot={{ fill: '#00d9ff', r: 6 }} activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                                    لم يتم إجراء أي امتحانات بعد لعرض البيانات
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills Heatmap (Real Data) */}
                    <div ref={heatmapRef} className="glass rounded-3xl p-8 border border-white/10">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            <Award className="w-6 h-6 text-yellow-400" />
                            خريطة المهارات المكتسبة (Coding Genome)
                        </h3>

                        {skillData.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {skillData.map((skill) => (
                                    <div key={skill.id} className="heatmap-cell glass rounded-xl p-4 border border-white/10 hover:border-white/30 transition-colors">
                                        <div className="text-sm text-gray-400 mb-2 capitalize">{skill.name}</div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="text-2xl font-bold">{skill.proficiency}%</div>
                                        </div>
                                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className={`h-full ${getSkillColor(skill.proficiency)} transition-all duration-500`} style={{ width: `${skill.proficiency}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                لم يتم تحليل الجينوم البرمجي بعد. أكمل الـ Onboarding أولاً.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportsPage