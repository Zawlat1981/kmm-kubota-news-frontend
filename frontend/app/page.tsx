import { client } from '@/lib/sanity'
import Header from '@/components/Header'
import NewsContainer from '@/components/NewsContainer'
import PriceListSection from '@/components/PriceListSection' // အသစ်ထည့်လိုက်သော component

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

      {/* --- News Container & Price List --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 border-b-2 border-red-600 pb-2 text-gray-800">
          KMM Kubota News Portal
        </h1>
        
        {/* Google Sheets မှ ဈေးနှုန်းနှင့် Filter အပိုင်း */}
        <PriceListSection />

        {/* သတင်းများပြသသည့် အပိုင်း */}
        <NewsContainer newsList={newsList} />
      </div>
    </main>
  )
}