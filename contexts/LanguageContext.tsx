'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

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

export function LanguageProvider({ children }: { children: ReactNode }) {
  // IMPORTANT: always start as 'default'. The server has no access to
  // localStorage, so it always renders 'default'. If the client's first
  // render used a different value (e.g. read from localStorage in a lazy
  // initializer), React would see mismatched HTML between server and
  // client and throw a hydration error. Starting both at 'default' keeps
  // them identical for that first render.
  const [language, setLanguageState] = useState<SiteLanguage>('default')

  // After mount (client-only), sync from localStorage. This runs once,
  // after hydration has already succeeded, so updating state here just
  // causes a normal re-render — no mismatch.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SiteLanguage | null
      if (saved === 'my' || saved === 'th' || saved === 'default') {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync of external localStorage state into React state after mount; required for hydration safety (see comment above), the standard safe pattern for this case.
        setLanguageState(saved)
      }
    } catch {
      // localStorage unavailable — ignore, default language stays active
    }
  }, [])

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