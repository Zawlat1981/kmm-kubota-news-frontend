'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslatedTexts } from '@/hooks/useTranslatedTexts'
import { extraText } from '@/lib/i18n/extraText'

function VisibleNewsTitle({ title, textClassName }: { title: string; textClassName?: string }) {
  const { language } = useLanguage()
  const { texts, isLoading, error } = useTranslatedTexts([title], true)
  return <><span className={textClassName}>{texts[0]}</span>{isLoading && <span role="status" className="block text-xs text-gray-500">{extraText(language).translating}</span>}{error && <span role="alert" className="block text-xs text-red-700">{extraText(language).translationError}</span>}</>
}

export default function NewsTitle({ title, textClassName }: { title: string; textClassName?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      const id = setTimeout(() => setVisible(true), 0)
      return () => clearTimeout(id)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '200px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <span ref={ref}>{visible ? <VisibleNewsTitle title={title} textClassName={textClassName} /> : <span className={textClassName}>{title}</span>}</span>
}
