import React from 'react'
import useSimulationStore from '../store/simulationStore'
import { User, Mail, Calendar, Target, Brain, Code, TrendingUp, Settings, Activity } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useLanguage } from '../contexts/LanguageContext'

const ProfilePage = () => {
    const { t } = useLanguage()
    const { user } = useSimulationStore()

    // Fallback data if AI hasn't analyzed yet
    const mindprint = user?.mindprint || { traits: { focus: 0, resilience: 0, openness: 0 } }
    const codingGenome = user?.codingGenome || { level: 'Not Analyzed', strengths: [], problemSolvingScore: 0 }
    const lifeTrajectory = user?.lifeTrajectory || { goal: 'Not Set', timeframe: '-', field: '-' }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-5xl font-bold mb-4">{t('profile.title')}</h1>
                            <p className="text-xl text-gray-400">بياناتك الشخصية وتحليل الذكاء الاصطناعي</p>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                            <Settings className="w-5 h-5" />
                            {t('profile.edit')}
                        </button>
                    </div>

                    {/* Profile Card */}
                    <div className="glass rounded-3xl p-8 border border-white/10 mb-8">
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center text-4xl font-bold shadow-lg shadow-neon-blue/20">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold mb-2">{user?.name || t('profile.newUser')}</h2>
                                <div className="space-y-2 text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span>{user?.email || 'user@example.com'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{t('profile.joined')} {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '2025'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* Mindprint (Psychological) */}
                        <div className="glass rounded-3xl p-8 border border-white/10 hover:border-neon-violet/50 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-neon-violet/20 glow-violet flex items-center justify-center mb-6">
                                <Brain className="w-8 h-8 text-neon-violet" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Mindprint (النفسي)</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>التركيز (Focus)</span>
                                        <span className="text-white font-bold">{mindprint.traits?.focus || 0}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-neon-violet" style={{ width: `${mindprint.traits?.focus || 0}%` }} />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>المرونة (Resilience)</span>
                                        <span className="text-white font-bold">{mindprint.traits?.resilience || 0}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500" style={{ width: `${mindprint.traits?.resilience || 0}%` }} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>الانفتاح (Openness)</span>
                                        <span className="text-white font-bold">{mindprint.traits?.openness || 0}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-pink-500" style={{ width: `${mindprint.traits?.openness || 0}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coding Genome (Technical) */}
                        <div className="glass rounded-3xl p-8 border border-white/10 hover:border-neon-blue/50 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-neon-blue/20 glow-blue flex items-center justify-center mb-6">
                                <Code className="w-8 h-8 text-neon-blue" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Coding Genome</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                    <span className="text-sm text-gray-400">المستوى الحالي</span>
                                    <span className="text-neon-blue font-bold capitalize">{codingGenome.level}</span>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-400 mb-2">نقاط القوة المكتشفة</div>
                                    <div className="flex flex-wrap gap-2">
                                        {codingGenome.strengths && codingGenome.strengths.length > 0 ? (
                                            codingGenome.strengths.map((skill, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue text-xs font-medium border border-neon-blue/20">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-600">لا توجد بيانات بعد</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Life Trajectory (Career) */}
                        <div className="glass rounded-3xl p-8 border border-white/10 hover:border-green-500/50 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">مسار الحياة</h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    <div>
                                        <div className="text-xs text-gray-400">الهدف المهني</div>
                                        <div className="text-sm font-semibold capitalize">{lifeTrajectory.goal}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <Calendar className="w-5 h-5 text-cyan-400" />
                                    <div>
                                        <div className="text-xs text-gray-400">الإطار الزمني</div>
                                        <div className="text-sm font-semibold">{lifeTrajectory.timeframe}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                    <Activity className="w-5 h-5 text-orange-400" />
                                    <div>
                                        <div className="text-xs text-gray-400">التخصص</div>
                                        <div className="text-sm font-semibold capitalize">{lifeTrajectory.field || 'General Tech'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Retake Section */}
                    <div className="glass rounded-2xl p-8 border border-white/10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                        <p className="text-gray-300 mb-6 text-lg">هل تغيرت أهدافك أو تشعر أن التحليل القديم لم يعد يمثلك؟</p>
                        <button
                            onClick={() => (window.location.href = '/onboarding')}
                            className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 hover:scale-105 transition-all shadow-lg"
                        >
                            إعادة التحليل الشامل (Re-scan)
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePage