'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const cache = new Map<string, string[]>()

export function useTranslatedTexts(originalTexts: string[], preserveThai = false) {
  const { language, isLanguageReady } = useLanguage()
  const showOriginal = preserveThai && language === 'th'
  const key = JSON.stringify(originalTexts)
  const cacheKey = `full:${language}:${key}`
  const [result, setResult] = useState<{ key: string; texts: string[]; error: boolean } | null>(null)
  const hasText = originalTexts.some((text) => text.trim())

  useEffect(() => {
    const source: string[] = JSON.parse(key)
    if (!isLanguageReady || showOriginal || !source.some((text) => text.trim()) || result?.key === cacheKey) return
    const controller = new AbortController()
    const cached = cache.get(cacheKey)
    if (cached) {
      const id = setTimeout(() => setResult({ key: cacheKey, texts: cached, error: false }), 0)
      return () => clearTimeout(id)
    }

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: source, target: language, strict: true }),
      signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok) throw new Error(`Translation HTTP error ${response.status}`)
      const data = await response.json()
      if (!Array.isArray(data.translated) || data.translated.length !== source.length ||
          !data.translated.every((text: unknown, index: number) =>
            typeof text === 'string' && (!source[index].trim() || text.trim()))) {
        throw new Error('Invalid translation response')
      }
      const translated: string[] = data.translated
      if (controller.signal.aborted) return
      cache.set(cacheKey, translated)
      setResult({ key: cacheKey, texts: translated, error: false })
    }).catch((error) => {
      if (controller.signal.aborted) return
      console.error('Translation failed:', error)
      setResult({ key: cacheKey, texts: source, error: true })
    })
    return () => controller.abort()
  }, [cacheKey, key, language, result?.key, showOriginal, isLanguageReady])

  return {
    texts: isLanguageReady && !showOriginal && result?.key === cacheKey ? result.texts : originalTexts,
    isLoading: hasText && (!isLanguageReady || (!showOriginal && result?.key !== cacheKey)),
    error: isLanguageReady && !showOriginal && result?.key === cacheKey && result.error,
  }
}

