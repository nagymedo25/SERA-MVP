import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
import LoginPage from './pages/LoginPage' // New
import SignupPage from './pages/SignupPage' // New
import ProtectedRoute from './components/auth/ProtectedRoute' // New
import useSimulationStore from './store/simulationStore'

function App() {
    return (
        <LanguageProvider>
            <Router>
                <BreathingExercise />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected Routes */}
                    <Route path="/onboarding" element={
                        <ProtectedRoute>
                            <Onboarding />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/courses" element={
                        <ProtectedRoute>
                            <CoursePage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/lesson/:lessonId" element={
                        <ProtectedRoute>
                            <LessonViewer />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/assessment" element={
                        <ProtectedRoute>
                            <AssessmentPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/reports" element={
                        <ProtectedRoute>
                            <ReportsPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </LanguageProvider>
    )
}

export default App