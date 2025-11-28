import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { coursesData } from '../data/mockData'
import useSimulationStore from '../store/simulationStore'
import { BookOpen, Clock, TrendingUp, ChevronRight, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AnimatedCard from '../components/AnimatedCard'
import MagneticButton from '../components/MagneticButton'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const CoursePage = () => {
    const { t } = useLanguage()
    const navigate = useNavigate()
    const { user, enrolledCourses, enrollCourse } = useSimulationStore()
    const [filter, setFilter] = useState('all')
    const cardsRef = useRef([])

    useEffect(() => {
        if (cardsRef.current.length > 0) {
            gsap.set(cardsRef.current.filter(Boolean), { opacity: 0, y: 30 })
            gsap.to(cardsRef.current.filter(Boolean), {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.2
            })
        }
    }, [filter])

    const getDifficultyColor = (difficulty) => {
        const colors = {
            beginner: 'from-green-400 to-emerald-500',
            intermediate: 'from-yellow-400 to-orange-500',
            advanced: 'from-red-400 to-pink-500',
        }
        return colors[difficulty] || colors.beginner
    }

    const filteredCourses = coursesData.filter((course) => {
        if (filter === 'all') return true
        if (filter === 'enrolled') return enrolledCourses.includes(course.id)
        return course.difficulty === filter
    })

    const handleEnroll = (courseId) => {
        enrollCourse(courseId)
        navigate(`/lesson/${courseId}_1_1`)
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6 relative overflow-hidden">
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-20 left-10 w-96 h-96 gradient-orb-1 animate-float" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 gradient-orb-2 animate-float" style={{ animationDelay: '2s' }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-5xl font-bold mb-4">{t('courses.title')}</h1>
                        <p className="text-xl text-gray-400">{t('courses.subtitle')}</p>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-12">
                        {['all', 'beginner', 'intermediate', 'advanced', 'enrolled'].map((filterOption) => (
                            <MagneticButton
                                key={filterOption}
                                onClick={() => setFilter(filterOption)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${filter === filterOption
                                    ? 'bg-gradient-to-r from-neon-blue to-neon-violet text-white shadow-lg'
                                    : 'bg-white/5 hover:bg-white/10 text-gray-400'
                                    }`}
                            >
                                {filterOption === 'all' && t('courses.all')}
                                {filterOption === 'beginner' && t('courses.beginner')}
                                {filterOption === 'intermediate' && t('courses.intermediate')}
                                {filterOption === 'advanced' && t('courses.advanced')}
                                {filterOption === 'enrolled' && t('courses.enrolled')}
                            </MagneticButton>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course, idx) => {
                            const isEnrolled = enrolledCourses.includes(course.id)

                            return (
                                <AnimatedCard
                                    key={course.id}
                                    ref={(el) => (cardsRef.current[idx] = el)}
                                    className="glass rounded-3xl overflow-hidden border border-white/10"
                                >
                                    <div className={`relative h-48 bg-gradient-to-br ${getDifficultyColor(course.difficulty)} flex items-center justify-center`}>
                                        <div className="absolute inset-0 bg-black/20" />
                                        <BookOpen className="w-20 h-20 text-white/80 relative z-10" />

                                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-semibold text-white">
                                            {course.difficulty === 'beginner' && t('courses.beginner')}
                                            {course.difficulty === 'intermediate' && t('courses.intermediate')}
                                            {course.difficulty === 'advanced' && t('courses.advanced')}
                                        </div>

                                        {isEnrolled && (
                                            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500 text-xs font-semibold text-white flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-current" />
                                                {t('courses.enrolled')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold mb-2">{t(course.title)}</h3>
                                        <p className="text-gray-400 mb-4 text-sm">{t(course.description)}</p>

                                        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="w-4 h-4" />
                                                <span>{course.lessonsCount} {t('courses.lessons')}</span>
                                            </div>
                                        </div>

                                        <MagneticButton
                                            onClick={() => handleEnroll(course.id)}
                                            className={`w-full px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${isEnrolled
                                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                                : 'bg-gradient-to-r from-neon-blue to-neon-violet'
                                                }`}
                                        >
                                            {isEnrolled ? t('courses.continue') : t('courses.startNow')}
                                            <ChevronRight className="w-4 h-4" />
                                        </MagneticButton>
                                    </div>
                                </AnimatedCard>
                            )
                        })}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="text-center py-20">
                            <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-xl text-gray-400">{t('courses.noCoursesFound')}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default CoursePage
