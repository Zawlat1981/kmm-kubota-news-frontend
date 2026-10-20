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
  // FIX: newsPortal + news both - so 17th old news also shows
  const newsQuery = `*[_type in ["newsPortal", "news"]] | order(publishedAt desc) {
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
        {/* FIX: flex + LanguageSwitcher - this is why dropdown was not showing */}
        <div className="flex justify-between items-center mb-6 border-b-2 border-red-600 pb-2">
          <h1 className="text-3xl font-bold text-gray-800">
            KMM Kubota News Portal
          </h1>
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

