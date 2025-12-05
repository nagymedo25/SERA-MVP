import React from 'react'
import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'

// الصفحات
import LandingPage from './pages/LandingPage'
import Onboarding from './pages/Onboarding'
import Dashboard from './components/Dashboard'
import CoursePage from './pages/CoursePage'
import AssessmentPage from './pages/AssessmentPage'
import ReportsPage from './pages/ReportsPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CourseSetup from './pages/CourseSetup'
import InitializingView from './pages/InitializingView'
import DomainSelection from './pages/DomainSelection'
import CertificatePage from './pages/CertificatePage'
import CourseJourneyPage from './pages/CourseJourneyPage'
import LessonViewer from './pages/LessonViewer'

// المكونات الإضافية
import BreathingExercise from './components/wellness/BreathingExercise'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DevTools from './components/DevTools'

// ✅ استيراد الانميشن الوحيد المعتمد
import ColumnTransition from './components/ColumnTransition'
import PricingPage from './pages/PricingPage'

function App() {
    return (
        <LanguageProvider>
            <Router>
                {/* مكونات تعمل فوق كل شيء */}
                <BreathingExercise />
                <DevTools />

                {/* ✅ هنا الحل: تأكد أنك لا تستخدم PageTransition داخل Routes أو حولها */}
                {/* ColumnTransition يدير كل شيء بداخله */}
                <ColumnTransition>
                    <Route path="/" element={<LandingPage />} />

                    {/* صفحات المصادقة (تأكدنا من إزالة الناف بار منها) */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    <Route path="/pricing" element={<PricingPage />} /> {/* ✅ مسار صفحة الأسعار */}

                    {/* Protected Routes */}
                    {/* ✅ إضافة صفحة اختيار المجال كصفحة محمية */}
                    <Route path="/domain-selection" element={<ProtectedRoute><DomainSelection /></ProtectedRoute>} />

                    {/* الصفحات المحمية */}
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
                    <Route path="/lesson/:lessonId" element={<ProtectedRoute><LessonViewer /></ProtectedRoute>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </ColumnTransition>

            </Router>
        </LanguageProvider>
    )
}

export default App