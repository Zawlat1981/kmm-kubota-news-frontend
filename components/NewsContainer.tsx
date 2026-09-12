'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
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
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedBrandPriceFilter, setSelectedBrandPriceFilter] = useState('ALL')
  const [selectedPriceModel, setSelectedPriceModel] = useState('')
  const [selectedImplementIds, setSelectedImplementIds] = useState<string[]>([])
  const [selectedCompanyGroup, setSelectedCompanyGroup] = useState('ALL')

  const [visibleCount, setVisibleCount] = useState(9)

  const filteredNews = newsList.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (news.body && news.body.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === 'ALL' ||
      news.category?.toLowerCase() === selectedCategory.toLowerCase()

    let matchesDate = true
    if (selectedDate !== '' && news.publishedAt) {
      const newsDateOnly = news.publishedAt.split('T')[0]
      matchesDate = newsDateOnly === selectedDate
    }

    return matchesSearch && matchesCategory && matchesDate
  })

  const priceBrands = Array.from(
    new Set(priceList.map((item) => item.brand).filter((brand): brand is string => Boolean(brand)))
  )

  const selectedBrandPrices = priceList.filter((item) => item.brand === selectedBrandPriceFilter)
  const modelOptions = selectedBrandPrices
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
      const [modelName, frontDozer, frontLoader] = selectedPriceModel.split('|')
      if (item.itemType === 'implement') return item.parentModel === modelName
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
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <div>
          <input
            type="text"
            placeholder={t('searchPlaceholder', language)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 placeholder-gray-500 bg-white"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
          >
            <option value="ALL">{t('brandSelectionDefault', language)}</option>
            <option value="kubota-news">Kubota News</option>
            <option value="kubota-second-news">Kubota Second News</option>
            <option value="yanmar-news">Yanmar News</option>
            <option value="john-deere-news">John Deere News</option>
            <option value="new-holland-news">New Holland News</option>
            <option value="yto-news">YTO News</option>
            <option value="sonalika-news">Sonalika News</option>
            <option value="yamabisi-news">Yamabisi News</option>
            <option value="mahindra-news">Mahindra News</option>
            <option value="dongfeng-news">Dongfeng News</option>
            <option value="deutzfar-matador-news">DeutzFhar & Matador News</option>
            <option value="crop-prices">Crop Prices</option>
            <option value="fuel-prices">Fuel Prices</option>
            <option value="exchange-rates">Exchange Rates</option>
            <option value="myanmar-news">Myanmar News</option>
            <option value="other-brand-news">Other Brand News</option>
          </select>
        </div>

        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
          />
        </div>

        <div>
          <select
            value={selectedBrandPriceFilter}
            onChange={(e) => {
              if (e.target.value === 'CHECK_STOCK') {
                router.push('/internal/login')
                return // don't update filter state — keep dropdown showing "All Brand Prices"
              }
              setSelectedBrandPriceFilter(e.target.value)
              setSelectedPriceModel('')
              setSelectedImplementIds([])
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
          >
            <option value="ALL">{t('allBrandPricesDefault', language)}</option>
            {priceBrands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
            <option value="CHECK_STOCK">🔒 Check Stock</option>
          </select>
        </div>

        <div>
          <select
            value={selectedCompanyGroup}
            onChange={(e) => setSelectedCompanyGroup(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white font-medium text-red-600"
          >
            <option value="ALL">{t('allCompaniesDefault', language)}</option>
            <option value="kubota">{t('kubotaCompaniesOption', language)}</option>
            <option value="other">{t('otherBrandCompaniesOption', language)}</option>
          </select>
        </div>
      </div>

      {selectedBrandPriceFilter !== 'ALL' && !selectedPriceModel && (
        <section className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {selectedBrandPriceFilter} {t('modelsLabel', language)}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modelOptions.map((model) => {
              const machine = selectedBrandPrices.find(
                (item) => item.modelName === model.modelName &&
                  item.frontDozer === model.frontDozer &&
                  item.frontLoader === model.frontLoader
              )

              return (
                <button
                  type="button"
                  key={model.value}
                  onClick={() => {
                    setSelectedPriceModel(model.value)
                    setSelectedImplementIds([])
                  }}
                  className="text-left bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:border-red-500 hover:shadow-md transition"
                >
                  {machine?.image && (
                    <div className="h-32 overflow-hidden bg-gray-100 rounded-md mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={urlFor(machine.image).url()}
                        alt={model.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h4 className="font-bold text-gray-900">{model.label}</h4>
                  {machine?.price != null && (
                    <p className="text-green-700 font-semibold mt-2">
                      {machine.price.toLocaleString()} {machine.currency || ''}
                    </p>
                  )}
                </button>
              )
            })}
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
                        alt={item.modelName || 'Machinery'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    {item.itemType !== 'implement' && (
                      <p className="text-sm text-gray-500">{item.brand}</p>
                    )}
                    <h4 className="text-lg font-bold text-gray-900">{item.modelName}</h4>
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