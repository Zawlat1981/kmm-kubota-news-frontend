import { client } from '@/lib/sanity'
import Header from '@/components/Header'
import NewsContainer from '@/components/NewsContainer'
import Link from 'next/link'

interface NewsItem {
  title: string
  slug: { current: string }
  category?: string
  publishedAt?: string
  mainImage?: any
  body?: string
}

async function getNews(): Promise<NewsItem[]> {
  const query = `*[_type == "newsPortal"] | order(publishedAt desc) {
    title,
    slug,
    category,
    publishedAt,
    mainImage,
    body
  }`
  return await client.fetch(query)
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const newsList = await getNews()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* --- Header with Animated Logo --- */}
      <Header />

      {/* --- Navbar / Extra Menu Bar for Company Directory --- */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Welcome to KMM Kubota News & Updates</span>
          <Link 
            href="/companies" 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center gap-2"
          >
            🏢 Company & Dealer Directory
          </Link>
        </div>
      </div>

      {/* --- News Container --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 border-b-2 border-red-600 pb-2 text-gray-800">
          KMM Kubota News Portal
        </h1>
        
        {/* သတင်းများပြသသည့် အပိုင်း (မူလအတိုင်း အပြည့်အစုံ ပေါ်မည်) */}
        <NewsContainer newsList={newsList} />
      </div>
    </main>
  )
}