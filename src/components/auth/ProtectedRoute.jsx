import React from 'react'
import { Navigate } from 'react-router-dom'
import useSimulationStore from '../../store/simulationStore'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSimulationStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute