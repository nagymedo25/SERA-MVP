import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
    Brain, Code, Heart, TrendingUp, Coffee, Wind, Zap, BookOpen, Award, PlusCircle
} from 'lucide-react'
import Navbar from './Navbar'
import MagneticButton from './MagneticButton'
import AnimatedCard from './AnimatedCard'
import useSimulationStore from '../store/simulationStore'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(Flip, ScrollTrigger)

const Dashboard = () => {
    const { t } = useLanguage()
    const navigate = useNavigate()
    
    const { 
        user, 
        currentMode, 
        setCurrentMode, 
        dailyTasks, 
        refreshDashboard, 
        isAnalyzing,
        enrolledCourses 
    } = useSimulationStore()

    const taskListRef = useRef(null)
    const headerRef = useRef(null)
    const orbRef = useRef(null)

    const getModeStyles = (mode) => {
        switch(mode) {
            case 'burnout': return { color: 'from-orange-600 to-red-700', icon: '🔥' };
            case 'anxiety': return { color: 'from-purple-500 to-pink-600', icon: '⚡' };
            default: return { color: 'from-cyan-400 to-blue-500', icon: '🎯' };
        }
    }
    const modeStyle = getModeStyles(currentMode);

    useEffect(() => {
        refreshDashboard();
    }, [currentMode]);

    useEffect(() => {
        if (taskListRef.current && dailyTasks.length > 0) {
            gsap.fromTo(taskListRef.current.children, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, [dailyTasks]);

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
    }, [])

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white font-sans pt-24">
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-20 left-10 w-96 h-96 gradient-orb-1 animate-float" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 gradient-orb-2 animate-float" style={{ animationDelay: '2s' }} />
                </div>

                <main className="relative z-10 p-8 max-w-7xl mx-auto">
                    <header ref={headerRef} className="mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-5xl md:text-6xl font-bold">
                                {t('dashboard.greeting')}، {user?.name?.split(' ')[0] || 'مستخدمنَا المبدع'} 👋
                            </h1>
                        </div>
                        <p className="text-xl text-gray-400">{t('dashboard.subtitle')}</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Energy Orb */}
                        <AnimatedCard className="glass rounded-3xl p-8 border border-white/10">
                            <div className="relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${modeStyle.color} blur-3xl`} />
                                </div>
                                <div className="relative z-10 text-center">
                                    <h3 className="text-lg font-semibold mb-6 text-gray-300">{t('dashboard.currentStatus')}</h3>
                                    <div className="relative w-48 h-48 mx-auto mb-6">
                                        <div ref={orbRef} className={`absolute inset-0 rounded-full bg-gradient-to-br ${modeStyle.color} blur-md animate-pulse`} />
                                        <div className={`absolute inset-4 rounded-full bg-gradient-to-br ${modeStyle.color} flex items-center justify-center`}>
                                            <Heart className="w-16 h-16 text-white/90" />
                                        </div>
                                    </div>
                                    <div className={`text-2xl font-bold bg-gradient-to-r ${modeStyle.color} bg-clip-text text-transparent capitalize`}>
                                        {currentMode} Mode
                                    </div>
                                </div>
                            </div>
                        </AnimatedCard>

                        {/* Quick Actions */}
                        <AnimatedCard className="lg:col-span-2 glass rounded-3xl p-8 border border-white/10">
                            <h3 className="text-xl font-bold mb-6">{t('dashboard.quickActions')}</h3>
                            {/* تم تعديل الشبكة لتصبح 3 أعمدة بدلاً من 4 لتناسب العناصر المتبقية */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <MagneticButton onClick={() => navigate('/courses')} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-400 transition-all group">
                                    <BookOpen className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium">{t('dashboard.actions.courses')}</span>
                                </MagneticButton>
                                
                                <MagneticButton onClick={() => navigate('/reports')} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30 hover:border-emerald-400 transition-all group">
                                    <TrendingUp className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium">{t('dashboard.actions.reports')}</span>
                                </MagneticButton>
                                
                                <MagneticButton onClick={() => navigate('/profile')} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 hover:border-orange-400 transition-all group">
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
                                {isAnalyzing && <span className="text-sm text-neon-blue animate-pulse">جاري تحليل جدولك الدراسي...</span>}
                            </div>

                            <div ref={taskListRef} className="space-y-3">
                                {enrolledCourses.length === 0 ? (
                                    <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                        <div className="w-16 h-16 bg-neon-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                            <PlusCircle className="w-8 h-8 text-neon-blue" />
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">رحلتك تبدأ هنا!</h4>
                                        <p className="text-gray-400 mb-6 max-w-md mx-auto">لم تقم بإضافة أي كورس بعد. دع الذكاء الاصطناعي يصمم لك خطة تعليمية مخصصة الآن.</p>
                                        <button 
                                            onClick={() => navigate('/courses')}
                                            className="px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-violet text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-neon-blue/20"
                                        >
                                            إنشاء أول كورس
                                        </button>
                                    </div>
                                ) : dailyTasks.length === 0 && !isAnalyzing ? (
                                    <div className="text-center text-gray-500 py-4">لا توجد مهام إضافية لليوم. استمتع بوقتك! 🎉</div>
                                ) : (
                                    dailyTasks.map((task, index) => (
                                        <div
                                            key={task.id || index}
                                            className={`flex items-center gap-4 p-4 rounded-xl border transition-colors cursor-pointer group ${task.type === 'technical' ? 'bg-neon-blue/10 border-neon-blue/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                        >
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform ${task.type === 'technical' ? 'bg-neon-blue text-black' : 'bg-white/10 text-white'}`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold">{task.title}</div>
                                                <div className="text-xs text-gray-500 capitalize flex gap-2">
                                                    <span>{task.type}</span>
                                                    <span>•</span>
                                                    <span>{task.duration} دقيقة</span>
                                                </div>
                                            </div>
                                            {task.type === 'technical' && <Code className="w-5 h-5 text-cyan-400" />}
                                            {task.type === 'wellness' && <Wind className="w-5 h-5 text-green-400" />}
                                            {task.type === 'psychology' && <Brain className="w-5 h-5 text-purple-400" />}
                                        </div>
                                    ))
                                )}
                            </div>
                        </AnimatedCard>
                    </div>

                </main>
            </div >
        </>
    )
}

export default Dashboard