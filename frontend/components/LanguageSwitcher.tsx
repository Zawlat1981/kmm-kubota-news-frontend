'use client'
import { useState, useRef, useEffect } from 'react'
import { useLanguage, SiteLanguage } from '@/contexts/LanguageContext'

const OPTIONS: { code: SiteLanguage; label: string; flag: string }[] = [
  { code: 'default', label: 'ไทย', flag: 'TH' },
  { code: 'my', label: 'မြန်မာ', flag: 'MM' },
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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-white text-sm"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <span className="text-xs">{open ? '^' : 'v'}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
          {OPTIONS.map((opt) => (
            <button
              key={opt.code}
              onClick={() => {
                setLanguage(opt.code)
                setOpen(false)
              }}
              className={`w-full flex gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 ${opt.code === language ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700'}`}
            >
              <span>{opt.flag}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

