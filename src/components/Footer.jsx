import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Github, Twitter, Linkedin, Mail, Heart, Sparkles, Code2, Cpu } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
    const { t } = useLanguage()
    const footerRef = useRef(null)
    const floatingIconsRef = useRef([])

    useEffect(() => {
        // Animate floating icons
        floatingIconsRef.current.forEach((icon, index) => {
            if (icon) {
                gsap.to(icon, {
                    y: -20,
                    duration: 2 + index * 0.3,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                    delay: index * 0.2
                })
            }
        })

        // Footer reveal animation
        gsap.fromTo(footerRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: 'top bottom-=100',
                    toggleActions: 'play none none reverse'
                }
            }
        )
    }, [])

    const socialLinks = [
        { icon: Github, href: '#', label: 'GitHub' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Mail, href: '#', label: 'Email' }
    ]

    const quickLinks = [
        { labelKey: 'landing.footer.about', href: '#' },
        { labelKey: 'landing.footer.features', href: '#features' },
        { labelKey: 'landing.footer.howItWorks', href: '#mindprint' },
        { labelKey: 'landing.footer.testimonials', href: '#' },
        { labelKey: 'landing.footer.blog', href: '#' },
        { labelKey: 'landing.footer.careers', href: '#' }
    ]

    const legalLinks = [
        { labelKey: 'landing.footer.privacy', href: '#' },
        { labelKey: 'landing.footer.terms', href: '#' },
        { labelKey: 'landing.footer.cookies', href: '#' },
        { label: 'GDPR', href: '#' }
    ]

    return (
        <footer ref={footerRef} className="relative z-10 mt-32 overflow-hidden">
            {/* Crazy Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-neon-violet/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                {/* Floating Icons */}
                <div
                    ref={(el) => (floatingIconsRef.current[0] = el)}
                    className="absolute top-20 left-1/4 opacity-10"
                >
                    <Code2 className="w-12 h-12 text-neon-blue" />
                </div>
                <div
                    ref={(el) => (floatingIconsRef.current[1] = el)}
                    className="absolute top-40 right-1/4 opacity-10"
                >
                    <Cpu className="w-16 h-16 text-neon-violet" />
                </div>
                <div
                    ref={(el) => (floatingIconsRef.current[2] = el)}
                    className="absolute bottom-40 left-1/3 opacity-10"
                >
                    <Sparkles className="w-14 h-14 text-neon-blue" />
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="relative glass border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="space-y-6">
                            <span className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-violet bg-clip-text text-transparent">
                                SERA
                            </span>
                            <p className="text-gray-400 leading-relaxed">
                                {t('landing.footer.description')}
                            </p>
                            <div className="flex gap-4">
                                {socialLinks.map((social, index) => {
                                    const Icon = social.icon
                                    return (
                                        <a
                                            key={index}
                                            href={social.href}
                                            aria-label={social.label}
                                            className="w-10 h-10 rounded-lg glass hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:glow-blue group"
                                        >
                                            <Icon className="w-5 h-5 text-gray-400 group-hover:text-neon-blue transition-colors" />
                                        </a>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-white">{t('landing.footer.quickLinks')}</h3>
                            <ul className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-gray-400 hover:text-neon-blue transition-colors duration-300 flex items-center gap-2 group"
                                        >
                                            <span className="w-0 h-0.5 bg-neon-blue group-hover:w-4 transition-all duration-300" />
                                            {t(link.labelKey)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-white">{t('landing.footer.legal')}</h3>
                            <ul className="space-y-3">
                                {legalLinks.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-gray-400 hover:text-neon-violet transition-colors duration-300 flex items-center gap-2 group"
                                        >
                                            <span className="w-0 h-0.5 bg-neon-violet group-hover:w-4 transition-all duration-300" />
                                            {link.labelKey ? t(link.labelKey) : link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-white">{t('landing.footer.stayUpdated')}</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                {t('landing.footer.newsletterDesc')}
                            </p>
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    placeholder={t('landing.footer.emailPlaceholder')}
                                    className="w-full px-4 py-3 rounded-lg glass border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all duration-300"
                                />
                                <button className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-violet text-white font-semibold hover:scale-105 transition-transform duration-300 glow-blue">
                                    {t('landing.footer.subscribe')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Divider with gradient */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

                    {/* Bottom Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} SERA. {t('landing.footer.rights')}
                        </p>

                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-gray-500 hover:text-neon-blue transition-colors">
                                {t('landing.footer.status')}
                            </a>
                            <a href="#" className="text-gray-500 hover:text-neon-blue transition-colors">
                                {t('landing.footer.support')}
                            </a>
                            <a href="#" className="text-gray-500 hover:text-neon-blue transition-colors">
                                {t('landing.footer.api')}
                            </a>
                        </div>
                    </div>

                    {/* Crazy animated accent line */}
                    <div className="mt-8 h-1 w-full bg-gradient-to-r from-neon-blue via-neon-violet to-neon-blue bg-[length:200%_100%] animate-gradient rounded-full" />
                </div>
            </div>
        </footer>
    )
}

export default Footer
