import { client } from '@/lib/sanity'
import NewsContainer from '@/components/NewsContainer'
import LanguageSwitcher from '@/components/LanguageSwitcher'

interface NewsItem {
  title: string
  brand?: string
  slug: { current: string }
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
  companyImage?: Record<string, unknown>
  phone?: string
  address?: string
  website?: string
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

async function getData(): Promise<{
  newsList: NewsItem[]
  companiesList: CompanyItem[]
  priceList: PriceItem[]
}> {
  const newsQuery = `*[_type == "newsPortal"] | order(publishedAt desc) {
    title,
    brand,
    slug,
    category,
    publishedAt,
    mainImage,
    body
  }`

  const companiesQuery = `*[_type == "company"]{
    _id,
    companyGroup,
    companyName,
    category,
    brand,
    stateRegion,
    cityTownship,
    slug,
    companyImage,
    phone,
    address,
    website,
    email,
  }`

  const priceListQuery = `*[_type == "priceList"] | order(brand asc, modelName asc){
    _id,
    brand,
    modelName,
    itemType,
    category,
    series,
    parentModel,
    frontDozer,
    specialDozer,
    frontLoader,
    configuration,
    horsepower,
    price,
    currency,
    image,
    notes
  }`

  const [newsList, companiesList, priceList] = await Promise.all([
    client.fetch(newsQuery),
    client.fetch(companiesQuery),
    client.fetch(priceListQuery),
  ])

  return { newsList, companiesList, priceList }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const { newsList, companiesList, priceList } = await getData()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6 border-b-2 border-red-600 pb-2">
          <div className="flex items-center gap-3">
            {/* eslint-disable */}
            <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className="cursor-pointer group">
              <img 
                src="/kubota-logo.png" 
                alt="Kubota Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-red-600 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </a>
            {/* eslint-enable */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              KMM Kubota News Portal
            </h1>
          </div>
          <LanguageSwitcher />
        </div>
        
        <NewsContainer
          newsList={newsList}
          companiesList={companiesList}
          priceList={priceList}
        />
      </div>
    </main>
  )
}