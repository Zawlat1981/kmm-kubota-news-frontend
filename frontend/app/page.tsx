import { client } from '@/lib/sanity'
import Header from '@/components/Header'
import NewsContainer from '@/components/NewsContainer'

interface NewsItem {
  title: string
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

async function getData(): Promise<{ newsList: NewsItem[]; companiesList: CompanyItem[] }> {
  const newsQuery = `*[_type == "newsPortal"] | order(publishedAt desc) {
    title,
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

  const [newsList, companiesList] = await Promise.all([
    client.fetch(newsQuery),
    client.fetch(companiesQuery),
  ])

  return { newsList, companiesList }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const { newsList, companiesList } = await getData()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* --- Header with Animated Logo --- */}
      <Header />

      {/* --- News Container --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 border-b-2 border-red-600 pb-2 text-gray-800">
          KMM Kubota News Portal
        </h1>
        
        {/* သတင်းများ နှင့် ကုမ္ပဏီ Filter များပြသသည့် အပိုင်း */}
        <NewsContainer newsList={newsList} companiesList={companiesList} />
      </div>
    </main>
  )
}