import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { BookOpen, Clock, Plus, Trash2, Edit2, PlayCircle, Loader, X, Save, Calendar, CheckCircle, MapPin, Award, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AnimatedCard from '../components/AnimatedCard'
import useSimulationStore from '../store/simulationStore'

const CoursePage = () => {
    const navigate = useNavigate()
    const { 
        courses, addNewCourseAI, deleteCourse, updateCourse, isAnalyzing 
    } = useSimulationStore()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(null)
    const [newTopic, setNewTopic] = useState('')
    const [editForm, setEditForm] = useState({})
    
    const cardsRef = useRef([])

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
        await addNewCourseAI(newTopic);
        setNewTopic('');
        setIsModalOpen(false);
    }

    const openJourney = (course) => {
        if (course.isScheduled) {
            navigate(`/journey/${course.id}`)
        } else {
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
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-violet">
                                مكتبة المسارات
                            </h1>
                            <p className="text-xl text-gray-400">إدارة مساراتك التعليمية وتوليد مسارات جديدة بالذكاء الاصطناعي</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        </button>

                        {courses.map((course, idx) => {
                            const isScheduled = course.isScheduled
                            const isEditing = isEditMode === course.id
                            const isCertified = course.hasCertificate // ✅ التحقق من الشهادة

                            return (
                                <AnimatedCard
                                    key={course.id}
                                    ref={(el) => (cardsRef.current[idx] = el)}
                                    // تغيير الستايل للكروت الذهبية
                                    className={`
                                        rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-500
                                        ${isCertified 
                                            ? 'bg-gradient-to-br from-yellow-900/40 to-amber-900/20 border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.1)] hover:shadow-[0_0_50px_rgba(234,179,8,0.2)] hover:scale-[1.02]' 
                                            : 'glass border border-white/10 hover:border-white/30'
                                        }
                                    `}
                                >
                                    <div className={`relative h-48 flex items-center justify-center overflow-hidden group 
                                        ${isCertified 
                                            ? 'bg-gradient-to-br from-yellow-500/20 to-orange-600/20' 
                                            : course.difficulty === 'beginner' ? 'bg-gradient-to-br from-green-500/20 to-slate-900' : 'bg-gradient-to-br from-purple-500/20 to-slate-900'
                                        }`}>
                                        
                                        <div className="absolute inset-0 bg-slate-900 opacity-50 z-0"></div>
                                        
                                        {/* أزرار التحكم (تختفي إذا كان هناك شهادة) */}
                                        {!isCertified && (
                                            <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => { e.stopPropagation(); startEdit(course); }} className="p-2 rounded-full bg-black/60 hover:bg-neon-blue text-white"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={(e) => { e.stopPropagation(); deleteCourse(course.id); }} className="p-2 rounded-full bg-black/60 hover:bg-red-500 text-white"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        )}

                                        {isCertified ? (
                                            <Award className="w-24 h-24 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] z-10 animate-pulse" />
                                        ) : (
                                            <BookOpen className="w-20 h-20 text-white/10 absolute -bottom-6 -left-6 rotate-12 z-0" />
                                        )}
                                        
                                        {!isCertified && <div className="z-10 text-5xl">{course.difficulty === 'advanced' ? '🚀' : '🌱'}</div>}
                                        
                                        {isScheduled && !isCertified && (
                                            <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 backdrop-blur-sm">
                                                <CheckCircle className="w-3 h-3" /> نشط في الجدول
                                            </div>
                                        )}
                                        {isCertified && (
                                            <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30 backdrop-blur-sm">
                                                <Award className="w-3 h-3" /> شهادة موثقة
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        {isEditing ? (
                                            <div className="space-y-3 mb-auto">
                                                <input value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full bg-white/10 rounded p-2 text-white" />
                                                <button onClick={() => saveEdit(course.id)} className="text-green-400 text-sm">حفظ</button>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className={`text-2xl font-bold mb-2 truncate ${isCertified ? 'text-yellow-100' : 'text-white'}`}>{course.title}</h3>
                                                <p className="text-gray-400 mb-6 text-sm line-clamp-3">{course.description}</p>
                                                <div className="mt-auto">
                                                    <button
                                                        onClick={() => openJourney(course)}
                                                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                                                            isCertified 
                                                            ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:scale-[1.02] shadow-yellow-500/20'
                                                            : isScheduled
                                                                ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20' 
                                                                : 'bg-gradient-to-r from-neon-blue to-neon-violet text-white hover:scale-[1.02] shadow-neon-blue/20'
                                                        }`}
                                                    >
                                                        {isCertified ? (<>عرض الشهادة والمسار <Award className="w-5 h-5" /></>) : isScheduled ? (<>رحلتك التعليمية <MapPin className="w-5 h-5" /></>) : (<>رسم المسار والجدول <Calendar className="w-5 h-5" /></>)}
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

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                        <div className="glass w-full max-w-lg p-10 rounded-3xl border border-white/20 relative animate-slide-up shadow-2xl">
                            <button onClick={() => !isAnalyzing && setIsModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-2">توليد مسار جديد</h2>
                                <p className="text-gray-400">اكتب الموضوع، وسيقوم الـ AI ببناء الهيكل الكامل للكورس.</p>
                            </div>
                            <form onSubmit={handleAddCourse}>
                                <div className="mb-8">
                                    <input type="text" placeholder="مثلاً: Python for Data Science..." className="w-full bg-slate-900/80 border border-white/20 rounded-xl p-5 text-white text-lg text-center" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} autoFocus />
                                </div>
                                <button type="submit" disabled={isAnalyzing || !newTopic} className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-violet font-bold text-lg hover:scale-[1.02]">
                                    {isAnalyzing ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'توليد الكورس فوراً'}
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