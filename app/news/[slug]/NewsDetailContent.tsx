'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslatedTexts } from '@/hooks/useTranslatedTexts'

interface NewsDetailContentProps {
  title: string
  category?: string
  dateLabel?: string
  imageUrl?: string
  body?: string
}

export default function NewsDetailContent({
  title,
  category,
  dateLabel,
  imageUrl,
  body,
}: NewsDetailContentProps) {
  const { language } = useLanguage()

  // Translate title, category and body together in a single batch call.
  const { texts, isTranslating } = useTranslatedTexts([
    title || '',
    category || '',
    body || '',
  ])
  const [tTitle, tCategory, tBody] = texts

  return (
    <>
      {category && (
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-2">
          {tCategory}
        </span>
      )}

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {tTitle}
        {isTranslating && language !== 'default' && (
          <span className="ml-2 text-sm font-normal text-gray-400 align-middle">
            …
          </span>
        )}
      </h1>

      {dateLabel && <p className="text-sm text-gray-400 mb-6">{dateLabel}</p>}

      {imageUrl && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-md max-h-[450px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {body && (
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {tBody}
        </div>
      )}
    </>
  )
}