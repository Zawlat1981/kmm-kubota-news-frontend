export const dynamic = 'force-dynamic'
export const revalidate = 0

import { client } from '../Lib/sanity'
import NewsContainer from '@/components/NewsContainer'

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

export default async function Home() {
  const newsList = await getNews()

  return (
    <main className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 border-b-2 border-red-600 pb-2 text-gray-800">
        KMM Kubota News Portal
      </h1>
      
      {/* Client Component သို့ Data လွှဲပြောင်းပေးခြင်း */}
      <NewsContainer newsList={newsList} />
    </main>
  )
}