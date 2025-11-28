import React, { createContext, useContext, useState, useEffect } from 'react'
import translations from '../translations'

const LanguageContext = createContext()

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider')
    }
    return context
}

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('sera-language')
        return saved || 'en'
    })

    const [isChanging, setIsChanging] = useState(false)

    useEffect(() => {
        localStorage.setItem('sera-language', language)
        document.documentElement.lang = language
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    }, [language])

    const changeLanguage = (newLang) => {
        if (newLang === language) return

        setIsChanging(true)

        setTimeout(() => {
            setLanguage(newLang)
            setTimeout(() => {
                setIsChanging(false)
            }, 300)
        }, 300)
    }

    const t = (key) => {
        const keys = key.split('.')
        let value = translations[language]

        for (const k of keys) {
            value = value?.[k]
        }

        return value || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, isChanging }}>
            {children}
        </LanguageContext.Provider>
    )
}
