'use client'

/* eslint-disable @next/next/no-img-element */

import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslatedTexts } from '@/hooks/useTranslatedTexts'
import { t } from '@/lib/i18n/uiText'
import { urlFor } from '@/lib/sanity'
import Link from 'next/link'

interface NewsData {
  _id?: string
  title: string
  category?: string
  publishedAt?: string
  mainImage?: any
  body?: string
}

function formatCategory(category: string | undefined, language: any) {
  if (!category) return t('newsCategoryDefault', language) || 'NEWS'
  const normalizedCategory = category.toLowerCase()
  const cat = category.trim()
  
  if (cat.includes('မြန်မာနိုင်ငံ') || normalizedCategory.includes('myanmar')) return t('myanmarNews', language)
  if (cat.includes('လောင်စာဆီ') || normalizedCategory.includes('fuel-price') || normalizedCategory.includes('fuelprices') || normalizedCategory === 'fuel') return t('fuelPrices', language)
  if (cat.includes('ဈေးနှုန်း') || normalizedCategory.includes('crop-price') || normalizedCategory.includes('cropprices') || normalizedCategory === 'crop') return t('cropPrices', language)
  if (normalizedCategory.includes('exchange')) return t('exchangeRates', language)
  if (normalizedCategory.includes('kubota-zt') || normalizedCategory.includes('kubotazt')) return t('kubotaZtNews', language)
  if (cat.includes('Second') || cat.includes('second') || cat.includes('ဒုတိယလက်သုံး') || normalizedCategory.includes('second')) return t('kubotaSecondNews', language)
  if (normalizedCategory.includes('kubota')) return t('kubotaNews', language)
  if (normalizedCategory.includes('yanmar')) return t('yanmarNews', language)
  if (normalizedCategory.includes('john') || normalizedCategory.includes('deere') || normalizedCategory.includes('johndeere')) return t('johnDeereNews', language)
  if (normalizedCategory.includes('new-holland') || normalizedCategory.includes('newholland')) return t('newHollandNews', language)
  if (normalizedCategory.includes('yto')) return t('ytoNews', language)
  if (normalizedCategory.includes('sonalika')) return t('sonalikaNews', language)
  if (normalizedCategory.includes('yamabisi')) return t('yamabisiNews', language)
  if (normalizedCategory.includes('mahindra') && !normalizedCategory.includes('dongfeng')) return t('mahindraNews', language)
  if (normalizedCategory.includes('dongfeng')) return t('dongfengNews', language)
  if (normalizedCategory.includes('deutzfar') || normalizedCategory.includes('matador')) return t('deutzfarMatadorNews', language)
  if (cat.includes('Other Brand') || cat.includes('အခြား') || normalizedCategory.includes('otherbrand')) return t('otherBrandNews', language)
  
  return cat.toUpperCase()
}

export default function NewsDetailClient({ news }: { news: NewsData }) {
  const { language } = useLanguage()

  // 👇 FIX: Title + Body ကို မြန်မာ/ထိုင်း/English ပြန်မယ် - ပုံထဲကစာ မပြန်ဘူး
  const { texts } = useTranslatedTexts([
    news.title || '',
    news.body || '',
  ])

  const translatedTitle = texts[0] && texts[0].trim() !== '' ? texts[0] : news.title
  const translatedBody = texts[1] && texts[1].trim() !== '' ? texts[1] : news.body

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 bg-white text-gray-900 min-h-screen">
      <Link
        href="/"
        className="text-sm font-semibold text-red-600 hover:underline mb-6 inline-block"
      >
        {t('backToHome', language)}
      </Link>

      {news.category && (
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-2">
          {formatCategory(news.category, language)}
        </span>
      )}

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {translatedTitle}
      </h1>

      {news.publishedAt && (
        <p className="text-sm text-gray-400 mb-6">
          {new Date(news.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      )}

      {news.mainImage && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-md max-h-[450px]">
          <img
            src={urlFor(news.mainImage).url()}
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {translatedBody && (
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {translatedBody}
        </div>
      )}
    </main>
  )
}

