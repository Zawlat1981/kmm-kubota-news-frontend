'use client'

/* eslint-disable @next/next/no-img-element */

import { useLanguage, SiteLanguage } from '@/contexts/LanguageContext'
import { useTranslatedTexts } from '@/hooks/useTranslatedTexts'
import { t } from '@/lib/i18n/uiText'
import { urlFor } from '@/lib/sanity'
import Link from 'next/link'

type PortableTextChild = {
  text?: string
}

type PortableTextBlock = {
  _type: string
  children?: PortableTextChild[]
}

type SanityImage = {
  _type: string
  asset: {
    _ref: string
    _type: string
  }
}

interface NewsData {
  _id?: string
  title: string
  category?: string
  publishedAt?: string
  mainImage?: SanityImage
  body?: string | PortableTextBlock[]
  isBreaking?: boolean
}

function blocksToPlainText(blocks: string | PortableTextBlock[] | undefined): string {
  if (!blocks) return ''
  if (typeof blocks === 'string') return blocks
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) return ''
      return block.children.map((child) => child.text || '').join('')
    })
    .filter(Boolean)
    .join('\n\n')
}

function plainTextToParagraphs(text: string): string[] {
  return text.split('\n\n').filter(Boolean)
}

function formatCategory(category: string | undefined, language: SiteLanguage): string {
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

  // Dashboard: language th = original, my/en = translate
  const plainBody = blocksToPlainText(news.body)

  // For news section, keep original if needed? Requirement: news section only original? 
  // Logic: if language === 'th', no translate. my/en => translate via API
  const { texts, isLoading } = useTranslatedTexts([
    news.title || '',
    plainBody || '',
  ])

  const translatedTitle = texts[0] && texts[0].trim() !== '' ? texts[0] : news.title
  const translatedBodyRaw = texts[1] && texts[1].trim() !== '' ? texts[1] : plainBody
  const translatedParagraphs = plainTextToParagraphs(translatedBodyRaw)

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

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {isLoading ? 'Translating...' : translatedTitle}
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

      {news.mainImage ? (
        <div className="mb-8 rounded-xl overflow-hidden shadow-md max-h-[450px]">
          <img
            src={urlFor(news.mainImage).url()}
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}

      <div className="prose max-w-none text-gray-800 leading-relaxed text-[16px]">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        ) : translatedParagraphs.length > 0 ? (
          translatedParagraphs.map((para, idx) => (
            <p key={idx} className="mb-4 whitespace-pre-line">
              {para}
            </p>
          ))
        ) : (
          <p className="text-gray-500">No content</p>
        )}
      </div>

      {language !== 'th' && (
        <p className="text-xs text-gray-400 mt-8 italic">
          {language === 'my' ? 'မူရင်းထိုင်းဘာသာမှ အလိုအလျောက် ဘာသာပြန်ထားသည်' : 'Auto-translated from Thai original'}
        </p>
      )}
    </main>
  )
}

