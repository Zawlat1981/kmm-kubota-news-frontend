export const dynamic = 'force-dynamic'
export const revalidate = 0
import Link from 'next/link'
import { client, urlFor } from '../Lib/sanity'

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

function formatCategory(category?: string) {
  if (!category) return 'NEWS'
  if (category.includes('မြန်မာနိုင်ငံ') || category.includes('Myanmar')) return 'MYANMAR NEWS'
  if (category.includes('ဈေးနှုန်း') || category.includes('Crop Prices')) return 'CROP PRICES'
  if (category.includes('kubota') || category.includes('Kubota')) return 'KUBOTA NEWS'
  if (category.includes('Second') || category.includes('second') || category.includes('ဒုတိယလက်သုံး')) return 'KUBOTA SECOND NEWS'
  if (category.includes('Other Brand') || category.includes('အခြား')) return 'OTHER BRAND NEWS'
  return category.toUpperCase()
}

export default async function Home() {
  const newsList = await getNews()

  return (
    <main className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 border-b-2 border-red-600 pb-2 text-gray-800">
        KMM Kubota News Portal
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsList.map((news, index) => (
          <Link 
            href={`/news/${news.slug?.current}`} 
            key={index}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 overflow-hidden border border-gray-200 flex flex-col"
          >
            {news.mainImage && (
              <div className="h-48 overflow-hidden bg-gray-100">
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

              {/* ထည့်သွင်းပေးလိုက်သည့် ရက်စွဲပြကွက် */}
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
                {news.title}
              </h2>
              
              {news.body && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {news.body}
                </p>
              )}

              <span className="mt-auto text-xs font-semibold text-blue-600 flex items-center">
                Read full story →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}