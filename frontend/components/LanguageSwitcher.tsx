'use client'
import { useState, useRef, useEffect } from 'react'
import { useLanguage, SiteLanguage } from '@/contexts/LanguageContext'

const OPTIONS: { code: SiteLanguage; label: string; flag: string; full: string }[] = [
  { code: 'th', label: 'ไทย', flag: '🇹🇭', full: 'ไทย (ต้นฉบับ)' },
  { code: 'my', label: 'မြန်မာ', flag: '🇲🇲', full: 'မြန်မာလို' },
  { code: 'en', label: 'EN', flag: '🇬🇧', full: 'English' },
]

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const current = OPTIONS.find((o) => o.code === language) || OPTIONS[0]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white text-sm font-medium shadow-sm hover:bg-gray-50"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <span className="text-[10px]">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-xl z-50 overflow-hidden">
          {OPTIONS.map((opt) => (
            <button
              key={opt.code}
              onClick={() => { setLanguage(opt.code); setOpen(false) }}
              className={`w-full flex gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 ${opt.code === language ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-700'}`}
            >
              <span>{opt.flag}</span>
              <span>{opt.full}</span>
              {opt.code === language && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

