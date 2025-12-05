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
import CourseSetup from './pages/CourseSetup'       
import InitializingView from './pages/InitializingView' 
import DomainSelection from './pages/DomainSelection'   
import CertificatePage from './pages/CertificatePage'   
import CourseJourneyPage from './pages/CourseJourneyPage'
import LessonViewer from './pages/LessonViewer' // تأكد من استيراد هذا إذا لم يكن موجوداً
import DevTools from './components/DevTools' // ✅ إضافة استيراد DevTools

function App() {
    return (
        <LanguageProvider>
            <Router>
                <BreathingExercise />
                <DevTools /> {/* ✅ إضافة الزر هنا ليظهر في كل الصفحات */}
                
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected Routes */}
                    <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                    <Route path="/domain-selection" element={<ProtectedRoute><DomainSelection /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/courses" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
                    <Route path="/journey/:courseId" element={<ProtectedRoute><CourseJourneyPage /></ProtectedRoute>} />
                    <Route path="/course-setup" element={<ProtectedRoute><CourseSetup /></ProtectedRoute>} />
                    <Route path="/initializing" element={<ProtectedRoute><InitializingView /></ProtectedRoute>} />
                    <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
                    <Route path="/certificate" element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
                    {/* إضافة مسار الدرس إذا كان ناقصاً */}
                    <Route path="/lesson/:lessonId" element={<ProtectedRoute><LessonViewer /></ProtectedRoute>} /> 

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </LanguageProvider>
    )
}

export default App