import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { Menu, X, Home, BookOpen, FileText, BarChart3, User } from 'lucide-react'
import useSimulationStore from '../store/simulationStore'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../contexts/LanguageContext'
import Logo from '../assets/Logo.png'


const Navbar = () => {
    const navRef = useRef(null)
    const location = useLocation()
    const [isScrolled, setIsScrolled] = useState(false)
    const { t } = useLanguage()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user } = useSimulationStore()

    const isLandingPage = location.pathname === '/'
    const isOnboarding = location.pathname === '/onboarding'

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (navRef.current) {
            gsap.fromTo(navRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
            )
        }
    }, [])

    // Hide navbar on onboarding
    if (isOnboarding) return null

    // Landing page navigation
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            setIsMobileMenuOpen(false)
        }
    }

    const landingNavItems = [
        { label: t('navbar.features'), id: 'features' },
        { label: t('navbar.about'), id: 'philosophy' },
        { label: t('navbar.contact'), id: 'cta' },
    ]

    // App navigation
    const appNavItems = [
        { label: t('navbar.dashboard'), path: '/dashboard', icon: Home },
        { label: t('navbar.courses'), path: '/courses', icon: BookOpen },
        { label: t('navbar.assessment'), path: '/assessment', icon: FileText },
        { label: t('navbar.reports'), path: '/reports', icon: BarChart3 },
        { label: t('navbar.profile'), path: '/profile', icon: User },
    ]

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'glass py-4 shadow-lg shadow-neon-blue/10'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src={Logo}
                        alt="SERA Logo"
                        className="h-12 w-[80px] object-contain"
                    />
                </Link>

                {/* Desktop Navigation - Landing Page */}
                {isLandingPage && (
                    <div className="hidden md:flex items-center gap-6">
                        <ul className="flex items-center gap-8">
                            {landingNavItems.map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => scrollToSection(item.id)}
                                        className="text-gray-300 hover:text-white transition-colors duration-300 font-medium relative group"
                                    >
                                        {item.label}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-blue to-neon-violet group-hover:w-full transition-all duration-300" />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <Link
                            to={user?.hasCompletedOnboarding ? '/dashboard' : '/onboarding'}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-violet text-white font-semibold hover:scale-105 transition-transform duration-300 glow-blue"
                        >
                            {t('landing.cta.button')}
                        </Link>

                        <LanguageSwitcher />
                    </div>
                )}

                {/* Desktop Navigation - App */}
                {!isLandingPage && (
                    <div className="hidden md:flex items-center gap-6">
                        <ul className="flex items-center gap-6">
                            {appNavItems.map((item) => {
                                const Icon = item.icon
                                const isActive = location.pathname === item.path

                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${isActive
                                                ? 'bg-gradient-to-r from-neon-blue to-neon-violet text-white'
                                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.label}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>

                        <LanguageSwitcher />
                    </div>
                )}

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden text-white p-2"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden absolute top-full left-0 right-0 glass overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 border-t border-white/10' : 'max-h-0'
                    }`}
            >
                <ul className="px-6 py-4 space-y-4">
                    {isLandingPage
                        ? landingNavItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => scrollToSection(item.id)}
                                    className="w-full text-left text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))
                        : appNavItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                </li>
                            )
                        })}
                    <li className="pt-4 border-t border-white/10 flex justify-center">
                        <LanguageSwitcher />
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
