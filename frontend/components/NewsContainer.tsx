'use client'
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, Search, SlidersHorizontal, X } from 'lucide-react'
import { urlFor } from '../lib/sanity'
import { useLanguage } from '@/contexts/LanguageContext'
import CompanyCards from '@/components/CompanyCards'
import PriceBrowser from '@/components/PriceBrowser'
import NewsTitle from '@/components/NewsTitle'
import type { CompanyItem } from '@/lib/company'
import { PRICE_BRANDS, type PriceItem } from '@/lib/prices'
import { t } from '@/lib/i18n/uiText'
import { extraText } from '@/lib/i18n/extraText'
import { formatLocalizedDate } from '@/lib/i18n/date'
import { newsCategoryKey } from '@/lib/i18n/newsCategory'
import type { SiteLanguage } from '@/contexts/LanguageContext'

interface NewsItem {
  _id?: string
  title: string
  brand?: string
  slug?: { current: string }
  category?: string
  publishedAt?: string
  mainImage?: Record<string, unknown>
  body?: string
}

interface NewsContainerProps {
  newsList: NewsItem[]
  companiesList?: CompanyItem[]
  priceList?: PriceItem[]
}

const facebookPages = [
  { name: 'KMM Kubota Mawlamyine', url: 'https://www.facebook.com/kmmkubota' },
  { name: 'KMM Kubota Tharyarwaddy', url: 'https://www.facebook.com/kmmkubotatyd' },
  { name: 'KMM Kubota Nawnghkio', url: 'https://www.facebook.com/profile.php?id=100076295352470' },
]

function formatCategory(category: string | undefined, language: SiteLanguage) {
  const key = newsCategoryKey(category)
  return key ? t(key, language) : category || ''
}

function normalizeNewsCategory(category?: string) {
  return (category || '').toLowerCase().replace(/[^a-z0-9]/g, '').replace(/news$/, '').trim()
}

const categoryExactMap: Record<string, string[]> = {
  'myanmar-news': ['myanmar', 'myanmarnews', 'myanmar-news'],
  'fuel-prices': ['fuelprice', 'fuelprices', 'fuel'],
  'crop-prices': ['cropprice', 'cropprices', 'crop'],
  'exchange-rates': ['exchangerate', 'exchangerates', 'exchange'],
  'kubota-news': ['kubota'],
  'kubota-second-news': ['kubotasecond', 'second', 'kubota2nd', 'kubotasecondhand', 'kubotasecondhandnews'],
  'kubota-zt-news': ['kubotazt', 'zt', 'kubotaztnews'],
  'yanmar-news': ['yanmar', 'yanmarnews', 'yammar'],
  'john-deere-news': ['johndeere', 'jdeere', 'johndeerenews'],
  'new-holland-news': ['newholland', 'newhollandnews'],
  'yto-news': ['yto', 'ytonews'],
  'sonalika-news': ['sonalika', 'sonalikanews'],
  'yamabisi-news': ['yamabisi', 'yamabisinews'],
  'mahindra-news': ['mahindra', 'mahindranews'],
  'dongfeng-news': ['dongfeng', 'dongfengnews'],
  'mahindra-dongfeng-news': ['mahindradongfeng', 'mahindraanddongfeng', 'mahindradongfengnews', 'mahindraanddongfengnews'],
  'mahindra-and-dongfeng-news': ['mahindradongfeng', 'mahindraanddongfeng', 'mahindradongfengnews', 'mahindraanddongfengnews'],
  'deutz-fahr-matador-news': ['deutzfahrmatador', 'deutzfahrandmatador', 'deutzfahrmatadornews', 'deutzfahrandmatadornews', 'deutzfahr', 'deutz-fahr', 'matador', 'deutzfahrmatador-news', 'deutz-fahr-matador-news'],
  'deutz-fahr-and-matador-news': ['deutzfahrmatador', 'deutzfahrandmatador', 'deutzfahrmatadornews', 'deutzfahrandmatadornews'],
  'deutzfar-matador-news': ['deutzfarmatador', 'deutzfarandmatador', 'deutzfahrmatador', 'deutzfahrandmatador', 'matador', 'deutzfharandmatador', 'deutzfharandmatadornews'],
  'deutzfhar-matador-news': ['deutzfahrmatador', 'deutzfahrandmatador', 'deutzfharandmatador', 'deutzfharandmatadornews'],
  'deutzfhar-and-matador-news': ['deutzfahrmatador', 'deutzfahrandmatador', 'deutzfharandmatador', 'deutzfharandmatadornews'],
  'other-brand-news': ['otherbrand', 'otherbrandnews'],
}

