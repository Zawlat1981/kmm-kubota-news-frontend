'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Search, SlidersHorizontal, X } from 'lucide-react'
import { urlFor } from '../lib/sanity'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslatedTexts } from '@/hooks/useTranslatedTexts'
import { t } from '@/lib/i18n/uiText'

interface NewsItem {
  _id?: string
  title: string
  slug?: { current: string }
  category?: string
  publishedAt?: string
  mainImage?: Record<string, unknown>
  body?: string
}

interface CompanyItem {
  _id: string
  slug?: { current: string }
  companyGroup?: string
  companyName?: string
  category?: string
  brand?: string
  stateRegion?: string
  cityTownship?: string
  companyImage?: {
    asset?: Record<string, unknown>
    [key: string]: unknown
  }
  address?: string
  phone?: string
  email?: string
}

interface PriceItem {
  _id: string
  brand?: string
  modelName?: string
  itemType?: 'machine' | 'implement'
  category?: string
  series?: string
  parentModel?: string
  frontDozer?: 'with-front-dozer' | 'without-front-dozer'
  specialDozer?: 'with-special-dozer'
  frontLoader?: 'with-front-loader'
  horsepower?: number
  price?: number
  currency?: string
  image?: Record<string, unknown>
  notes?: string
}

interface NewsContainerProps {
  newsList: NewsItem[]
  companiesList?: CompanyItem[]
  priceList?: PriceItem[]
}

const kubotaModelNames = [
  'B2440s',
  'B2440s+SD',
  'L3208',
  'L3208+FD',
  'L4018',
  'L4018+FD',
  'L5228',
  'L5228+FD',
  'L5228+SD',
  'L5228+LA',
  'MU4902',
  'MU4902+FD',
  'MU5702',
  'MU5702+FD',
  'M6040SU',
  'M6040SU+FD',
  'M6040HI',
  'M6040HI+FD',
  'M6240SU',
  'M6240SU+FD',
  'M6240HI',
  'M6240HI+FD',
  'M7040',
  'M7040+FD',
  'M8540',
  'M8540+FD',
  'M8540+LA',
  'M9540',
  'M9540+FD',
  'M9540+LA',
  'M108s',
  'M108s+FD',
  'DC70G Pro',
  'SPV6-CMD',
  'U17-3 (107 Tons)',
  'KX033-4 (3 Tons)',
  'U55-6 (5 Tons)',
  'U55-6 Cabin (5 Tons)',
  'KX080-3 (8 Tons)',
]

const facebookPages = [
  { name: 'KMM Kubota Mawlamyine', url: 'https://www.facebook.com/kmmkubota' },
  { name: 'KMM Kubota Tharyarwaddy', url: 'https://www.facebook.com/kmmkubotatyd' },
  { name: 'KMM Kubota Nawnghkio', url: 'https://www.facebook.com/profile.php?id=100076295352470' },
]

function formatKubotaModelName(modelName: string, language: Parameters<typeof t>[1]) {
  if (modelName.endsWith('+FD')) {
    return `${modelName.slice(0, -3)} ${t('withFrontDozerLabel', language)}`
  }
  if (modelName.endsWith('+SD')) {
    return `${modelName.slice(0, -3)} ${t('withSpecialDozerLabel', language)}`
  }
  if (modelName.endsWith('+LA')) {
    return `${modelName.slice(0, -3)} ${t('withFrontLoaderLabel', language)}`
  }
  return modelName
}

function formatPriceItemModelName(item: PriceItem, language: Parameters<typeof t>[1]) {
  if (item.frontDozer === 'with-front-dozer') {
    return `${item.modelName} ${t('withFrontDozerLabel', language)}`
  }
  return item.modelName
}

function formatCategory(category?: string) {
  if (!category) return 'NEWS'
  if (category.includes('မြန်မာနိုင်ငံ') || category.includes('Myanmar')) return 'MYANMAR NEWS'
  if (category.includes('ဈေးနှုန်း') || category.includes('Crop Prices')) return 'CROP PRICES'
  if (category.includes('Second') || category.includes('second') || category.includes('ဒုတိယလက်သုံး')) return 'KUBOTA SECOND NEWS'
  if (category.includes('kubota') || category.includes('Kubota')) return 'KUBOTA NEWS'
  if (category.includes('Other Brand') || category.includes('အခြား')) return 'OTHER BRAND NEWS'
  return category.toUpperCase()
}

