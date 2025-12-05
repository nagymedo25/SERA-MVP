import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { coursesData } from '../data/mockData'
import useSimulationStore from '../store/simulationStore'
import { BookOpen, Clock, CheckCircle, Lock, PlayCircle, Calendar, Trophy, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const CoursePage = () => {
    const { t } = useLanguage()
    const navigate = useNavigate()
    const { completedLessons } = useSimulationStore()
    const timelineRef = useRef(null)
    const cardsRef = useRef([])

    // محاكاة لجدول "اليوم" بناءً على التخصيص
    const allLessonsCompleted = true // متغير للتحكم في فتح الاختبار النهائي

    const todaySchedule = [
        { time: '09:00 AM', type: 'lesson', courseId: 'course_1', lessonIndex: 0, status: 'completed' },
        { time: '10:30 AM', type: 'quiz', title: 'Quiz: JavaScript Basics', status: 'completed' },
        { time: '01:00 PM', type: 'lesson', courseId: 'course_1', lessonIndex: 1, status: 'current' },
        { time: '03:30 PM', type: 'lesson', courseId: 'course_1', lessonIndex: 2, status: 'locked' },
        { time: '08:00 PM', type: 'assignment', title: 'Final Assignment: Capstone Project', status: allLessonsCompleted ? 'unlocked' : 'locked', isFinal: true }
    ]

    const getLessonData = (courseId, index) => {
        const course = coursesData.find(c => c.id === courseId)
        return course?.lessons?.[index] || { title: 'Unknown Lesson', duration: '0m' }
    }

    useEffect(() => {
        // حركة دخول خط الزمن
        if (timelineRef.current) {
            gsap.fromTo(timelineRef.current, 
                { height: 0 }, 
                { height: '100%', duration: 1.5, ease: 'power2.inOut' }
            )
        }

        // حركة دخول الكروت
        gsap.fromTo(cardsRef.current,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.5 }
        )
    }, [])

    const handleLessonParams = (courseId, idx) => `${courseId}_${idx + 1}`

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-4 md:px-6 overflow-hidden">
                <div className="max-w-5xl mx-auto">
                    
                    {/* رأس الصفحة */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-neon-blue/20 text-neon-blue p-2 rounded-lg"><Calendar className="w-6 h-6" /></span>
                                <h1 className="text-3xl md:text-4xl font-bold">جدولك اليومي</h1>
                            </div>
                            <p className="text-gray-400 max-w-lg">
                                خطة مخصصة بناءً على تحليلك: <span className="text-white font-mono">5 ساعات</span> تركيز لليوم.
                            </p>
                        </div>
                        
                        <div className="glass px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">اليوم</div>
                                <div className="text-2xl font-bold text-neon-violet">01</div>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="text-center">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">المتبقي</div>
                                <div className="text-2xl font-bold text-white">09</div>
                            </div>
                        </div>
                    </div>

                    {/* حاوية الخط الزمني */}
                    <div className="relative pl-4 md:pl-0">
                        {/* الخط الرأسي المركزي */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-800 md:transform md:-translate-x-1/2">
                            <div ref={timelineRef} className="w-full bg-gradient-to-b from-neon-blue via-neon-violet to-slate-800 shadow-[0_0_10px_rgba(0,217,255,0.5)]" />
                        </div>

                        <div className="space-y-12 md:space-y-24">
                            {todaySchedule.map((item, index) => {
                                const isLesson = item.type === 'lesson'
                                const data = isLesson ? getLessonData(item.courseId, item.lessonIndex) : item
                                const isLocked = item.status === 'locked'
                                const isCurrent = item.status === 'current'
                                const isCompleted = item.status === 'completed'
                                const isUnlocked = item.status === 'unlocked'
                                const isRight = index % 2 === 0 // لتبديل الجهات في الديسك توب

                                return (
                                    <div 
                                        key={index}
                                        ref={el => cardsRef.current[index] = el}
                                        className={`relative flex flex-col md:flex-row items-start md:items-center ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'} md:gap-16 pl-12 md:pl-0`}
                                    >
                                        {/* نقطة الاتصال على الخط */}
                                        <div className={`absolute left-0 md:left-1/2 w-9 h-9 rounded-full border-[3px] md:transform md:-translate-x-1/2 z-10 flex items-center justify-center transition-all duration-500 top-0 md:top-auto
                                            ${isCompleted ? 'bg-slate-950 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 
                                              isCurrent || (isUnlocked && item.isFinal) ? 'bg-neon-blue border-white animate-pulse shadow-[0_0_20px_rgba(0,217,255,0.6)]' : 
                                              'bg-slate-900 border-slate-700'}
                                        `}>
                                            {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                                            {(isCurrent || (isUnlocked && item.isFinal)) && <div className="w-2 h-2 bg-white rounded-full" />}
                                            {isLocked && <Lock className="w-3 h-3 text-slate-500" />}
                                        </div>

                                        {/* الوقت (يظهر في الجانب المقابل للكارت) */}
                                        <div className={`hidden md:block w-1/2 text-gray-500 font-mono text-lg ${isRight ? 'text-right' : 'text-left'}`}>
                                            {item.time}
                                        </div>

                                        {/* كارت المحتوى */}
                                        <div className="w-full md:w-1/2">
                                            <div 
                                                onClick={() => {
                                                    if (isLocked) return;
                                                    if (item.isFinal) {
                                                        navigate('/assessment?mode=final')
                                                    } else if (isLesson) {
                                                        navigate(`/lesson/${handleLessonParams(item.courseId, item.lessonIndex)}`)
                                                    }
                                                }}
                                                className={`group relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden
                                                    ${isLocked 
                                                        ? 'bg-slate-900/30 border-white/5 opacity-60 cursor-not-allowed grayscale' 
                                                        : 'glass border-white/10 hover:border-neon-blue/30 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-neon-blue/10'
                                                    }
                                                    ${isCurrent ? 'ring-1 ring-neon-blue/50 bg-neon-blue/5' : ''}
                                                    ${item.isFinal ? 'border-neon-violet/30' : ''}
                                                `}
                                            >
                                                {/* خلفية جمالية للكارت النهائي */}
                                                {item.isFinal && !isLocked && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-neon-violet/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                )}

                                                {/* شارة الوقت للموبايل */}
                                                <div className="md:hidden text-xs font-mono text-gray-500 mb-2 flex items-center gap-2">
                                                    <Clock className="w-3 h-3" />
                                                    {item.time}
                                                </div>

                                                {/* العنوان والنوع */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className={`text-lg font-bold ${item.isFinal ? 'text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent' : 'text-white'}`}>
                                                        {isLesson ? t(data.title) : item.title}
                                                    </h3>
                                                    {item.isFinal && <Trophy className="w-6 h-6 text-neon-violet animate-bounce" />}
                                                </div>

                                                {/* تفاصيل */}
                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                    <div className="flex items-center gap-1.5">
                                                        {item.isFinal ? <Star className="w-4 h-4 text-yellow-500" /> : <Clock className="w-4 h-4" />}
                                                        <span>{item.isFinal ? 'اختبار شامل' : data.duration || '15m'}</span>
                                                    </div>
                                                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                        item.type === 'quiz' ? 'border-yellow-500/30 text-yellow-500' :
                                                        item.type === 'assignment' ? 'border-neon-violet/30 text-neon-violet' :
                                                        'border-neon-blue/30 text-neon-blue'
                                                    }`}>
                                                        {item.type}
                                                    </div>
                                                </div>

                                                {/* زر الإجراء */}
                                                {!isLocked && (
                                                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                                                        <span className={`text-xs font-bold flex items-center gap-1 transition-colors ${item.isFinal ? 'text-neon-violet' : 'text-neon-blue group-hover:text-white'}`}>
                                                            {isCompleted ? 'مراجعة' : 'ابدأ الآن'} <PlayCircle className="w-4 h-4" />
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CoursePage