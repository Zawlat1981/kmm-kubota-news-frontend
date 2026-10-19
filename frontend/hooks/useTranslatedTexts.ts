'use client'

import { useEffect, useState, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

/**
 * Translates an array of strings into the currently selected site language.
 * Returns the original strings when language === 'default'.
 * Caches results in sessionStorage so switching pages / re-rendering
 * doesn't re-call the API for text already translated this session.
 */
export function useTranslatedTexts(originalTexts: string[]): {
  texts: string[]
  isTranslating: boolean
} {
  const { language } = useLanguage()
  // `translated` only ever holds the result of an actual API call.
  // When language is 'default' we don't touch this state at all —
  // the returned `texts` falls back to `originalTexts` directly (see below).
  const [translated, setTranslated] = useState<string[] | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const lastKeyRef = useRef<string>('')

  useEffect(() => {
    // 'default' language: nothing to fetch, nothing to set — just bail out.
    if (language === 'default') {
      lastKeyRef.current = ''
      return
    }

    const key = `${language}::${originalTexts.join('||')}`
    if (key === lastKeyRef.current) return
    lastKeyRef.current = key

    let cancelled = false

    async function run() {
      // Check sessionStorage cache first
      const cacheKey = `translate-cache::${key}`
      try {
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          // Async-callback setState (not a synchronous effect-body call) — safe.
          if (!cancelled) setTranslated(parsed)
          return
        }
      } catch {
        // ignore cache errors, fall through to API call
      }

      setIsTranslating(true)
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: originalTexts, target: language }),
        })
        if (!res.ok) throw new Error('Translation request failed')
        const data = await res.json()
        if (!cancelled) {
          setTranslated(data.translated)
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(data.translated))
          } catch {
            // storage full or unavailable — non-fatal
          }
        }
      } catch (err) {
        console.error('Translation error:', err)
        // Fall back to original text on failure
        if (!cancelled) setTranslated(null)
      } finally {
        if (!cancelled) setIsTranslating(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, originalTexts.join('||')])

  const texts = language === 'default' || !translated ? originalTexts : translated

  return { texts, isTranslating }
}