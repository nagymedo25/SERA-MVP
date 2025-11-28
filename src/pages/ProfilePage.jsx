import React from 'react'
import useSimulationStore from '../store/simulationStore'
import { User, Mail, Calendar, Target, Brain, Code, TrendingUp, Settings } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useLanguage } from '../contexts/LanguageContext'

const ProfilePage = () => {
    const { t } = useLanguage()
    const { user } = useSimulationStore()

    const mindprint = user?.mindprint || {
        traits: {
            openness: 75,
            conscientiousness: 68,
            resilience: 72,
        },
    }

    const codingGenome = user?.codingGenome || {
        level: 'beginner',
        strengths: ['HTML', 'CSS', 'JavaScript'],
        problemSolvingScore: 62,
    }

    const lifeTrajectory = user?.lifeTrajectory || {
        goal: 'web_developer',
        timeframe: '6 أشهر',
        field: 'Web Development',
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-5xl font-bold mb-4">{t('profile.title')}</h1>
                            <p className="text-xl text-gray-400">{t('profile.subtitle')}</p>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                            <Settings className="w-5 h-5" />
                            {t('profile.edit')}
                        </button>
                    </div>

                    {/* Profile Card */}
                    <div className="glass rounded-3xl p-8 border border-white/10 mb-8">
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center text-4xl font-bold">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold mb-2">{user?.name || t('profile.newUser')}</h2>
                                <div className="space-y-2 text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span>user@example.com</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{t('profile.joined')} 2025</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* Mindprint */}
                        <div className="glass rounded-3xl p-8 border border-white/10">
                            <div className="w-16 h-16 rounded-2xl bg-neon-violet/20 glow-violet flex items-center justify-center mb-6">
                                <Brain className="w-8 h-8 text-neon-violet" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{t('profile.mindprint')}</h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">{t('profile.traits.focus')}</span>
                                        <span className="text-neon-violet font-bold">{mindprint.traits.conscientiousness}</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-neon-violet to-neon-pink rounded-full"
                                            style={{ width: `${mindprint.traits.conscientiousness}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">{t('profile.traits.resilience')}</span>
                                        <span className="text-neon-violet font-bold">{mindprint.traits.resilience}</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-neon-violet to-neon-pink rounded-full"
                                            style={{ width: `${mindprint.traits.resilience}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">{t('profile.traits.openness')}</span>
                                        <span className="text-neon-violet font-bold">{mindprint.traits.openness}</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-neon-violet to-neon-pink rounded-full"
                                            style={{ width: `${mindprint.traits.openness}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coding Genome */}
                        <div className="glass rounded-3xl p-8 border border-white/10">
                            <div className="w-16 h-16 rounded-2xl bg-neon-blue/20 glow-blue flex items-center justify-center mb-6">
                                <Code className="w-8 h-8 text-neon-blue" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{t('profile.codingGenome')}</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                    <span className="text-sm">{t('profile.genome.level')}</span>
                                    <span className="text-neon-blue font-semibold capitalize">{codingGenome.level}</span>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-400 mb-2">{t('profile.genome.strengths')}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {codingGenome.strengths.map((skill) => (
                                            <span key={skill} className="px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-xs font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">{t('profile.genome.problemSolving')}</span>
                                        <span className="text-neon-blue font-bold">{codingGenome.problemSolvingScore}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-neon-blue to-cyan-400 rounded-full"
                                            style={{ width: `${codingGenome.problemSolvingScore}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Life Trajectory */}
                        <div className="glass rounded-3xl p-8 border border-white/10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center mb-6">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{t('profile.lifeTrajectory')}</h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    <div>
                                        <div className="text-xs text-gray-400">{t('profile.trajectory.goal')}</div>
                                        <div className="text-sm font-semibold capitalize">
                                            {lifeTrajectory.goal.replace('_', ' ')}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                    <Calendar className="w-5 h-5 text-cyan-400" />
                                    <div>
                                        <div className="text-xs text-gray-400">{t('profile.trajectory.timeframe')}</div>
                                        <div className="text-sm font-semibold">{lifeTrajectory.timeframe}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                    <Code className="w-5 h-5 text-blue-400" />
                                    <div>
                                        <div className="text-xs text-gray-400">{t('profile.trajectory.field')}</div>
                                        <div className="text-sm font-semibold">{lifeTrajectory.field}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Retake Onboarding */}
                    <div className="glass rounded-2xl p-6 border border-white/10 text-center">
                        <p className="text-gray-400 mb-4">{t('profile.retake.question')}</p>
                        <button
                            onClick={() => (window.location.href = '/onboarding')}
                            className="px-8 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-violet font-semibold hover:scale-105 transition-transform"
                        >
                            {t('profile.retake.button')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePage
