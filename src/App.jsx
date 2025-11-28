import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import LandingPage from './pages/LandingPage'
import Onboarding from './pages/Onboarding'
import Dashboard from './components/Dashboard'
import CoursePage from './pages/CoursePage'
import LessonViewer from './pages/LessonViewer'
import AssessmentPage from './pages/AssessmentPage'
import ReportsPage from './pages/ReportsPage'
import ProfilePage from './pages/ProfilePage'
import BreathingExercise from './components/wellness/BreathingExercise'

function App() {
    return (
        <LanguageProvider>
            <Router>
                {/* Global Breathing Exercise Modal */}
                <BreathingExercise />

                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/courses" element={<CoursePage />} />
                    <Route path="/lesson/:lessonId" element={<LessonViewer />} />
                    <Route path="/assessment" element={<AssessmentPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </Router>
        </LanguageProvider>
    )
}

export default App
