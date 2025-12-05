import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { BookOpen, Clock, Plus, Trash2, Edit2, PlayCircle, Loader, X, Save, Calendar, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AnimatedCard from '../components/AnimatedCard'
import useSimulationStore from '../store/simulationStore'

const CoursePage = () => {
    const navigate = useNavigate()
    const { 
        courses, 
        addNewCourseAI, 
        deleteCourse, 
        updateCourse, 
        isAnalyzing 
    } = useSimulationStore()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(null)
    const [newTopic, setNewTopic] = useState('')
    const [editForm, setEditForm] = useState({})
    
    const cardsRef = useRef([])

    // أنيميشن عند تحميل القائمة
    useEffect(() => {
        if (cardsRef.current.length > 0) {
            gsap.fromTo(cardsRef.current.filter(Boolean), 
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
            )
        }
    }, [courses.length])

    const handleAddCourse = async (e) => {
        e.preventDefault();
        if (!newTopic.trim()) return;
        
        await addNewCourseAI(newTopic); // استدعاء الـ AI
        setNewTopic('');
        setIsModalOpen(false);
    }

    // التوجيه الذكي
    const handleCourseAction = (course) => {
        if (course.isScheduled) {
            // إذا كان الكورس مجدولاً، اذهب للدرس الأول
            navigate(`/lesson/${course.id}_1_1`)
        } else {
            // إذا كان جديداً، اذهب لصفحة بناء الجدول (Setup)
            navigate('/course-setup', { state: { courseId: course.id } })
        }
    }

    const startEdit = (course) => {
        setIsEditMode(course.id)
        setEditForm({ title: course.title, description: course.description })
    }

    const saveEdit = (courseId) => {
        updateCourse(courseId, editForm)
        setIsEditMode(null)
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-violet">
                                مكتبة المسارات
                            </h1>
                            <p className="text-xl text-gray-400">إدارة مساراتك التعليمية وتوليد مسارات جديدة بالذكاء الاصطناعي</p>
                        </div>
                    </div>

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        {/* 1. زر إضافة كورس جديد (Create) */}
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="group relative h-full min-h-[350px] border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-neon-blue hover:bg-neon-blue/5 transition-all duration-300"
                        >
                            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-neon-blue/10">
                                <Plus className="w-10 h-10 text-white group-hover:text-neon-blue transition-colors" />
                            </div>
                            <span className="text-xl font-bold text-gray-400 group-hover:text-neon-blue transition-colors">
                                توليد مسار ذكي جديد
                            </span>
                            <p className="text-sm text-gray-500 px-8 text-center">أدخل أي مهارة، وسيقوم الـ AI ببناء المنهج لك</p>
                        </button>

                        {/* 2. عرض الكورسات (Read, Update, Delete) */}
                        {courses.map((course, idx) => {
                            const isEditing = isEditMode === course.id
                            const isScheduled = course.isScheduled

                            return (
                                <AnimatedCard
                                    key={course.id}
                                    ref={(el) => (cardsRef.current[idx] = el)}
                                    className="glass rounded-3xl overflow-hidden border border-white/10 flex flex-col h-full hover:border-white/30 transition-colors"
                                >
                                    {/* Cover Image Area */}
                                    <div className={`relative h-48 bg-gradient-to-br ${course.difficulty === 'beginner' ? 'from-green-500/20' : 'from-purple-500/20'} to-slate-900 flex items-center justify-center overflow-hidden group`}>
                                        
                                        {/* صورة الخلفية (إن وجدت) أو لون متدرج */}
                                        <div className="absolute inset-0 bg-slate-900 opacity-50 z-0"></div>
                                        
                                        {/* أزرار التحكم (تظهر عند التحويم) */}
                                        <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); startEdit(course); }}
                                                className="p-2 rounded-full bg-black/60 hover:bg-neon-blue text-white transition-colors backdrop-blur-md"
                                                title="تعديل"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); deleteCourse(course.id); }}
                                                className="p-2 rounded-full bg-black/60 hover:bg-red-500 text-white transition-colors backdrop-blur-md"
                                                title="حذف"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <BookOpen className="w-20 h-20 text-white/10 absolute -bottom-6 -left-6 rotate-12 z-0" />
                                        <div className="z-10 text-5xl">
                                            {course.difficulty === 'advanced' ? '🚀' : course.difficulty === 'intermediate' ? '⚡' : '🌱'}
                                        </div>
                                        
                                        {/* شارة الحالة */}
                                        {isScheduled && (
                                            <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 backdrop-blur-sm">
                                                <CheckCircle className="w-3 h-3" />
                                                نشط في الجدول
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        {isEditing ? (
                                            <div className="space-y-3 mb-auto">
                                                <input 
                                                    value={editForm.title}
                                                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                                    className="w-full bg-white/10 rounded-lg p-3 text-white border border-neon-blue focus:outline-none"
                                                    autoFocus
                                                />
                                                <textarea 
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                                    className="w-full bg-white/10 rounded-lg p-3 text-white text-sm border border-neon-blue h-24 resize-none focus:outline-none"
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <button onClick={() => setIsEditMode(null)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"><X className="w-4 h-4"/></button>
                                                    <button onClick={() => saveEdit(course.id)} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"><Save className="w-4 h-4"/></button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="text-2xl font-bold mb-2 truncate" title={course.title}>{course.title}</h3>
                                                <p className="text-gray-400 mb-6 text-sm line-clamp-3 leading-relaxed">{course.description}</p>
                                                
                                                <div className="mt-auto">
                                                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 font-mono">
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="w-4 h-4 text-neon-blue" />
                                                            <span>{course.duration || 'غير محدد'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <BookOpen className="w-4 h-4 text-neon-violet" />
                                                            <span>{course.lessonsCount || 0} دروس</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleCourseAction(course)}
                                                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                                                            isScheduled
                                                            ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20' 
                                                            : 'bg-gradient-to-r from-neon-blue to-neon-violet text-white hover:scale-[1.02] shadow-neon-blue/20'
                                                        }`}
                                                    >
                                                        {isScheduled ? (
                                                            <>متابعة التعلم <PlayCircle className="w-5 h-5" /></>
                                                        ) : (
                                                            <>رسم المسار والجدول <Calendar className="w-5 h-5" /></>
                                                        )}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </AnimatedCard>
                            )
                        })}
                    </div>
                </div>

                {/* Add Course Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                        <div className="glass w-full max-w-lg p-10 rounded-3xl border border-white/20 relative animate-slide-up shadow-2xl">
                            <button 
                                onClick={() => !isAnalyzing && setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8 text-neon-blue" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">توليد مسار جديد</h2>
                                <p className="text-gray-400">اكتب الموضوع، وسيقوم الـ AI ببناء الهيكل الكامل للكورس.</p>
                            </div>

                            <form onSubmit={handleAddCourse}>
                                <div className="mb-8">
                                    <input 
                                        type="text"
                                        placeholder="مثلاً: Python for Data Science, React Native..."
                                        className="w-full bg-slate-900/80 border border-white/20 rounded-xl p-5 text-white text-lg placeholder-gray-500 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all text-center"
                                        value={newTopic}
                                        onChange={(e) => setNewTopic(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isAnalyzing || !newTopic}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-violet font-bold text-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-neon-blue/20"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            جاري الاتصال بالذكاء الاصطناعي...
                                        </>
                                    ) : (
                                        'توليد الكورس فوراً'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default CoursePage