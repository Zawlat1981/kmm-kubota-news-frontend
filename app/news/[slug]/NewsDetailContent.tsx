'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslatedTexts } from '@/hooks/useTranslatedTexts'
import { t } from '@/lib/i18n/uiText'

interface NewsDetailContentProps {
  title: string
  category?: string
  dateLabel?: string
  sourceUrl?: string
  imageUrl?: string
  galleryUrls?: string[]
  body?: string
}

export default function NewsDetailContent({
  title,
  category,
  dateLabel,
  sourceUrl,
  imageUrl,
  galleryUrls,
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

      {dateLabel && <p className="text-sm text-gray-400 mb-2">{dateLabel}</p>}

      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline mb-6"
        >
          🔗 {t('viewOriginalSource', language)}
        </a>
      )}

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

      {galleryUrls && galleryUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          {galleryUrls.map((url, i) => (
            <div key={i} className="rounded-lg overflow-hidden shadow-sm aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${title} - ${i + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </>
  )
}