// One card's title, translated on demand — keeps each card's translation
// independent so a slow one doesn't block the rest of the grid.
function NewsCardTitle({ title }: { title: string }) {
  const { texts } = useTranslatedTexts([title])
  return <>{texts[0]}</>
}

function CompanyCardField({ text }: { text: string }) {
  const { texts } = useTranslatedTexts([text])
  return <>{texts[0]}</>
}

export default function NewsContainer({ newsList, companiesList, priceList = [] }: NewsContainerProps) {
  const { language } = useLanguage()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('ALL')
  const [selectedCompetitorCategory, setSelectedCompetitorCategory] = useState('ALL')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedBrandPriceFilter, setSelectedBrandPriceFilter] = useState('ALL')
  const [selectedPriceModel, setSelectedPriceModel] = useState('')
  const [selectedImplementIds, setSelectedImplementIds] = useState<string[]>([])
  const [selectedCompanyGroup, setSelectedCompanyGroup] = useState('ALL')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [visibleCount, setVisibleCount] = useState(9)

  const filteredNews = newsList.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (news.body && news.body.toLowerCase().includes(searchTerm.toLowerCase()))

    const selectedCategory = selectedNewsCategory !== 'ALL'
      ? selectedNewsCategory
      : selectedCompetitorCategory
    const matchesCategory = selectedCategory === 'ALL' ||
      news.category?.toLowerCase() === selectedCategory.toLowerCase()

    let matchesDate = true
    if (selectedDate !== '' && news.publishedAt) {
      const newsDateOnly = news.publishedAt.split('T')[0]
      matchesDate = newsDateOnly === selectedDate
    }

    return matchesSearch && matchesCategory && matchesDate
  })

  const availablePriceBrands = Array.from(
    new Set(priceList.map((item) => item.brand).filter((brand): brand is string => Boolean(brand)))
  )
  const priceBrands = ['Kubota', 'Yanmar', 'John Deere', 'New Holland', 'YTO']
    .filter((brand) => availablePriceBrands.includes(brand))

  const selectedBrandPrices = priceList.filter((item) => item.brand === selectedBrandPriceFilter)
  const modelOptions = selectedBrandPriceFilter === 'Kubota'
    ? kubotaModelNames.map((modelName) => ({
      value: modelName,
      title: formatKubotaModelName(modelName, language),
      label: formatKubotaModelName(modelName, language),
      modelName,
      frontDozer: undefined,
      frontLoader: undefined,
    }))
    : selectedBrandPrices
      .filter((item) => item.itemType !== 'implement' && item.modelName)
      .map((item) => ({
        value: `${item.modelName}|${item.frontDozer || ''}|${item.frontLoader || ''}`,
        title: [
          item.modelName,
          item.frontDozer === 'with-front-dozer' ? t('withFrontDozerLabel', language) : '',
        ].filter(Boolean).join(' '),
        label: item.frontDozer === 'with-front-dozer'
          ? `${item.modelName} ${t('withFrontDozerLabel', language)} & ${t('implementsLabel', language)}`
          : `${item.modelName} & ${t('implementsLabel', language)}`,
        modelName: item.modelName as string,
        frontDozer: item.frontDozer,
        frontLoader: item.frontLoader,
      }))
      .filter((item, index, options) => options.findIndex((option) => option.value === item.value) === index)
  const filteredPrices = selectedBrandPrices.filter(
    (item) => {
      const [selectedModelName, frontDozer, frontLoader] = selectedPriceModel.split('|')
      const modelName = selectedBrandPriceFilter === 'Kubota'
        ? selectedModelName.replace(/\+(FD|SD|LA)$/, '')
        : selectedModelName
      const exactModelName = selectedPriceModel
      if (item.itemType === 'implement') {
        return item.parentModel === exactModelName || item.parentModel === modelName
      }
      if (selectedBrandPriceFilter === 'Kubota') {
        const hasFrontDozer = selectedModelName.endsWith('+FD')
        const hasSpecialDozer = selectedModelName.endsWith('+SD')
        const hasFrontLoader = selectedModelName.endsWith('+LA')

        return (item.modelName === modelName || item.modelName === exactModelName) &&
          (hasFrontDozer ? item.frontDozer === 'with-front-dozer' : item.frontDozer !== 'with-front-dozer') &&
          (hasSpecialDozer ? item.specialDozer === 'with-special-dozer' : !item.specialDozer) &&
          (hasFrontLoader ? item.frontLoader === 'with-front-loader' : !item.frontLoader)
      }
      return item.modelName === modelName &&
        (frontDozer ? item.frontDozer === frontDozer : true) &&
        (frontLoader ? item.frontLoader === frontLoader : true)
    }
  )

  const filteredCompanies = companiesList?.filter((company) => {
    if (selectedCompanyGroup === 'ALL') return true
    return company.companyGroup === selectedCompanyGroup
  }) || []

  const displayedNews = filteredNews.slice(0, visibleCount)

  const isCompanyView = selectedCompanyGroup !== 'ALL'
  const isPriceView = selectedBrandPriceFilter !== 'ALL'
  const selectedModelTitle = modelOptions.find((model) => model.value === selectedPriceModel)?.title
  const selectedMachine = filteredPrices.find((item) => item.itemType !== 'implement')
  const selectedImplements = filteredPrices.filter((item) => item.itemType === 'implement')
  const totalPrice = (selectedMachine?.price || 0) + selectedImplements
    .filter((item) => selectedImplementIds.includes(item._id))
    .reduce((total, item) => total + (item.price || 0), 0)

  const handleLoadMore = (): void => {
    setVisibleCount((prev) => prev + 9)
  }

  return (
    <div>
      {/* --- DASHBOARD FILTER SECTION --- */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-sm mb-8">
        <div className="grid min-w-[980px] grid-cols-6 gap-4 items-stretch">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar filters"
            className="flex h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700 shadow-sm transition hover:bg-red-100"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span className="sr-only">Open sidebar filters</span>
          </button>

          <div className="min-w-0">
            <select id="news-selection" aria-label="News Selections" value={selectedNewsCategory} onChange={(e) => { setSelectedNewsCategory(e.target.value); setSelectedCompetitorCategory('ALL') }} className="h-11 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="ALL">{t('newsSelections', language)}</option>
              <option value="myanmar-news">{t('myanmarNews', language)}</option>
              <option value="exchange-rates">{t('exchangeRates', language)}</option>
              <option value="fuel-prices">{t('fuelPrices', language)}</option>
              <option value="crop-prices">{t('cropPrices', language)}</option>
            </select>
          </div>

          <div className="min-w-0">
            <select id="competitor-news" aria-label="Competitor News" value={selectedCompetitorCategory} onChange={(e) => { setSelectedCompetitorCategory(e.target.value); setSelectedNewsCategory('ALL') }} className="h-11 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="ALL">{t('competitorNews', language)}</option>
              <option value="kubota-news">{t('kubotaNews', language)}</option>
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
            <select id="daily-sales" aria-label="KMM Kubota Daily Sales Report" defaultValue="" onChange={(e) => { if (e.target.value === 'DAILY_SALES') router.push('/daily-sales') }} className="h-11 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="">{t('dailySalesMenu', language)}</option>
              <option value="DAILY_SALES">{t('openDailySales', language)}</option>
            </select>
          </div>

          <div className="min-w-0">
            <select id="brand-prices" aria-label="All Brand Prices" value={selectedBrandPriceFilter} onChange={(e) => { setSelectedBrandPriceFilter(e.target.value); setSelectedPriceModel(''); setSelectedImplementIds([]) }} className="h-11 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="ALL">{t('allBrandPricesDefault', language)}</option>
              {priceBrands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </div>

          <div className="min-w-0">
            <select id="company-groups" aria-label="All Companies" value={selectedCompanyGroup} onChange={(e) => setSelectedCompanyGroup(e.target.value)} className="h-11 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="ALL">{t('allCompaniesDefault', language)}</option>
              <option value="kubota">Kubota Companies</option>
              <option value="other">Other Brand Companies</option>
            </select>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Sidebar filters">
          <button
            type="button"
            aria-label="Close sidebar filters"
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-gray-900/30"
          />
          <aside className="absolute left-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-500">{t('sidebarFilters', language)}</p>
                <h2 className="text-lg font-bold text-gray-900">{t('sidebarFilters', language)}</h2>
              </div>
              <button type="button" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar filters" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <label htmlFor="sidebar-search" className="mb-2 block text-sm font-semibold text-gray-700">{t('searchByTitleOrText', language)}</label>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100">
                  <Search className="h-4 w-4 shrink-0 text-red-600" />
                  <input id="sidebar-search" type="text" placeholder={t('searchPlaceholder', language)} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none" />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <label htmlFor="sidebar-date" className="mb-2 block text-sm font-semibold text-gray-700">{t('dateFilter', language)}</label>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100">
                  <CalendarDays className="h-4 w-4 shrink-0 text-red-600" />
                  <input id="sidebar-date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none" />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <label htmlFor="sidebar-facebook-pages" className="mb-2 block text-sm font-semibold text-gray-700">{t('kmmKubotaFacebookPages', language)}</label>
                <select id="sidebar-facebook-pages" defaultValue="" onChange={(e) => { const facebookPage = facebookPages.find((page) => page.url === e.target.value); if (facebookPage) window.open(facebookPage.url, '_blank', 'noopener,noreferrer') }} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100">
                  <option value="">{t('selectFacebookPage', language)}</option>
                  {facebookPages.map((page) => <option key={page.url} value={page.url}>{page.name}</option>)}
                </select>
              </div>
            </div>
          </aside>
        </div>
      )}

      {selectedBrandPriceFilter !== 'ALL' && !selectedPriceModel && (
        <section className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {selectedBrandPriceFilter} {t('modelsLabel', language)}
            </h3>
            <button
              type="button"
              onClick={() => {
                setSelectedBrandPriceFilter('ALL')
                setSelectedPriceModel('')
                setSelectedImplementIds([])
              }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              {t('backToMenu', language)}
            </button>
          </div>
          <div className="max-w-xl bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <label htmlFor="price-model" className="block text-sm font-semibold text-gray-700 mb-2">
              {t('modelsLabel', language)}
            </label>
            <select
              id="price-model"
              value={selectedPriceModel}
              onChange={(e) => {
                setSelectedPriceModel(e.target.value)
                setSelectedImplementIds([])
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
            >
              <option value="">{t('modelSelectionDefault', language)}</option>
              {modelOptions.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>
        </section>
      )}

      {selectedPriceModel && (
        <section className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {selectedModelTitle || selectedPriceModel} {t('pricesAndImplementsLabel', language)}
            </h3>
            <button
              type="button"
              onClick={() => {
                setSelectedPriceModel('')
                setSelectedImplementIds([])
              }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              {t('backToModels', language)}
            </button>
          </div>
          {filteredPrices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrices.map((item) => (
                <article
                  key={item._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {item.image && (
                    <div className="h-40 overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={urlFor(item.image).url()}
                        alt={formatPriceItemModelName(item, language) || 'Machinery'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    {item.itemType !== 'implement' && (
                      <p className="text-sm text-gray-500">{item.brand}</p>
                    )}
                    <h4 className="text-lg font-bold text-gray-900">
                      {formatPriceItemModelName(item, language)}
                    </h4>
                    {item.itemType !== 'implement' && item.category && (
                      <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                    )}
                    {item.itemType !== 'implement' && typeof item.horsepower === 'number' && (
                      <p className="text-sm text-gray-600 mt-1">{item.horsepower} hp</p>
                    )}
                    {typeof item.price === 'number' && (
                      <p className="text-green-700 font-semibold mt-3">
                        {item.price.toLocaleString()} {item.currency || ''}
                      </p>
                    )}
                    {item.notes && <p className="text-sm text-gray-500 mt-2">{item.notes}</p>}
                    {item.itemType === 'implement' && (
                      <label className="flex items-center gap-2 mt-4 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedImplementIds.includes(item._id)}
                          onChange={() => setSelectedImplementIds((current) => current.includes(item._id)
                            ? current.filter((id) => id !== item._id)
                            : [...current, item._id])}
                          className="h-4 w-4 accent-red-600"
                        />
                        {t('chooseImplementsLabel', language)}
                      </label>
                    )}
                  </div>
                </article>
              ))}
              {selectedMachine && (
                <aside className="md:col-span-2 lg:col-span-3 bg-red-50 border border-red-200 rounded-xl p-5">
                  <p className="text-sm text-gray-700">
                    {t('machinePriceLabel', language)}: {selectedMachine.price?.toLocaleString()} {selectedMachine.currency || ''}
                  </p>
                  <p className="text-xl font-bold text-red-700 mt-2">
                    {t('totalPriceLabel', language)}: {totalPrice.toLocaleString()} {selectedMachine.currency || ''}
                  </p>
                </aside>
              )}
            </div>
          ) : (
            <p className="bg-white p-6 rounded-xl border border-gray-200 text-sm text-gray-500">
              No published prices found for {selectedBrandPriceFilter}.
            </p>
          )}
        </section>
      )}

      {/* --- COMPANIES DIRECTORY PREVIEW --- */}
      {isCompanyView && !isPriceView && (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {selectedCompanyGroup === 'kubota' ? t('kubotaCompaniesOption', language) : t('otherBrandCompaniesOption', language)}{' '}
            {t('companiesDirectoryHeading', language)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => {
                const detailId = company.slug?.current || company._id
                return (
                  <Link
                    href={`/companies/${detailId}`}
                    key={company._id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col group"
                  >
                    {company.companyImage ? (
                      <div className="h-40 overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={urlFor(company.companyImage).url()}
                          alt={company.companyName || 'Company'}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-red-50 flex items-center justify-center text-red-500 font-bold text-xl">
                        🏢 {company.companyName?.charAt(0) || 'C'}
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-grow">
                      <h4 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-red-600 transition">
                        {company.companyName}
                      </h4>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        {company.brand && (
                          <div className="flex items-center gap-2">
                            <span>🏷️</span>
                            <span className="font-medium text-gray-700">{t('brand', language)}:</span>{' '}
                            <CompanyCardField text={company.brand} />
                          </div>
                        )}
                        {(company.cityTownship || company.stateRegion) && (
                          <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span className="font-medium text-gray-700">{t('region', language)}:</span>{' '}
                            <CompanyCardField
                              text={[company.cityTownship, company.stateRegion].filter(Boolean).join(', ')}
                            />
                          </div>
                        )}
                      </div>

                      <span className="mt-auto text-xs font-semibold text-blue-600 flex items-center gap-1">
                        {t('viewDetailArrow', language)}
                      </span>
                    </div>
                  </Link>
                )
              })
            ) : (
              <p className="col-span-full text-sm text-gray-500 bg-white p-6 rounded-xl border border-gray-200 text-center">
                {t('noCompanyInfo', language)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* --- NEWS GRID SECTION (company ရွေးထားချိန်မှာ hide လုပ်မည်) --- */}
      {!isCompanyView && !isPriceView && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayedNews.length > 0 ? (
              displayedNews.map((news, index) => {
                const newsDetailId = news.slug?.current || news._id
                return (
                  <Link
                    href={`/news/${newsDetailId}`}
                    key={index}
                    className="group bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 overflow-hidden border border-gray-200 flex flex-col"
                  >
                    {news.mainImage && (
                      <div className="h-48 overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={urlFor(news.mainImage).url()}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    )}

                    <div className="p-4 flex flex-col flex-grow">
                      {news.category && (
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                          {formatCategory(news.category)}
                        </span>
                      )}

                      {news.publishedAt && (
                        <p className="text-xs text-gray-400 mb-2">
                          {new Date(news.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}

                      <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition line-clamp-2 mb-2">
                        <NewsCardTitle title={news.title} />
                      </h2>

                      <span className="mt-auto text-xs font-semibold text-blue-600 flex items-center">
                        {t('readFullStory', language)}
                      </span>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                {t('noNewsFound', language)}
              </div>
            )}
          </div>

          {/* --- LOAD MORE BUTTON --- */}
          {visibleCount < filteredNews.length && (
            <div className="text-center mb-12">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition duration-200 text-sm"
              >
                {t('loadMoreNews', language)}
              </button>
            </div>
          )}
        </>
      )}

      {/* --- BOTTOM SECTION: Archive (news view) or Full Directory link (company view) --- */}
      {isPriceView ? null : isCompanyView ? (
        <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-8 text-center text-white shadow-md">
          <h3 className="text-xl font-bold mb-2">{t('companyBannerTitle', language)}</h3>
          <p className="text-red-100 text-sm mb-6">{t('companyBannerDesc', language)}</p>
          <Link
            href="/companies"
            className="inline-block px-6 py-3 bg-white text-red-700 font-bold rounded-lg shadow hover:bg-gray-100 transition duration-200 text-sm"
          >
            {t('viewFullDirectory', language)}
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white shadow-md">
          <h3 className="text-xl font-bold mb-2">{t('searchPastNews', language)}</h3>
          <p className="text-gray-300 text-sm mb-6">{t('searchPastNewsDesc', language)}</p>
          <Link
            href="/archive"
            className="inline-block px-6 py-3 bg-white text-gray-900 font-bold rounded-lg shadow hover:bg-gray-100 transition duration-200 text-sm"
          >
            {t('viewMonthlyArchive', language)}
          </Link>
        </div>
      )}
    </div>
  )
}