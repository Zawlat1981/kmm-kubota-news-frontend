'use client'

/* eslint-disable @next/next/no-img-element */
import { useLanguage, SiteLanguage } from '@/contexts/LanguageContext'
import { useTranslatedTexts } from '@/hooks/useTranslatedTexts'
import { t } from '@/lib/i18n/uiText'
import { urlFor } from '@/lib/sanity'
import Link from 'next/link'

type PortableTextChild = { text?: string }
type PortableTextBlock = { _type: string; children?: PortableTextChild[] }
type SanityImage = { _type: string; asset: { _ref: string; _type: string } }

interface NewsData {
  _id?: string
  title: string
  category?: string
  publishedAt?: string
  mainImage?: SanityImage
  body?: string | PortableTextBlock[]
  sourceUrl?: string
}

function blocksToPlainText(blocks: string | PortableTextBlock[] | undefined): string {
  if (!blocks) return ''
  if (typeof blocks === 'string') return blocks
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map((b) => {
      if (b._type !== 'block' || !b.children) return ''
      return b.children.map((c) => c.text || '').join('')
    })
    .filter(Boolean)
    .join('\n\n')
}

function formatCategory(category: string | undefined, language: SiteLanguage): string {
  if (!category) return t('newsCategoryDefault', language) || 'NEWS'
  const n = category.toLowerCase()
  if (n.includes('myanmar')) return t('myanmarNews', language)
  if (n.includes('fuel')) return t('fuelPrices', language)
  if (n.includes('crop')) return t('cropPrices', language)
  if (n.includes('exchange')) return t('exchangeRates', language)
  if (n.includes('kubota')) return t('kubotaNews', language)
  return category.toUpperCase()
}

export default function NewsDetailClient({ news }: { news: NewsData }) {
  const { language } = useLanguage()
  const plainBody = blocksToPlainText(news.body)
  const { texts, isLoading } = useTranslatedTexts([news.title || '', plainBody || ''])
  const translatedTitle = texts[0] || news.title
  const translatedBodyRaw = texts[1] || plainBody
  const paragraphs = translatedBodyRaw.split('\n\n').filter(Boolean)

  // Source label text based on language
  const sourceLabel = language === 'my' ? 'မူရင်းသတင်း' : language === 'th' ? 'แหล่งข่าวต้นฉบับ' : 'Source'

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 bg-white text-gray-900 min-h-screen">
      <Link href="/" className="text-sm font-semibold text-red-600 hover:underline mb-6 inline-block">
        ← {t('backToHome', language)}
      </Link>

      {news.category && (
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-2">
          {formatCategory(news.category, language)}
        </span>
      )}

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
        {translatedTitle}
        {isLoading && <span className="ml-2 text-sm font-normal text-gray-400 animate-pulse">•</span>}
      </h1>

      {/* DATE + SOURCE LINK - RED BOX AREA FROM YOUR IMAGE */}
      <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
        {news.publishedAt && (
          <span className="text-gray-400">
            {new Date(news.publishedAt).toLocaleDateString(language === 'my' ? 'my-MM' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        )}
        
        {news.sourceUrl && (
          <>
            <span className="text-gray-300">|</span>
            <a
              href={news.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
            >
              🔗 {sourceLabel}
            </a>
          </>
        )}
      </div>

      {news.mainImage && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-md max-h-[500px]">
          <img src={urlFor(news.mainImage).url()} alt={news.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="prose max-w-none text-gray-800 leading-relaxed text-[16px]">
        {paragraphs.length > 0 ? (
          paragraphs.map((para, idx) => (
            <p key={idx} className="mb-4 whitespace-pre-line">
              {para}
            </p>
          ))
        ) : (
          <p className="text-gray-500">No content</p>
        )}
      </div>

      {language !== 'th' && !isLoading && (
        <p className="text-xs text-gray-400 mt-8 italic">
          {language === 'my' ? 'မူရင်းထိုင်းဘာသာမှ အလိုအလျောက် ဘာသာပြန်ထားသည်' : 'Auto-translated from Thai original'}
        </p>
      )}
    </main>
  )
}

