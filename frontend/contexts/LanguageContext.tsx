'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type SiteLanguage = 'th' | 'my' | 'en'

interface LanguageContextType {
  language: SiteLanguage
  setLanguage: (lang: SiteLanguage) => void
  isLanguageReady: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  isLanguageReady: false,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>('en')
  const [isLanguageReady, setLanguageReady] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('site-language') as SiteLanguage | null
    const timer = setTimeout(() => {
      if (saved && ['th', 'my', 'en'].includes(saved)) setLanguageState(saved)
      setLanguageReady(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: SiteLanguage) => {
    setLanguageState(lang)
    localStorage.setItem('site-language', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLanguageReady }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

