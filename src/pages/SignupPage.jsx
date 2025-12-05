import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useSimulationStore from '../store/simulationStore' // تأكد من المسار
import Navbar from '../components/Navbar'
import { User, Mail, Lock, ArrowRight } from 'lucide-react'

const SignupPage = () => {
    const navigate = useNavigate()
    
    // ✅ الطريقة الآمنة لاستدعاء الدالة
    const signup = useSimulationStore((state) => state.signup)
    
    const [formData, setFormData] = useState({ email: '', password: '', name: '' })
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // التحقق من وجود الدالة قبل استدعائها
        if (!signup) {
            console.error("Signup function not found in store!");
            return;
        }

        const result = signup(formData.email, formData.password, formData.name); 
        
        if (result && result.success) {
            navigate('/onboarding');
        } else {
            setError(result?.message || "حدث خطأ ما");
        }
    };

    // ... (باقي كود التصميم كما هو)
    return (
        // ... (نفس الـ JSX القديم)
        // تأكد فقط من وجود {error && ...} لعرض رسالة الخطأ
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
                {/* ... نفس الخلفية ... */}
                <div className="glass p-8 rounded-3xl w-full max-w-md border border-white/10 relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">حساب جديد</h2>

                    {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ... نفس حقول الإدخال ... */}
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">الاسم الكامل</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-violet outline-none transition-colors"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-violet outline-none transition-colors"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-neon-violet outline-none transition-colors"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-violet to-neon-pink font-bold text-white hover:scale-105 transition-transform flex items-center justify-center gap-2">
                            <span>إنشاء الحساب</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-400 text-sm">
                        لديك حساب بالفعل؟ <Link to="/login" className="text-neon-violet hover:underline">سجل دخولك</Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default SignupPage