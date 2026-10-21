'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type TargetLang = 'my' | 'en'
const cache = new Map<string, string[]>()

export function useTranslatedTitle(originalTitle: string) {
  const { language } = useLanguage()
  const [title, setTitle] = useState(originalTitle)
  useEffect(() => {
    if (language === 'th' || !originalTitle?.trim()) {
      const id = setTimeout(() => setTitle(originalTitle), 0)
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

export function useTranslatedTexts(originalTexts: string[]) {
  const { language } = useLanguage()
  const [texts, setTexts] = useState<string[]>(originalTexts)
  const [isLoading, setIsLoading] = useState(false)
  const key = originalTexts.join('|||')
  useEffect(() => {
    if (language === 'th') {
      const id = setTimeout(() => { setTexts(originalTexts); setIsLoading(false) }, 0)
      return () => clearTimeout(id)
    }
    if (!originalTexts?.length || originalTexts.every(t => !t?.trim())) {
      const id = setTimeout(() => setTexts(originalTexts), 0)
      return () => clearTimeout(id)
    }
    const cacheKey = `full:${language}:${key}`
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!
      if (cached.length === originalTexts.length) {
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
      body: JSON.stringify({ texts: originalTexts, target }),
    }).then(r => r.json()).then(data => {
      if (cancelled) return
      const translated = data.translated || data.texts || originalTexts
      if (Array.isArray(translated)) { cache.set(cacheKey, translated); setTexts(translated) }
    }).catch(() => { if (!cancelled) setTexts(originalTexts) }).finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true; clearTimeout(loadingId) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, key])
  return { texts, isLoading }
}

