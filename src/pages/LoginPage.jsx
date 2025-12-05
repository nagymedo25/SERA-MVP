import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useSimulationStore from '../store/simulationStore'
import Navbar from '../components/Navbar'
import { Mail, Lock, LogIn } from 'lucide-react'

const LoginPage = () => {
    const navigate = useNavigate()
    
    // ✅ الطريقة الآمنة لاستدعاء الدالة
    const login = useSimulationStore((state) => state.login)
    
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!login) {
            console.error("Login function not found!");
            return;
        }

        const result = login(formData.email, formData.password);
        
        if (result && result.success) {
            navigate('/dashboard');
        } else {
            setError(result?.message || "البريد أو كلمة المرور خطأ");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
                 <div className="absolute top-20 left-10 w-96 h-96 gradient-orb-1 animate-float" />
                <div className="glass p-8 rounded-3xl w-full max-w-md border border-white/10 relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">تسجيل الدخول</h2>
                    
                    {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input 
                                    type="email" 
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-blue outline-none transition-colors"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input 
                                    type="password" 
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-blue outline-none transition-colors"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-violet font-bold text-white hover:scale-105 transition-transform flex items-center justify-center gap-2">
                            <span>دخول</span>
                            <LogIn className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-400 text-sm">
                        ليس لديك حساب؟ <Link to="/signup" className="text-neon-blue hover:underline">إنشاء حساب جديد</Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default LoginPage