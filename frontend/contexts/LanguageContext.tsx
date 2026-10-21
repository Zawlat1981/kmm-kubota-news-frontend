'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type SiteLanguage = 'th' | 'my' | 'en'

interface LanguageContextType {
  language: SiteLanguage
  setLanguage: (lang: SiteLanguage) => void
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'th',
  setLanguage: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>('th')

  useEffect(() => {
    const saved = localStorage.getItem('site-language') as SiteLanguage | null
    if (saved && ['th', 'my', 'en'].includes(saved)) {
      const t = setTimeout(() => setLanguageState(saved), 0)
      return () => clearTimeout(t)
    }
  }, [])

  const setLanguage = (lang: SiteLanguage) => {
    setLanguageState(lang)
    localStorage.setItem('site-language', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

