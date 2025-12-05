import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import LandingPage from './pages/LandingPage'
import Onboarding from './pages/Onboarding'
import Dashboard from './components/Dashboard'
import CoursePage from './pages/CoursePage'
import AssessmentPage from './pages/AssessmentPage'
import ReportsPage from './pages/ReportsPage'
import ProfilePage from './pages/ProfilePage'
import BreathingExercise from './components/wellness/BreathingExercise'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import CourseSetup from './pages/CourseSetup'       // ✅ جديد
import InitializingView from './pages/InitializingView' // ✅ جديد
import DomainSelection from './pages/DomainSelection'   // ✅ جديد
import CertificatePage from './pages/CertificatePage'   // ✅ جديد
import CourseJourneyPage from './pages/CourseJourneyPage'

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

                    {/* Protected Routes - المسارات المحمية */}
                    
                    {/* Onboarding & Domain Selection */}
                    <Route path="/onboarding" element={
                        <ProtectedRoute>
                            <Onboarding />
                        </ProtectedRoute>
                    } />
                    <Route path="/domain-selection" element={
                        <ProtectedRoute>
                            <DomainSelection />
                        </ProtectedRoute>
                    } />

                    {/* Dashboard & Main Features */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
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

                    {/* Learning Flow: Courses -> Setup -> Initializing -> Lesson */}
                    <Route path="/courses" element={
                        <ProtectedRoute>
                            <CoursePage />
                        </ProtectedRoute>
                    } />

                    <Route path="/journey/:courseId" element={
                        <ProtectedRoute>
                            <CourseJourneyPage />
                        </ProtectedRoute>
                    } />
                    
                    {/* ✅ هذا هو المسار الذي كان ناقصاً ويسبب المشكلة */}
                    <Route path="/course-setup" element={
                        <ProtectedRoute>
                            <CourseSetup />
                        </ProtectedRoute>
                    } />

                    <Route path="/initializing" element={
                        <ProtectedRoute>
                            <InitializingView />
                        </ProtectedRoute>
                    } />
                    
                    
                    <Route path="/assessment" element={
                        <ProtectedRoute>
                            <AssessmentPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/certificate" element={
                        <ProtectedRoute>
                            <CertificatePage />
                        </ProtectedRoute>
                    } />

                    {/* Catch all - أي رابط غير موجود يرجع للرئيسية */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </LanguageProvider>
    )
}

export default App