import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useSimulationStore from '../store/simulationStore'
// ✅ تم إضافة Award هنا
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, Lock, AlertCircle, Award } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Navbar from '../components/Navbar'
import { useLanguage } from '../contexts/LanguageContext'
import gsap from 'gsap'

const LessonViewer = () => {
    const { t } = useLanguage()
    const { lessonId } = useParams()
    const navigate = useNavigate()
    
    const { courses, completedLessons, completeLesson } = useSimulationStore()
    
    const [showQuiz, setShowQuiz] = useState(false)
    const [quizAnswers, setQuizAnswers] = useState({})
    const [quizSubmitted, setQuizSubmitted] = useState(false)
    const [quizPassed, setQuizPassed] = useState(false)

    // استخراج معرف الكورس والدرس
    const parts = lessonId.split('_')
    const lessonIndexStr = parts.pop()
    const unitIndexStr = parts.pop()
    const courseId = parts.join('_')
    
    const lessonIndex = parseInt(lessonIndexStr) - 1

    const course = courses.find((c) => c.id === courseId)
    const lesson = course?.lessons?.[lessonIndex]
    
    const isAlreadyCompleted = completedLessons.includes(lessonId)

    if (!course || !lesson) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">عذراً، لم يتم العثور على هذا الدرس</h2>
                    <button onClick={() => navigate('/courses')} className="text-neon-blue hover:underline">
                        العودة للكورسات
                    </button>
                </div>
            </div>
        )
    }

    const handleQuizAnswer = (questionId, answerIndex) => {
        setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex })
    }

    const handleQuizSubmit = () => {
        const allAnswered = Object.keys(quizAnswers).length === (lesson.quiz?.questions?.length || 0)
        
        if (allAnswered) {
            setQuizSubmitted(true)
            const passed = true 
            setQuizPassed(passed)

            if (passed) {
                completeLesson(lessonId)
                gsap.fromTo('.success-message', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out' })
            }
        }
    }

    const isNextLesson = lessonIndex < (course.lessons?.length || 0) - 1
    const nextLessonId = isNextLesson ? `${courseId}_1_${lessonIndex + 2}` : null

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <button
                            onClick={() => navigate('/courses')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            الجدول الدراسي
                        </button>
                        
                        {isAlreadyCompleted && (
                            <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-full">
                                <CheckCircle className="w-5 h-5" />
                                <span>تم إنجاز المهمة</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* المحتوى الرئيسي */}
                        <div className="lg:col-span-2 space-y-8">
                            {!showQuiz ? (
                                <div className="glass rounded-3xl p-8 border border-white/10 animate-fade-in">
                                    <div className="flex items-center gap-2 text-neon-blue mb-4">
                                        <BookOpen className="w-5 h-5" />
                                        <span className="text-sm font-bold uppercase tracking-wider">درس تعليمي</span>
                                    </div>
                                    <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
                                    
                                    <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                                        <ReactMarkdown>{lesson.content || lesson.description || "محتوى الدرس..."}</ReactMarkdown>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/10">
                                        <div className="flex items-center justify-between bg-neon-violet/10 p-4 rounded-xl border border-neon-violet/20">
                                            <div className="flex items-center gap-3">
                                                <AlertCircle className="text-neon-violet w-6 h-6" />
                                                <div className="text-sm">
                                                    <p className="font-bold text-white">الكويز إجباري</p>
                                                    <p className="text-gray-400">لا يمكنك إكمال الدرس دون اجتياز الاختبار.</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowQuiz(true)}
                                                className="px-6 py-3 rounded-lg bg-neon-violet hover:bg-purple-600 font-bold transition-colors"
                                            >
                                                بدء الكويز
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* واجهة الكويز */
                                <div className="glass rounded-3xl p-8 border border-white/10 animate-fade-in">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <CheckCircle className="text-neon-violet" />
                                        اختبار استيعاب: {lesson.title}
                                    </h2>

                                    {lesson.quiz?.questions ? (
                                        lesson.quiz.questions.map((q, idx) => (
                                            <div key={q.id || idx} className="mb-8">
                                                <p className="font-semibold mb-4">{idx + 1}. {q.question}</p>
                                                <div className="space-y-2">
                                                    {q.options.map((opt, optIdx) => (
                                                        <button
                                                            key={optIdx}
                                                            onClick={() => !quizSubmitted && handleQuizAnswer(q.id || idx, optIdx)}
                                                            disabled={quizSubmitted}
                                                            className={`w-full text-left p-4 rounded-xl border transition-all ${
                                                                quizAnswers[q.id || idx] === optIdx 
                                                                    ? 'bg-neon-blue/20 border-neon-blue text-white' 
                                                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                            }`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 mb-4">لا يوجد أسئلة لهذا الدرس حالياً.</p>
                                    )}

                                    {!quizSubmitted && lesson.quiz?.questions ? (
                                        <button
                                            onClick={handleQuizSubmit}
                                            disabled={Object.keys(quizAnswers).length < lesson.quiz.questions.length}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-violet font-bold text-lg hover:scale-[1.02] transition-transform"
                                        >
                                            تسليم الإجابات
                                        </button>
                                    ) : (
                                        <div className="success-message text-center py-6">
                                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="w-8 h-8 text-black" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-green-400 mb-2">أحسنت!</h3>
                                            <p className="text-gray-400 mb-6">تم تسجيل تقدمك بنجاح.</p>
                                            
                                            {nextLessonId ? (
                                                <button
                                                    onClick={() => navigate(`/lesson/${nextLessonId}`)}
                                                    className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto"
                                                >
                                                    الدرس التالي <ChevronRight className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => navigate('/certificate')}
                                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                                                >
                                                    استلام الشهادة <Award className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="glass rounded-3xl p-6 border border-white/10 sticky top-24">
                                <h3 className="font-bold mb-4 text-gray-400">محتويات الكورس</h3>
                                <div className="space-y-3">
                                    {course.lessons.map((l, idx) => {
                                        const lId = `${courseId}_1_${idx + 1}`
                                        const isDone = completedLessons.includes(lId)
                                        const isCurrent = idx === lessonIndex
                                        
                                        return (
                                            <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${isCurrent ? 'bg-white/10 border border-neon-blue/30' : 'opacity-60'}`}>
                                                {isDone ? <CheckCircle className="w-5 h-5 text-green-500" /> : <div className="w-5 h-5 rounded-full border-2 border-neon-blue" />}
                                                <span className={`text-sm ${isCurrent ? 'text-white font-bold' : 'text-gray-400'}`}>
                                                    {l.title}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LessonViewer