function isCategoryMatch(newsCategory: string | undefined, selectedCategory: string): boolean {
  const normalizedNews = normalizeNewsCategory(newsCategory)
  const normalizedSelected = normalizeNewsCategory(selectedCategory)
  if (!normalizedNews) return false
  if (normalizedNews === normalizedSelected) return true
  const allowed = categoryExactMap[selectedCategory] || []
  // Direct allowed check first (handles all 3 missing: kubota-second, mahindra-dongfeng, deutzfhar-matador)
  if (allowed.includes(normalizedNews)) return true
  if (selectedCategory === 'kubota-news') {
    if (normalizedNews.includes('second')) return false
    return normalizedNews === 'kubota'
  }
  if (selectedCategory === 'kubota-second-news') {
    return normalizedNews.includes('second') || normalizedNews.includes('kubotasecondhand')
  }
  if (selectedCategory === 'mahindra-dongfeng-news' || selectedCategory === 'mahindra-and-dongfeng-news') {
    return (normalizedNews.includes('mahindra') && normalizedNews.includes('dongfeng')) || normalizedNews.includes('mahindradongfeng') || normalizedNews.includes('mahindraanddongfeng')
  }
  if (selectedCategory === 'deutz-fahr-matador-news' || selectedCategory === 'deutz-fahr-and-matador-news' || selectedCategory === 'deutzfar-matador-news' || selectedCategory === 'deutzfhar-matador-news' || selectedCategory === 'deutzfhar-and-matador-news' || selectedCategory === 'deutzfar-and-matador-news') {
    return (normalizedNews.includes('deutz') && normalizedNews.includes('matador')) || normalizedNews.includes('deutzfahrmatador') || normalizedNews.includes('deutzfahrandmatador') || normalizedNews.includes('deutzfharandmatador') || normalizedNews.includes('deutzfarmatador')
  }
  if (selectedCategory === 'yanmar-news') {
    return normalizedNews === 'yanmar'
  }
  if (selectedCategory === 'myanmar-news') {
    return normalizedNews === 'myanmar'
  }
  return false
}

