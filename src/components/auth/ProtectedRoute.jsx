import React from 'react'
import { Navigate } from 'react-router-dom'
import useSimulationStore from '../../store/simulationStore'

const ProtectedRoute = ({ children }) => {
    // 🛑 الخطأ كان هنا: const { isAuthenticated } = ...
    // ✅ التصحيح: نتحقق من وجود الكائن "user"
    const user = useSimulationStore((state) => state.user)

    // إذا لم يكن هناك مستخدم (user = null)، وجهه لصفحة الدخول
    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute