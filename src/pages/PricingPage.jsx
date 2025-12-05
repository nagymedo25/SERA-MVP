import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Check, Crown, Zap, Shield, Star } from 'lucide-react'
import Navbar from '../components/Navbar'

const PricingPage = () => {
    const cardsRef = useRef([])
    
    const plans = [
        {
            name: 'Starter',
            price: 'Free',
            period: 'forever',
            features: ['Basic Onboarding', '2 Courses Access', 'Community Support', 'Basic Progress Tracking'],
            icon: Zap,
            color: 'text-white',
            buttonStyle: 'border border-white/20 hover:bg-white/10',
            popular: false
        },
        {
            name: 'Pro',
            price: '$29',
            period: '/month',
            features: ['Full AI Analysis', 'Unlimited Courses', 'Priority Support', 'Advanced Reports', 'Burnout Prevention'],
            icon: Star,
            color: 'text-neon-blue',
            buttonStyle: 'bg-gradient-to-r from-neon-blue to-blue-600 hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]',
            popular: true
        },
        {
            name: 'Master',
            price: '$99',
            period: '/month',
            features: ['1-on-1 Mentoring', 'Custom Career Path', 'Live Code Reviews', 'Certification', 'Job Placement'],
            icon: Crown,
            color: 'text-yellow-400',
            buttonStyle: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]',
            popular: false
        }
    ]

    useEffect(() => {
        gsap.fromTo(cardsRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.2)' }
        )
    }, [])

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-950 text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-violet/10 via-slate-950 to-slate-950" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 mb-6">
                            <Crown className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">Premium Access</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Future</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Choose the plan that fits your ambition. Unlock the full potential of your coding genome.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {plans.map((plan, index) => {
                            const Icon = plan.icon
                            return (
                                <div
                                    key={index}
                                    ref={el => cardsRef.current[index] = el}
                                    className={`relative p-8 rounded-[2rem] border transition-all duration-300 group
                                        ${plan.popular 
                                            ? 'bg-slate-900/80 border-neon-blue/50 shadow-2xl scale-105 z-10' 
                                            : 'bg-slate-900/40 border-white/10 hover:border-white/20'
                                        }
                                    `}
                                >
                                    {plan.popular && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neon-blue text-black font-bold px-4 py-1 rounded-full text-sm">
                                            MOST POPULAR
                                        </div>
                                    )}

                                    <div className="mb-8">
                                        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${plan.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-medium text-gray-400 mb-2">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-4xl font-bold ${plan.name === 'Master' ? 'text-yellow-400' : 'text-white'}`}>{plan.price}</span>
                                            <span className="text-gray-500">{plan.period}</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-neon-blue text-black' : 'bg-white/10 text-gray-400'}`}>
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                <span className="text-gray-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.buttonStyle}`}>
                                        Get Started
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PricingPage