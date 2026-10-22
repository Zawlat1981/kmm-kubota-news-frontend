'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type TargetLang = 'my' | 'en'
const cache = new Map<string, string[]>()

export function useTranslatedTitle(originalTitle: string) {
  const { language } = useLanguage()
  const [title, setTitle] = useState(originalTitle)
  useEffect(() => {
    if (language === 'th' || typeof originalTitle !== 'string' || !originalTitle?.trim()) {
      const id = setTimeout(() => setTitle(typeof originalTitle === 'string' ? originalTitle : ''), 0)
      return () => clearTimeout(id)
    }
    const cacheKey = `title:${language}:${originalTitle}`
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)![0]
      const id = setTimeout(() => setTitle(cached), 0)
      return () => clearTimeout(id)
    }
    const target: TargetLang = language === 'my' ? 'my' : 'en'
    let cancelled = false
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: [originalTitle], target }),
    }).then(r => r.json()).then(data => {
      if (cancelled) return
      const t = data.translated?.[0] || data.texts?.[0] || originalTitle
      cache.set(cacheKey, [t])
      setTitle(t)
    }).catch(() => { if (!cancelled) setTitle(originalTitle) })
    return () => { cancelled = true }
  }, [language, originalTitle])
  return title
}

// ✅ FIX: any မသုံးဘူး - unknown သုံး → ESLint Error 0
export function useTranslatedTexts(originalTexts: string[]) {
  const { language } = useLanguage()
  const cleanInput = Array.isArray(originalTexts) 
    ? originalTexts.filter((t): t is string => typeof t === 'string')
    : []
  
  const [texts, setTexts] = useState<string[]>(cleanInput)
  const [isLoading, setIsLoading] = useState(false)
  const key = cleanInput.join('|||')

  useEffect(() => {
    // Brand Reset က object/undefined ဖြစ်ရင် string ပဲယူ
    const safeTexts = Array.isArray(originalTexts)
      ? originalTexts.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
      : []

    if (language === 'th') {
      const id = setTimeout(() => { 
        setTexts(Array.isArray(originalTexts) ? originalTexts.filter((t): t is string => typeof t === 'string') : [])
        setIsLoading(false) 
      }, 0)
      return () => clearTimeout(id)
    }

    if (!safeTexts.length) {
      const id = setTimeout(() => {
        setTexts(Array.isArray(originalTexts) ? originalTexts.filter((t): t is string => typeof t === 'string') : [])
      }, 0)
      return () => clearTimeout(id)
    }

    const cacheKey = `full:${language}:${key}`
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!
      if (cached.length === safeTexts.length) {
        const id = setTimeout(() => setTexts(cached), 0)
        return () => clearTimeout(id)
      }
    }

    const target: TargetLang = language === 'my' ? 'my' : 'en'
    let cancelled = false
    const loadingId = setTimeout(() => { if (!cancelled) setIsLoading(true) }, 0)

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: safeTexts, target }),
    }).then(r => r.json()).then(data => {
      if (cancelled) return
      const translated = data.translated || data.texts || safeTexts
      if (Array.isArray(translated)) { 
        cache.set(cacheKey, translated as string[])
        setTexts(translated as string[]) 
      }
    }).catch(() => { 
      if (!cancelled) setTexts(safeTexts) 
    }).finally(() => { 
      if (!cancelled) setIsLoading(false) 
    })

    return () => { cancelled = true; clearTimeout(loadingId) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, key])

  return { texts, isLoading }
}

