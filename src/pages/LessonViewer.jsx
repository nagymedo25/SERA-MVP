import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { coursesData } from '../data/mockData'
import useSimulationStore from '../store/simulationStore'
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Navbar from '../components/Navbar'
import { useLanguage } from '../contexts/LanguageContext'

const LessonViewer = () => {
    const { t } = useLanguage()
    const { lessonId } = useParams()
    const navigate = useNavigate()
    const { completedLessons, completeLesson } = useSimulationStore()
    const [showQuiz, setShowQuiz] = useState(false)
    const [quizAnswers, setQuizAnswers] = useState({})
    const [quizSubmitted, setQuizSubmitted] = useState(false)

    // Parse lessonId: format is "courseId_lessonIndex"
    const [courseId, ...lessonParts] = lessonId.split('_')
    const course = coursesData.find((c) => c.id === courseId)
    const lessonIndex = parseInt(lessonParts.join('_').split('_')[1]) - 1

    const lesson = course?.lessons?.[lessonIndex]
    const isCompleted = completedLessons.includes(lessonId)

    if (!course || !lesson) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{t('lesson.lessonNotFound')}</h2>
                    <button
                        onClick={() => navigate('/courses')}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-violet"
                    >
                        {t('lesson.backToCourses')}
                    </button>
                </div>
            </div>
        )
    }

    const handleQuizAnswer = (questionId, answerIndex) => {
        setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex })
    }

    const handleQuizSubmit = () => {
        setQuizSubmitted(true)
        completeLesson(lessonId)
    }

    const isNextLesson = lessonIndex < (course.lessons?.length || 0) - 1
    const nextLessonId = isNextLesson ? `${courseId}_${lessonIndex + 2}` : null

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/courses')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            {t('lesson.backToCourses')}
                        </button>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">{course.title}</p>
                                <h1 className="text-4xl font-bold">{lesson.title}</h1>
                            </div>
                            {isCompleted && (
                                <div className="flex items-center gap-2 text-green-400">
                                    <CheckCircle className="w-6 h-6 fill-current" />
                                    <span className="font-semibold">{t('lesson.completed')}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                <span>{lesson.duration}</span>
                            </div>
                        </div>
                    </div>

                    {/* Lesson Content */}
                    {!showQuiz ? (
                        <div className="glass rounded-3xl p-8 mb-8 border border-white/10">
                            <div className="prose prose-invert prose-lg max-w-none">
                                <div className="markdown-content" style={{ color: '#e2e8f0', lineHeight: '1.8' }}>
                                    {lesson.content.split('\n').map((line, i) => {
                                        if (line.startsWith('# ')) {
                                            return <h2 key={i} className="text-3xl font-bold mb-4 mt-8">{line.slice(2)}</h2>
                                        } else if (line.startsWith('## ')) {
                                            return <h3 key={i} className="text-2xl font-bold mb-3 mt-6">{line.slice(3)}</h3>
                                        } else if (line.startsWith('```')) {
                                            const codeMatch = lesson.content.slice(lesson.content.indexOf(line)).match(/```(\w+)?\n([\s\S]*?)```/)
                                            if (codeMatch) {
                                                return (
                                                    <pre key={i} className="bg-slate-900 rounded-lg p-4 my-4 overflow-x-auto">
                                                        <code className="text-sm text-green-400">{codeMatch[2]}</code>
                                                    </pre>
                                                )
                                            }
                                        } else if (line.match(/^\d+\./)) {
                                            return <li key={i} className="mb-2">{line.slice(line.indexOf('.') + 1).trim()}</li>
                                        } else if (line.trim()) {
                                            return <p key={i} className="mb-4">{line}</p>
                                        }
                                        return null
                                    })}
                                </div>
                            </div>

                            {/* Start Quiz Button */}
                            {lesson.quiz && !isCompleted && (
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <button
                                        onClick={() => setShowQuiz(true)}
                                        className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-violet font-semibold text-lg hover:scale-105 transition-transform"
                                    >
                                        {t('lesson.startQuiz')}
                                    </button>
                                </div>
                            )}

                            {/* Next Lesson for completed */}
                            {isCompleted && nextLessonId && (
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <button
                                        onClick={() => navigate(`/lesson/${nextLessonId}`)}
                                        className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 font-semibold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
                                    >
                                        {t('lesson.nextLesson')}
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Quiz Section */
                        <div className="glass rounded-3xl p-8 mb-8 border border-white/10">
                            <h2 className="text-3xl font-bold mb-8">{t('lesson.quiz')}</h2>

                            {lesson.quiz.questions.map((question, qIndex) => (
                                <div key={question.id} className="mb-8">
                                    <p className="text-lg font-semibold mb-4">
                                        {qIndex + 1}. {question.question}
                                    </p>

                                    <div className="space-y-3">
                                        {question.options.map((option, oIndex) => {
                                            const isSelected = quizAnswers[question.id] === oIndex
                                            const isCorrect = question.correct === oIndex
                                            const showCorrect = quizSubmitted && isCorrect
                                            const showWrong = quizSubmitted && isSelected && !isCorrect

                                            return (
                                                <button
                                                    key={oIndex}
                                                    onClick={() => !quizSubmitted && handleQuizAnswer(question.id, oIndex)}
                                                    disabled={quizSubmitted}
                                                    className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-300 ${showCorrect
                                                        ? 'bg-green-500/20 border-green-500 text-green-400'
                                                        : showWrong
                                                            ? 'bg-red-500/20 border-red-500 text-red-400'
                                                            : isSelected
                                                                ? 'bg-neon-blue/20 border-neon-blue text-white'
                                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}

                            {!quizSubmitted ? (
                                <button
                                    onClick={handleQuizSubmit}
                                    disabled={Object.keys(quizAnswers).length < lesson.quiz.questions.length}
                                    className={`w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all ${Object.keys(quizAnswers).length < lesson.quiz.questions.length
                                        ? 'bg-gray-700 cursor-not-allowed opacity-50'
                                        : 'bg-gradient-to-r from-neon-blue to-neon-violet hover:scale-105'
                                        }`}
                                >
                                    {t('lesson.submitAnswers')}
                                </button>
                            ) : (
                                <div className="text-center space-y-6">
                                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/20 text-green-400 text-lg font-semibold">
                                        <CheckCircle className="w-6 h-6" />
                                        {t('lesson.lessonCompleted')}
                                    </div>

                                    {nextLessonId && (
                                        <button
                                            onClick={() => {
                                                setShowQuiz(false)
                                                setQuizSubmitted(false)
                                                setQuizAnswers({})
                                                navigate(`/lesson/${nextLessonId}`)
                                            }}
                                            className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 font-semibold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
                                        >
                                            {t('lesson.nextLesson')}
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default LessonViewer
