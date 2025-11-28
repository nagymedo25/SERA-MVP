import React ,{ useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
    const navRef = useRef(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            setIsMobileMenuOpen(false)
        }
    }

    const navItems = [
        { label: 'Home', id: 'hero' },
        { label: 'Features', id: 'features' },
        { label: 'How It Works', id: 'mindprint' },
        { label: 'Philosophy', id: 'philosophy' },
        { label: 'Contact', id: 'cta' },
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
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
                    <img
                        src="src/assets/logo.png"
                        alt="SERA Logo"
                        className="h-20  w-20  object-contain"
                    />
                </div>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-8">
                    {navItems.map((item, index) => (
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

                {/* CTA Button */}
                <button
                    onClick={() => scrollToSection('cta')}
                    className="hidden md:block px-6 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-violet text-white font-semibold hover:scale-105 transition-transform duration-300 glow-blue"
                >
                    Get Started
                </button>

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
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => scrollToSection(item.id)}
                                className="w-full text-left text-gray-300 hover:text-white transition-colors duration-300 font-medium py-2"
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => scrollToSection('cta')}
                            className="w-full mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-violet text-white font-semibold"
                        >
                            Get Started
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
