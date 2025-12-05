import React from 'react'
import { Settings, Zap } from 'lucide-react'
import useSimulationStore from '../store/simulationStore'

const DevTools = () => {
    const { forcePassExam } = useSimulationStore()

    return (
        <div className="fixed bottom-6 right-6 z-[100] group">
            <button
                onClick={forcePassExam}
                className="p-4 bg-slate-900/90 text-gray-500 hover:text-green-400 rounded-full border border-white/10 hover:border-green-500/50 shadow-2xl hover:shadow-green-500/20 transition-all duration-500 relative overflow-hidden"
                title="Dev Mode: Force Pass Active Exam"
            >
                {/* تأثير الدوران عند التحويم */}
                <Settings className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                
                {/* وميض عند الضغط (يمكن إضافته كـ Active state) */}
                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-active:opacity-100 transition-opacity" />
            </button>
            
            {/* Tooltip */}
            <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1 bg-slate-900 border border-white/10 rounded text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Force Success 🚀
            </span>
        </div>
    )
}

export default DevTools