export default function NewsContainer({ newsList, companiesList, priceList = [] }: NewsContainerProps) {
  const { language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('ALL')
  const [selectedCompetitorCategory, setSelectedCompetitorCategory] = useState('ALL')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedBrandPriceFilter, setSelectedBrandPriceFilter] = useState('ALL')
  const [selectedCompanyGroup, setSelectedCompanyGroup] = useState('ALL')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(9)

  // FIX: Sync with URL query from BottomNav + FilterDrawer -> ?newsCategory= & ?competitor= & ?brandPrice= & ?company= & ?search= & ?date=
  useEffect(() => {
    const newsCat = searchParams.get('newsCategory')
    const comp = searchParams.get('competitor')
    const brandPrice = searchParams.get('brandPrice')
    const brandParam = searchParams.get('brand')
    const companyParam = searchParams.get('company')
    const searchParam = searchParams.get('search')
    const dateParam = searchParams.get('date')

    let shouldScroll = false

    if (newsCat && newsCat !== selectedNewsCategory) {
      setSelectedNewsCategory(newsCat)
      setSelectedCompetitorCategory('ALL')
      shouldScroll = true
    }
    if (comp && comp !== selectedCompetitorCategory) {
      setSelectedCompetitorCategory(comp)
      setSelectedNewsCategory('ALL')
      shouldScroll = true
    }
    const activeBrand = brandPrice || brandParam || 'ALL'
    if (activeBrand !== selectedBrandPriceFilter) {
      setSelectedBrandPriceFilter(activeBrand)
      if (activeBrand !== 'ALL') shouldScroll = true
    }
    if (companyParam && companyParam !== selectedCompanyGroup) {
      const companyLower = companyParam.toLowerCase()
      if (companyLower.includes('kubota') || companyLower === 'kubota') {
        setSelectedCompanyGroup('kubota')
      } else if (companyLower) {
        setSelectedCompanyGroup('other')
      }
      shouldScroll = true
    }
    if (searchParam !== null && searchParam !== searchTerm) {
      setSearchTerm(searchParam)
      shouldScroll = true
    }
    if (dateParam && dateParam !== selectedDate) {
      setSelectedDate(dateParam)
      shouldScroll = true
    }

    if (shouldScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [searchParams])

  const filteredNews = newsList.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (news.body && news.body.toLowerCase().includes(searchTerm.toLowerCase()))
    const selectedCategory = selectedNewsCategory !== 'ALL' ? selectedNewsCategory : selectedCompetitorCategory
    const matchesCategory = selectedCategory === 'ALL' || isCategoryMatch(news.category, selectedCategory)
    let matchesDate = true
    if (selectedDate !== '' && news.publishedAt) {
      const newsDateOnly = news.publishedAt.split('T')[0]
      matchesDate = newsDateOnly === selectedDate
    }
    return matchesSearch && matchesCategory && matchesDate
  })

  const filteredCompanies = companiesList?.filter((company) => {
    if (selectedCompanyGroup === 'ALL') return true
    return company.companyGroup === selectedCompanyGroup
  }) || []

  const displayedNews = filteredNews.slice(0, visibleCount)
  const isCompanyView = selectedCompanyGroup !== 'ALL'
  const isPriceView = selectedBrandPriceFilter !== 'ALL'
  const selectPriceBrand = (brand: string) => {
    setSelectedBrandPriceFilter(brand)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('brand')
    if (brand === 'ALL') params.delete('brandPrice')
    else params.set('brandPrice', brand)
    const query = params.toString()
    window.history.replaceState(null, '', query ? `/?${query}` : '/')
  }
  const handleLoadMore = (): void => { setVisibleCount((prev) => prev + 9) }

  return (
    <div>
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-stretch">
          <button type="button" onClick={() => setIsSidebarOpen(true)} aria-label={extraText(language).openFilters} className="flex h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700 shadow-sm transition hover:bg-red-100">
            <SlidersHorizontal className="h-5 w-5" /><span className="sr-only">{extraText(language).openFilters}</span>
          </button>
          <div className="min-w-0">
            <select id="news-selection" aria-label={t('newsSelections', language)} value={selectedNewsCategory} onChange={(e) => { setSelectedNewsCategory(e.target.value); setSelectedCompetitorCategory('ALL') }} className="h-11 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="ALL">{t('newsSelections', language)}</option>
              <option value="myanmar-news">{t('myanmarNews', language)}</option>
              <option value="exchange-rates">{t('exchangeRates', language)}</option>
              <option value="fuel-prices">{t('fuelPrices', language)}</option>
              <option value="crop-prices">{t('cropPrices', language)}</option>
            </select>
          </div>
          <div className="min-w-0">
            <select id="competitor-news" aria-label={t('competitorNews', language)} value={selectedCompetitorCategory} onChange={(e) => { setSelectedCompetitorCategory(e.target.value); setSelectedNewsCategory('ALL') }} className="h-11 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="ALL">{t('competitorNews', language)}</option>
              <option value="kubota-news">{t('kubotaNews', language)}</option>
              <option value="kubota-zt-news">{t('kubotaZtNews', language)}</option>
              <option value="kubota-second-news">{t('kubotaSecondNews', language)}</option>
              <option value="yanmar-news">{t('yanmarNews', language)}</option>
              <option value="john-deere-news">{t('johnDeereNews', language)}</option>
              <option value="new-holland-news">{t('newHollandNews', language)}</option>
              <option value="yto-news">{t('ytoNews', language)}</option>
              <option value="sonalika-news">{t('sonalikaNews', language)}</option>
              <option value="yamabisi-news">{t('yamabisiNews', language)}</option>
              <option value="mahindra-news">{t('mahindraNews', language)}</option>
              <option value="dongfeng-news">{t('dongfengNews', language)}</option>
              <option value="mahindra-dongfeng-news">{t('mahindraDongfengNews', language)}</option>
              <option value="deutzfar-matador-news">{t('deutzfarMatadorNews', language)}</option>
              <option value="other-brand-news">{t('otherBrandNews', language)}</option>
            </select>
          </div>
          <div className="min-w-0">
            <select id="daily-sales" aria-label={t('dailySalesReport', language)} defaultValue="" onChange={(e) => { if (e.target.value === 'DAILY_SALES') router.push('/daily-sales') }} className="h-11 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="">{t('dailySalesMenu', language)}</option>
              <option value="DAILY_SALES">{t('openDailySales', language)}</option>
            </select>
          </div>
          <div className="min-w-0">
            <select id="brand-prices" aria-label={t('allBrandPricesDefault', language)} value={selectedBrandPriceFilter} onChange={(e) => selectPriceBrand(e.target.value)} className="h-11 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="ALL">{t('allBrandPricesDefault', language)}</option>
              {PRICE_BRANDS.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </div>
          <div className="min-w-0">
            <select id="company-groups" aria-label={t('allCompaniesDefault', language)} value={selectedCompanyGroup} onChange={(e) => setSelectedCompanyGroup(e.target.value)} className="h-11 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="ALL">{t('allCompaniesDefault', language)}</option>
              <option value="kubota">{t('kubotaCompaniesOption', language)}</option>
              <option value="other">{t('otherBrandCompaniesOption', language)}</option>
            </select>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t('sidebarFilters', language)}>
          <button type="button" aria-label={extraText(language).closeFilters} onClick={() => setIsSidebarOpen(false)} className="absolute inset-0 bg-gray-900/30" />
          <aside className="absolute left-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-red-500">{t('sidebarFilters', language)}</p><h2 className="text-lg font-bold text-gray-900">{t('sidebarFilters', language)}</h2></div>
              <button type="button" onClick={() => setIsSidebarOpen(false)} aria-label={extraText(language).closeFilters} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <label htmlFor="sidebar-search" className="mb-2 block text-sm font-semibold text-gray-700">{t('searchByTitleOrText', language)}</label>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100"><Search className="h-4 w-4 shrink-0 text-red-600" /><input id="sidebar-search" type="text" placeholder={t('searchPlaceholder', language)} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none" /></div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <label htmlFor="sidebar-date" className="mb-2 block text-sm font-semibold text-gray-700">{t('dateFilter', language)}</label>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100"><CalendarDays className="h-4 w-4 shrink-0 text-red-600" /><input id="sidebar-date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none" /></div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <label htmlFor="sidebar-facebook-pages" className="mb-2 block text-sm font-semibold text-gray-700">{t('kmmKubotaFacebookPages', language)}</label>
                <select id="sidebar-facebook-pages" defaultValue="" onChange={(e) => { const facebookPage = facebookPages.find((page) => page.url === e.target.value); if (facebookPage) window.open(facebookPage.url, '_blank', 'noopener,noreferrer') }} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100">
                  <option value="">{t('selectFacebookPage', language)}</option>{facebookPages.map((page) => <option key={page.url} value={page.url}>{page.name}</option>)}
                </select>
              </div>
            </div>
          </aside>
        </div>
      )}

      {isPriceView && <PriceBrowser key={selectedBrandPriceFilter} brand={selectedBrandPriceFilter} priceList={priceList} onClose={() => selectPriceBrand('ALL')} />}

      {isCompanyView && !isPriceView && (
        <div className="mb-12"><h3 className="text-xl font-bold text-gray-900 mb-4">{selectedCompanyGroup === 'kubota' ? t('kubotaCompaniesOption', language) : t('otherBrandCompaniesOption', language)} {t('companiesDirectoryHeading', language)}</h3><CompanyCards companies={filteredCompanies} /></div>
      )}

      {!isCompanyView && !isPriceView && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayedNews.length > 0 ? displayedNews.map((news, index) => {
              const newsDetailId = news.slug?.current || news._id
              return (
                <Link href={`/news/${newsDetailId}`} key={index} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 overflow-hidden border border-gray-200 flex flex-col">
                  {news.mainImage && <div className="h-48 overflow-hidden bg-gray-100"><img src={urlFor(news.mainImage).url()} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" /></div>}
                  <div className="p-4 flex flex-col flex-grow">
                    {news.category && <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">{formatCategory(news.category, language)}</span>}
                    {news.publishedAt && <p className="text-xs text-gray-400 mb-2">{formatLocalizedDate(new Date(news.publishedAt), language, { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition mb-2"><NewsTitle title={news.title} textClassName="line-clamp-2" /></h2>
                    <span className="mt-auto text-xs font-semibold text-blue-600 flex items-center">{t('readFullStory', language)}</span>
                  </div>
                </Link>
              )
            }) : <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">{t('noNewsFound', language)}</div>}
          </div>
          {visibleCount < filteredNews.length && <div className="text-center mb-12"><button onClick={handleLoadMore} className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition duration-200 text-sm">{t('loadMoreNews', language)}</button></div>}
        </>
      )}

      {isPriceView ? null : isCompanyView ? <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-8 text-center text-white shadow-md"><h3 className="text-xl font-bold mb-2">{t('companyBannerTitle', language)}</h3><p className="text-red-100 text-sm mb-6">{t('companyBannerDesc', language)}</p><Link href="/companies" className="inline-block px-6 py-3 bg-white text-red-700 font-bold rounded-lg shadow hover:bg-gray-100 transition duration-200 text-sm">{t('viewFullDirectory', language)}</Link></div> : <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white shadow-md"><h3 className="text-xl font-bold mb-2">{t('searchPastNews', language)}</h3><p className="text-gray-300 text-sm mb-6">{t('searchPastNewsDesc', language)}</p><Link href="/archive" className="inline-block px-6 py-3 bg-white text-gray-900 font-bold rounded-lg shadow hover:bg-gray-100 transition duration-200 text-sm">{t('viewMonthlyArchive', language)}</Link></div>}
    </div>
  )
}

