'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type SiteLanguage = 'default' | 'my' | 'th'
// 'default' = show content exactly as entered in Sanity (no translation)
// 'my' = translate to Burmese
// 'th' = translate to Thai

interface LanguageContextValue {
  language: SiteLanguage
  setLanguage: (lang: SiteLanguage) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const STORAGE_KEY = 'kmm-site-language'

function getInitialLanguage(): SiteLanguage {
  if (typeof window === 'undefined') return 'default' // SSR: no localStorage available
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as SiteLanguage | null
    if (saved === 'my' || saved === 'th' || saved === 'default') {
      return saved
    }
  } catch {
    // localStorage unavailable — ignore, default language stays active
  }
  return 'default'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Lazy initializer reads localStorage once, on first client render —
  // avoids the extra render + setState-in-effect that a useEffect approach would need.
  const [language, setLanguageState] = useState<SiteLanguage>(getInitialLanguage)

  const setLanguage = (lang: SiteLanguage) => {
    setLanguageState(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}