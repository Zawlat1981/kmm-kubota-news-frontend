'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type TargetLang = 'my' | 'en'

export function useTranslatedTexts(originalTexts: string[]) {
  const { language } = useLanguage()
  const [texts, setTexts] = useState<string[]>(originalTexts)
  const [isLoading, setIsLoading] = useState(false)

  const originalTextsKey = originalTexts.join('|||')

  useEffect(() => {
    if (language === 'th') {
      const id = setTimeout(() => {
        setTexts(originalTexts)
        setIsLoading(false)
      }, 0)
      return () => clearTimeout(id)
    }

    if (!originalTexts || originalTexts.length === 0 || originalTexts.every((t) => !t || !t.trim())) {
      const id = setTimeout(() => setTexts(originalTexts), 0)
      return () => clearTimeout(id)
    }

    const target: TargetLang = language === 'my' ? 'my' : 'en'
    let cancelled = false

    const translate = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: originalTexts, target }),
        })
        if (cancelled) return
        if (!res.ok) {
          const txt = await res.text()
          console.error('Translate API fail', txt)
          setTexts(originalTexts)
          return
        }
        const data = await res.json()
        const translated = data.translated || data.texts || originalTexts
        if (Array.isArray(translated) && translated.length === originalTexts.length) {
          setTexts(translated)
        } else {
          setTexts(originalTexts)
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Translate hook error', e)
          setTexts(originalTexts)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    translate()

    return () => {
      cancelled = true
    }
  }, [language, originalTextsKey, originalTexts])

  return { texts, isLoading, isTranslated: language !== 'th' }
}

